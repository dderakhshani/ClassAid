import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpService } from '../core/services/http.service';
import { AttendanceModel } from '../models/attendance-model';
import { ClassModel, ClassSessionModel } from '../models/class';
import { DaySession } from '../models/day-session';
import { GlobalService } from '../services/global.service';

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
            this.httpService.http.getDataByParam<DaySession>({ classId: classId }, "class/GetDaySession").then(data => {
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


    addTask(session: ClassSessionModel): Promise<boolean> {
        return new Promise(resolve => {
            this.httpService.http.postJsonData<boolean>(session, "class/AddTask").then(data => {
                return resolve(data);
            });
        });
    }

    endTask(taskId: string): Promise<boolean> {
        return new Promise(resolve => {
            this.httpService.http.postJsonData<boolean>(taskId, "class/EndTask").then(data => {
                return resolve(data);
            });
        });
    }

    getSessionsByClass(classId: number): Promise<ClassSessionModel[]> {
        return new Promise(resolve => {
            this.httpService.http.getDataByParam<ClassSessionModel[]>({ classId: classId }, "class/GetSessionsByClass").then(data => {
                return resolve(data);
            });
        });
    }
}
