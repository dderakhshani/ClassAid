import { AuthService } from 'src/app/core/services/auth.service';
import { StudentReminder, LessonReminder, ReminderType } from './../models/remider';
import { ReminderService } from './../api/reminder.service';
import { AttendanceModel, AttendanceStatus } from '../models/attendance-model';
import { ClassService } from './../api/class.service';
import { ScheduleTimeModel } from 'src/app/models/schedule';
import { Subject, BehaviorSubject, ReplaySubject } from 'rxjs';
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

        //TODO: must remove and load from server
        // const currentClassJson = this.storageService.loadStorage(CLASS_STORAGE);
        // if (currentClassJson) {
        //     this.currentSession = JSON.parse(currentClassJson);
        //     this.currentSession.book = Object.assign(new Lesson(), this.currentSession.book);
        //     this.currentSession.lesson = Object.assign(new Lesson(), this.currentSession.lesson);

        // }

    }

    //When selectedClass is changed then rings & students must be reloaded
    public set selectedClass(vClass: ClassModel) {

        //load students of the class
        this.classService.getCallRolls(vClass.id).then(callRollings => {
            this.studentsService.getStudentsOfClass(vClass.id).then(students => {
                if (callRollings && callRollings.length > 0) {
                    students.forEach(student => {
                        const present = callRollings.find(x => x.studentId == student.id)?.status == AttendanceStatus.Present;
                        student.present = present;
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

            //2.Step: 
            this.classService.getSessionsByClass(vClass.id).then(sessions => {
                //2.1  filling book and lesson object
                sessions.forEach(s => {
                    s.book = books.find(x => x.id == s.lessonId);
                    s.lesson = this.lessonService.allLessons$.value.find(x => x.id == s.subLessonId);
                });
                //2.2 Proccesing and applying stats of each lesson
                books.forEach(b => {
                    const book_sessions = sessions.filter(x => x.lessonId == b.id);
                    b.sessionsCount = book_sessions.length;
                    if (book_sessions.length > 0) {
                        const lastLessonId = book_sessions[book_sessions.length - 1].subLessonId;
                        b.lastSessionLesson = this.lessonService.allLessons$.value.find(x => x.id == lastLessonId);
                    }

                });
                //2.3 find currentSession and its reminders
                this.currentSession = sessions.find(x => x.endTime == null);
                if (this.currentSession) {
                    this.reminderService.getSessionReminders(this.currentSession.id).then(reminders => {
                        this.currentSession.reminders = reminders;
                        const lesson_reminders = reminders.filter(x => x.type == ReminderType.Reminder).map(x => (x as LessonReminder));
                        const student_reminders = reminders.filter(x => x.type == ReminderType.StudentReminder).map(x => (x as StudentReminder));
                        this.reminderService.lesson_reminders$.next(lesson_reminders);
                        this.reminderService.student_reminders$.next(student_reminders);
                    })
                }
                this.classSessions$.next(sessions);
            });

            //Loading Rings
            this.scheduleService.getRings(vClass.schoolId, vClass.gradeId).then(rings => {
                this.rings = rings;

                //Loading Schedules
                this.scheduleService.get(vClass.id).then(schdule => {
                    if (schdule) {
                        schdule.scheduleTimes.forEach(st => {
                            st.ring = this.rings.find(x => x.id == st.ringId);
                            //lessonService.books$ filled when getBooks called
                            st.lesson = this.lessonService.books$.value.find(x => x.id == st.lessonId);
                        });

                        //Clone the schedules to make it non-changable
                        this.todayShedules = [...schdule.scheduleTimes.filter(x => x.dayNo == this.todayDay)];
                        this.todayShedules.forEach(sch => {
                            sch.session = this.sessions.find(x => x.scheduleTimeId == sch.id);
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
            this.currentSession = undefined;
            const sessions = this.classSessions$.value;
            const currentSession = sessions[sessions.length - 1];
            currentSession.endTime = new Date();

            this.storageService.removeStorage(CLASS_STORAGE);
            this.classSessions$.next(sessions);
        });
    }
}
