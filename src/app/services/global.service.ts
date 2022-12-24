import { AssessmentLevels, AssessmentModel, AssessParamterModel, ScoreAssessmentModel } from './../models/asses-param';
import { AuthService } from 'src/app/core/services/auth.service';
import { StudentReminder, LessonReminder, ReminderType, Reminder } from './../models/remider';
import { ReminderService } from './../api/reminder.service';
import { AttendanceModel, AttendanceStatus } from '../models/attendance-model';
import { ClassService } from './../api/class.service';
import { ScheduleTimeModel } from 'src/app/models/schedule';
import { Subject, BehaviorSubject, ReplaySubject, forkJoin } from 'rxjs';
import { Ring } from './../models/day';
import { Lesson } from 'src/app/models/lessons';
import { ClassModel, ClassSessionModel } from './../models/class';
import { StorageService } from './../core/services/storage.service';
import { Injectable } from '@angular/core';
import { ScheduleService } from '../api/schedule.service';
import { StudentsService } from '../api/students.service';
import { LessonService } from '../api/lesson.service';
import { StudentModel } from '../models/student';
import { AssessmentService } from '../api/assessment.service';
import { resolve } from 'dns';
const CLASS_STORAGE = "CLASSAID_CLASS";

@Injectable({
    providedIn: 'root'
})
export class GlobalService {


    public teacherId: number;
    public todayDay: number;
    public rings: Ring[];//Ring is diffrent for each school & grade (& maybe class)

    ready$ = new BehaviorSubject<boolean>(false);

    selectedClass$ = new BehaviorSubject<ClassModel>(null);

    public classSessions$ = new BehaviorSubject<ClassSessionModel[]>([]);
    public currentSession: ClassSessionModel | undefined;

    public todayShedules: ScheduleTimeModel[];
    public callRolling: AttendanceModel[];


    constructor(private storageService: StorageService,
        private studentsService: StudentsService,
        private authService: AuthService,
        private assessmentService: AssessmentService,
        private classService: ClassService,
        private reminderService: ReminderService,
        public lessonService: LessonService,
        private scheduleService: ScheduleService) {
        const user = authService.getProfile();
        if (user) {
            this.teacherId = authService.getProfile().id;
        }

        this.todayDay = (new Date().getDay() + 1) % 7;



    }

    //When selectedClass is changed then rings & students must be reloaded
    public set selectedClass(vClass: ClassModel) {

        this.reminderService.getActiveClassReminders(vClass.id).then(x => {

        });
        //load students of the class
        //NOTE: getCallRolls will load all daysession callRollings(include all sessions) but order by time desc
        //--So last state of the attendance will be considered
        this.classService.getCallRolls(vClass.id).then(callRollings => {
            this.studentsService.getStudentsOfClass(vClass.id).then(students => {
                if (callRollings && callRollings.length > 0) {
                    students.forEach(student => {
                        //NOTE: will find last state of the students
                        const attendance = callRollings.find(x => x.studentId == student.id);
                        //TODO: handle if not foumd
                        student.attendanceStatus = attendance?.status;
                    });
                    this.studentsService.students$.next(students);
                }

            });
        });

        this.assessmentService.getParameters(0, vClass.gradeId).then(params => {

        })

        //Notes:
        //1. First Load Lessons of the Grade Of School
        //2. Load all sessions of the Class(Selected Class)
        //      2.1 fill book,lesson fields of each session
        //      2.2 Calc and apply sessions stats of each book to lessons
        //      2.3 find CurrentSession if exist and load its reminders
        //      2.4 Emit classSessions$ subject
        //3. Then load rings of Grade Of School(Event Class if reqiured) to load schdules
        //4. Load Schedules of the Class(Selected Class) Then:
        //      4.1 set Ring(object),Lesson(object) to each schedule by ringId,lessonId provided by prev steps
        //      4.2 filter Today Schedules
        //      4.3 Fill Today Schedules sessions


        this.lessonService.getBooks(vClass.schoolId, vClass.gradeId).then(books => {

            //2,3. Loading Rings
            Promise.all(
                [this.classService.getTodaySessionsByClass(vClass.id),
                this.classService.getAllSessionsByClass(vClass.id),
                this.scheduleService.getRings(vClass.schoolId, vClass.gradeId)])
                .then(async ([today_sessions, sessions, rings]) => {
                    //2.Step: 
                    await this.initSessionsAsync(today_sessions, sessions, books);

                    this.rings = rings;
                    //4. Loading Schedules
                    this.scheduleService.get(vClass.id).then(schdule => {
                        if (schdule) {
                            schdule.scheduleTimes.forEach(st => {
                                st.ring = this.rings.find(x => x.id == st.ringId);
                                //lessonService.books$ filled when getBooks called
                                st.lesson = this.lessonService.books$.value.find(x => x.id == st.lessonId);
                            });

                            //4.2 Clone the schedules to make it non-changable
                            this.todayShedules = [...schdule.scheduleTimes.filter(x => x.dayNo == this.todayDay)];
                            this.todayShedules.forEach(sch => {
                                //4.3 
                                sch.session = today_sessions.find(x => x.scheduleTimeId == sch.id);
                            })
                        }

                        this.selectedClass$.next(vClass);
                        this.ready$.next(true)
                    });
                });
        });

    }
    public get selectedClass() {
        return this.selectedClass$.value;
    }

