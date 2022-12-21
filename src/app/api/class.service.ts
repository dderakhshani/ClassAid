import { HomeWorkModel } from './../models/home-work';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpService } from '../core/services/http.service';
import { AttendanceModel } from '../models/attendance-model';
import { ClassModel, ClassSessionModel } from '../models/class';
import { DaySession } from '../models/day-session';
import { GlobalService } from '../services/global.service';
import { Reminder } from '../models/remider';

@Injectable({
    providedIn: 'root'
})
export class ClassService {

    // reminders$ = new Subject<Reminder[]>();

    constructor(private httpService: HttpService) {
        // this.gradeId = globalService.selectedGradeId;
        // this.schoolId = globalService.selectedSchoolId;
    }

    getClassesByTeacherId(teacherId: number): Promise<ClassModel[]> {
        return new Promise(resolve => {
            this.httpService.http.getDataByParam<ClassModel[]>({ teacherId: teacherId }, "class/getByTeacherId").then(data => {
                return resolve(data);
            });

        });
    }

    getDaySession(classId: number): Promise<DaySession> {
        return new Promise(resolve => {
            this.httpService.http.getDataByParam<DaySession>({ classId: classId }, "session/GetDaySession").then(data => {
                return resolve(data);
            });
        });
    }

    addCallRolls(attendances: AttendanceModel[], classId: number): Promise<string> {
        return new Promise(resolve => {
            this.httpService.http.postJsonData<string>(attendances, `class/addCallRolls/${classId}`).then(data => {
                return resolve(data);
            });
        });
    }

    getCallRolls(classId: number): Promise<AttendanceModel[]> {
        return new Promise(resolve => {
            this.httpService.http.getDataByParam<AttendanceModel[]>({ classId: classId }, "class/GetCallRolls").then(data => {
                return resolve(data);
            });
        });
    }

    getSessionCallRolls(sessionId: string): Promise<AttendanceModel[]> {
        return new Promise(resolve => {
            this.httpService.http.getDataByParam<AttendanceModel[]>({ sessionId: sessionId }, "session/GetSessionCallRolls").then(data => {
                return resolve(data);
            });
        });
    }


    addTask(session: ClassSessionModel): Promise<boolean> {
        return new Promise(resolve => {
            this.httpService.http.postJsonData<boolean>(session, "session/AddTask").then(data => {
                return resolve(data);
            });
        });
    }

    endTask(taskId: string): Promise<boolean> {
        return new Promise(resolve => {
            this.httpService.http.postJsonData<boolean>(taskId, "session/EndTask").then(data => {
                return resolve(data);
            });
        });
    }

    addHomeWork(homeWork: HomeWorkModel): Promise<boolean> {
        return new Promise(resolve => {
            this.httpService.http.postJsonData<boolean>(homeWork, "class/AddHomeWork").then(data => {
                return resolve(data);
            });
        });
    }

    getLessonHomeWorks(lessonId: number): Promise<HomeWorkModel[]> {
        return new Promise(resolve => {
            this.httpService.http.getDataByParam<HomeWorkModel[]>({ lessonId: lessonId }, "class/GetLessonHomeWorks").then(data => {
                return resolve(data);
            });
        });
    }

    getTodaySessionsByClass(classId: number): Promise<ClassSessionModel[]> {
        return new Promise(resolve => {
            this.httpService.http.getDataByParam<ClassSessionModel[]>({ classId: classId }, "session/GetTodaySessionsByClass").then(data => {
                return resolve(data);
            });
        });
    }

    getSession(sessionId: string): Promise<ClassSessionModel> {
        return new Promise(resolve => {
            this.httpService.http.getDataByParam<ClassSessionModel>({ sessionId: sessionId }, "session/getSession").then(data => {
                return resolve(data);
            });
        });
    }

    getHomeWorkById(homeWorkId: string): Promise<HomeWorkModel> {
        return new Promise(resolve => {
            this.httpService.http.getDataByParam<HomeWorkModel>({ homeWorkId: homeWorkId }, "class/GetHomeWorkById").then(data => {
                return resolve(data);
            });
        });
    }

}
