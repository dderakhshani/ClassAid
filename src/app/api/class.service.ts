import { GroupModel } from './../models/student-group';
import { HomeWorkModel } from './../models/home-work';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpService } from '../core/services/http.service';
import { AttendanceModel } from '../models/attendance-model';
import { ClassModel, ClassSessionModel } from '../models/class';
import { DaySession } from '../models/day-session';
import { GlobalService } from '../services/global.service';
import { Reminder } from '../models/remider';
import { StudentModel } from '../models/student';

@Injectable({
    providedIn: 'root'
})
export class ClassService {
    CLASSES_STORAGE = "CLASSAID_CLASSES";
    classes: ClassModel[];
    classGroups: GroupModel[];
    // reminders$ = new Subject<Reminder[]>();

    constructor(private httpService: HttpService) {
        const classesJson = localStorage.getItem(this.CLASSES_STORAGE);
        if (classesJson) {
            this.classes = JSON.parse(classesJson);
        }
    }


    reset() {
        localStorage.removeItem(this.CLASSES_STORAGE);
        this.classes = undefined;
        this.classGroups = undefined;
    }


    getClassesByTeacherId(teacherId: number): Promise<ClassModel[]> {
        return new Promise((resolve, reject) => {
            if (this.classes)
                return resolve(this.classes);
            else
                this.httpService.http.getDataByParam<ClassModel[]>({ teacherId: teacherId }, "class/getByTeacherId").then(data => {
                    localStorage.setItem(this.CLASSES_STORAGE, JSON.stringify(data));
                    this.classes = data;
                    return resolve(this.classes);
                }, err => {
                    reject(err)
                });
        });

    }

    getDaySession(classId: number): Promise<DaySession> {
        return this.httpService.http.getDataByParam<DaySession>({ classId: classId }, "session/GetDaySession");
    }

    addCallRolls(attendances: AttendanceModel[], classId: number): Promise<string> {
        return this.httpService.http.postJsonData<string>(attendances, `class/addCallRolls/${classId}`);
    }

    getCallRolls(classId: number): Promise<AttendanceModel[]> {
        return this.httpService.http.getDataByParam<AttendanceModel[]>({ classId: classId }, "class/GetCallRolls");
    }

    getSessionCallRolls(sessionId: string): Promise<AttendanceModel[]> {
        return this.httpService.http.getDataByParam<AttendanceModel[]>({ sessionId: sessionId }, "session/GetSessionCallRolls");
    }


    addTask(session: ClassSessionModel): Promise<boolean> {
        let pure_session = { ...session };
        //remove client base data to prevent circular dependecies
        pure_session.assessments = undefined;
        pure_session.book = undefined;
        pure_session.lesson = undefined;
        return this.httpService.http.postJsonData<boolean>(pure_session, "session/AddTask");
    }

    endTask(taskId: string): Promise<boolean> {
        return this.httpService.http.postJsonData<boolean>(taskId, "session/EndTask");
    }

    addHomeWork(homeWork: HomeWorkModel): Promise<boolean> {

        return this.httpService.http.postJsonData<boolean>(homeWork, "class/AddHomeWork");
    }

    addGroup(group: GroupModel): Promise<boolean> {

        return this.httpService.http.postJsonData<boolean>(group, "class/addGroup");
    }

    getLessonHomeWorks(lessonId: number, classId: number): Promise<HomeWorkModel[]> {
        return new Promise((resolve, reject) => {
            this.httpService.http.getDataByParam<HomeWorkModel[]>({ lessonId: lessonId, classId: classId }, "class/GetLessonHomeWorks").then(data => {
                data.forEach(hw => {
                    const students = hw.assignees.map(x => Object.assign(new StudentModel(), x));
                    hw.assignees = students;
                })
                return resolve(data);
            }, err => {
                reject(err)
            });
        });
    }

    getHomeWorkBySession(sessionId: string): Promise<HomeWorkModel[]> {
        return new Promise((resolve, reject) => {
            this.httpService.http.getDataByParam<HomeWorkModel[]>({ sessionId: sessionId }, "session/GetHomeWorkBySession").then(data => {
                data.forEach(hw => {
                    const students = hw.assignees.map(x => Object.assign(new StudentModel(), x));
                    hw.assignees = students;
                })
                return resolve(data);
            }, err => {
                reject(err)
            });
        });
    }

    getHomeWorkById(homeWorkId: string): Promise<HomeWorkModel> {
        return new Promise((resolve, reject) => {
            this.httpService.http.getDataByParam<HomeWorkModel>({ homeWorkId: homeWorkId }, "class/GetHomeWorkById").then(data => {

                const students = data.assignees.map(x => Object.assign(new StudentModel(), x));
                data.assignees = students;

                return resolve(data);
            }, err => {
                reject(err)
            });
        });

    }

    getTodaySessionsByClass(classId: number): Promise<ClassSessionModel[]> {
        return this.httpService.http.getDataByParam<ClassSessionModel[]>({ classId: classId }, "session/GetTodaySessionsByClass");
    }

    getAllSessionsByClass(classId: number): Promise<ClassSessionModel[]> {
        return this.httpService.http.getDataByParam<ClassSessionModel[]>({ classId: classId }, "session/GetAllSessionsByClass");
    }

    getSession(sessionId: string): Promise<ClassSessionModel> {
        return this.httpService.http.getDataByParam<ClassSessionModel>({ sessionId: sessionId }, "session/getSession");
    }

    getGroups(classId: number, lessonId: number, subLessonId: number): Promise<GroupModel[]> {
        return new Promise((resolve, reject) => {
            if (this.classGroups)
                return resolve(this.classGroups);
            else
                this.httpService.http.getDataByParam<GroupModel[]>({ classId: classId, lessonId: lessonId, subLessonId: subLessonId }, "class/GetGroups").then(data => {
                    data.forEach(g => {
                        g.subGroups.forEach(sg => {
                            const students = sg.students.map(x => Object.assign(new StudentModel(), x));
                            sg.students = students;
                        })
                    });
                    this.classGroups = data;
                    return resolve(data);
                }, err => {
                    reject(err)
                });
        });
        return;


    }

}