    public get sessions() {
        return this.classSessions$.value;
    }

    async initSessionsAsync(today_sessions: ClassSessionModel[], sessions2: ClassSessionModel[], books: Lesson[]): Promise<boolean> {
        return new Promise(async resolve => {
            sessions2.forEach(s => {
                s.book = books.find(x => x.id == s.lessonId);
                s.lesson = this.lessonService.allLessons$.value.find(x => x.id == s.subLessonId);
            });
            today_sessions.forEach(s => {
                s.avgAssessMeasure = this.findLevelByValue(s.averageAssessment);
                s.book = books.find(x => x.id == s.lessonId);
                s.lesson = this.lessonService.allLessons$.value.find(x => x.id == s.subLessonId);
            });
            //2.2 Proccesing and applying stats of each lesson
            this.initBooks(books, sessions2);

            //2.3 find currentSession and its reminders
            this.currentSession = today_sessions.find(x => x.endTime == null);

            if (this.currentSession) {
                await this.initCurrentSessionAsync(today_sessions);
            }
            else

                this.classSessions$.next(sessions2);

            return resolve(true);
        });

    }

    initBooks(books: Lesson[], sessions: ClassSessionModel[]) {
        books.forEach(b => {
            const book_sessions = sessions.filter(x => x.lessonId == b.id);
            //b.sessions = this.sessions.filter(x => x.lessonId == b.id);
            b.sessionsCount = book_sessions.length;
            if (book_sessions.length > 0) {
                const lastLessonId = book_sessions[book_sessions.length - 1].subLessonId;
                b.lastSessionLesson = this.lessonService.allLessons$.value.find(x => x.id == lastLessonId);
            }

        });
    }

    async initCurrentSessionAsync(sessions) {
        return Promise.all(
            [this.reminderService.getSessionReminders(this.currentSession.id),
            this.assessmentService.getSessionAssessments(this.currentSession.id),
            this.classService.getLessonHomeWorks(this.currentSession.lessonId)])
            .then(([reminders, assessments, homeWorks]) => {
                this.currentSession.reminders = reminders;
                this.currentSession.assessments = assessments.filter(x => x.level > 0);
                this.currentSession.scores = assessments.filter(x => x.level == 0).map(x => x as ScoreAssessmentModel);
                this.currentSession.homeWorks = homeWorks;
                this.classSessions$.next(sessions);
            });

    }


    startClass(session: ClassSessionModel): Promise<boolean> {
        return new Promise((resolve, reject) => {
            session.classId = this.selectedClass.id;
            this.classService.addTask(session).then(result => {
                if (!result) {
                    reject(false);
                    return;
                }
                //To prevent circular reference in saving to storage(no lesson stats)
                const raw_session = { ...session };
                raw_session.book = null;
                raw_session.lesson = null;

                this.currentSession = session;

                //Updating Schdules
                if (session.scheduleTimeId)
                    this.todayShedules.find(x => x.id == session.scheduleTimeId).session = session;
                //lesson filled in Class.ts(caller)
                session.book.sessionsCount += 1;
                session.book.lastSessionLesson = this.lessonService.allLessons$.value.find(x => x.id == session.subLessonId);

                this.classSessions$.next([...this.classSessions$.value, session]);

                this.storageService.saveStorage(CLASS_STORAGE, JSON.stringify(raw_session));
                resolve(true);
            })
        })


    }

    endClass() {
        this.classService.endTask(this.currentSession.id).then(result => {
            this.currentSession.endTime = new Date();
            this.currentSession = undefined;
            const sessions = this.classSessions$.value;
            // const currentSession = sessions[sessions.length - 1];
            // currentSession.endTime = new Date();

            this.storageService.removeStorage(CLASS_STORAGE);
            this.classSessions$.next(sessions);
        });
    }

    findLevelByValue(value: number) {
        return AssessmentLevels.find(x => x.value == Math.ceil(value))
    }

    cloneArray(array: any[]) {
        return JSON.parse(JSON.stringify(array));
    }
}
