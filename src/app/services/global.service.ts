import { AttendanceModel, AttendanceStatus } from '../models/attendance-model';
import { ClassService } from './../api/class.service';
import { ScheduleTimeModel } from 'src/app/models/schedule';
import { Subject, BehaviorSubject } from 'rxjs';
import { Ring } from './../models/day';
import { Lesson } from 'src/app/models/lessons';
import { ClassModel, ClassSessionModel } from './../models/class';
import { StorageService } from './../core/services/storage.service';
import { Injectable } from '@angular/core';
import { ScheduleService } from '../api/schedule.service';
import { StudentsService } from '../api/students.service';
import { LessonService } from '../api/lesson.service';
import { StudentModel } from '../models/student';
const CLASS_STORAGE = "CLASSAID_CLASS";

@Injectable({
    providedIn: 'root'
})
export class GlobalService {

    public teacherId: number = 7;
    public todayDay: number;
    public rings: Ring[];//Ring is diffrent for each school & grade (& maybe class)

    selectedClass$ = new BehaviorSubject<ClassModel>(null);
    public classSessions$ = new BehaviorSubject<ClassSessionModel[]>([]);

    public currentClassTask: ClassSessionModel | undefined;
    public todayShedules: ScheduleTimeModel[];
    public callRolling: AttendanceModel[];



    constructor(private storageService: StorageService,
        private studentsService: StudentsService,
        private classService: ClassService,
        public lessonService: LessonService,
        private scheduleService: ScheduleService) {

        //Reminder: remove -1
        this.todayDay = (new Date().getDay() + 1) % 7 - 1;

        //TODO: must remove and load from server
        const currentClassJson = this.storageService.loadStorage(CLASS_STORAGE);
        if (currentClassJson) {
            this.currentClassTask = JSON.parse(currentClassJson);
            this.currentClassTask.book = Object.assign(new Lesson(), this.currentClassTask.book);
            this.currentClassTask.lesson = Object.assign(new Lesson(), this.currentClassTask.lesson);

        }

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
        })

        //Notes:
        //1. First Load Lessons of the Grade Of School
        //2. Load all sessions of the Class(Selected Class)
        //      2.1 Calc and apply sessions stats of each book to lessons
        //      2.2 Emit classSessions$ subject
        //3. Then load rings of Grade Of School(Event Class if reqiured) to load schdules
        //4. Load Schedules of the Class(Selected Class) Then:
        //      4.1 set Ring(object),Lesson(object) to each schedule by ringId,lessonId provided by prev steps
        //      4.2 filter Today Schedules


        this.lessonService.getBooks(vClass.schoolId, vClass.gradeId).then(books => {
            this.classService.getSessionsByClass(vClass.id).then(sessions => {
                books.forEach(b => {
                    const book_sessions = sessions.filter(x => x.lessonId = b.id);
                    b.sessionsCount = book_sessions.length;
                    if (sessions.length > 0) {
                        const lastLessonId = sessions[sessions.length - 1].subLessonId;
                        b.lastSessionLesson = this.lessonService.allLessons$.value.find(x => x.id == lastLessonId);
                    }

                });
                this.classSessions$.next(sessions);
            });

            //Loading Rings
            this.scheduleService.getRings(vClass.schoolId, vClass.gradeId).then(rings => {
                this.rings = rings;

                //Loading Schedules
                this.scheduleService.get(vClass.id).then(schdule => {

                    schdule.scheduleTimes.forEach(st => {
                        st.ring = this.rings.find(x => x.id == st.ringId);
                        //lessonService.books$ filled when getBooks called
                        st.lesson = this.lessonService.books$.value.find(x => x.id == st.lessonId);
                    });

                    //Clone the schedules to make it non-changable
                    this.todayShedules = [...schdule.scheduleTimes.filter(x => x.dayNo == this.todayDay)];

                    if (this.currentClassTask)
                        this.todayShedules.find(x => x.id == this.currentClassTask.scheduleId).session = this.currentClassTask;

                    this.selectedClass$.next(vClass);
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


    startClass(session: ClassSessionModel) {
        this.classService.addTask(session).then(result => {
            this.currentClassTask = session;
            if (session.scheduleId)
                this.todayShedules.find(x => x.id == session.scheduleId).session = session;
            this.classSessions$.next([...this.classSessions$.value, session]);
            this.storageService.saveStorage(CLASS_STORAGE, JSON.stringify(session));
        })

    }

    endClass() {
        this.classService.endTask(this.currentClassTask.id).then(result => {
            this.currentClassTask = undefined;
            const sessions = this.classSessions$.value;
            sessions[sessions.length - 1].endTime = new Date();
            this.storageService.removeStorage(CLASS_STORAGE);
            this.classSessions$.next(sessions);
        });
    }
}
