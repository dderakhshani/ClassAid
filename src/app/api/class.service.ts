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
        return this.httpService.http.getDataByParam<ClassModel[]>({ teacherId: teacherId }, "class/getByTeacherId");
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

    getLessonHomeWorks(lessonId: number): Promise<HomeWorkModel[]> {
        return this.httpService.http.getDataByParam<HomeWorkModel[]>({ lessonId: lessonId }, "class/GetLessonHomeWorks");
    }

    getHomeWorkBySession(sessionId: string): Promise<HomeWorkModel[]> {
        return this.httpService.http.getDataByParam<HomeWorkModel[]>({ sessionId: sessionId }, "class/GetHomeWorkBySession");
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

    getHomeWorkById(homeWorkId: string): Promise<HomeWorkModel> {
        return this.httpService.http.getDataByParam<HomeWorkModel>({ homeWorkId: homeWorkId }, "class/GetHomeWorkById");
    }

}
