import { HomeWorkModel } from './../models/home-work';
import { Injectable } from '@angular/core';
import { HttpService } from '../core/services/http.service';
import { AssessmentModel, AssessParamterModel } from '../models/asses-param';
import { StatReportModel } from '../models/stats-serie';

@Injectable({
    providedIn: 'root'
})
export class AssessmentService {
    PARAMETERS_STORAGE = "CLASSAID_PARAMETERS";
    assesmentParamters: AssessParamterModel[] = [];

    constructor(private httpService: HttpService) {
        const paramteresJson = localStorage.getItem(this.PARAMETERS_STORAGE);
        if (paramteresJson) {
            this.assesmentParamters = JSON.parse(paramteresJson);
        }
    }

    add(session: AssessmentModel[]): Promise<boolean> {
        return this.httpService.http.postJsonData<boolean>(session, "assessment/add");
    }

    closeHomeWorkAssessment(homeWork: HomeWorkModel): Promise<boolean> {
        return this.httpService.http.postJsonData<boolean>(homeWork, "assessment/CloseHomeWorkAssessment");
    }

    addScore(session: AssessmentModel): Promise<boolean> {
        return new Promise(resolve => {
            this.httpService.http.postJsonData<boolean>(session, "assessment/addScore").then(data => {
                return resolve(data);
            });
        });
    }

    getParameters(lessonId?: number, gradeId?: number): Promise<AssessParamterModel[]> {

        return new Promise((resolve, reject) => {
            if (this.assesmentParamters.length > 0)
                resolve(this.assesmentParamters)
            else
                this.httpService.http.getDataByParam<AssessParamterModel[]>({ lessonId: lessonId, gradeId: gradeId }, "assessment/GetParameters").then(data => {
                    this.assesmentParamters = data;
                    localStorage.setItem(this.PARAMETERS_STORAGE, JSON.stringify(data));
                    return resolve(data);
                },
                    err => {
                        reject(err);
                    });
        });
    }

    getSessionAssessments(sessionId: string): Promise<AssessmentModel[]> {
        return this.httpService.http.getDataByParam<AssessmentModel[]>({ sessionId: sessionId }, "assessment/getSessionAssessments");
    }

    getLessonParametersSync(lessonId: number) {
        return this.assesmentParamters.filter(x => x.lessonId == lessonId);
    }

    getParamterAssessment(classId: number, studentId?: number, lessonId?: number): Promise<StatReportModel[]> {
        return this.httpService.http.getDataByParam<StatReportModel[]>({ classId: classId, studentId: studentId, lessonId: lessonId }, "assessment/GetParamterAssessment");
    }

    getAssessmentHistory(classId: number, studentId?: number, lessonId?: number): Promise<StatReportModel[]> {
        return this.httpService.http.getDataByParam<StatReportModel[]>({ classId: classId, studentId: studentId, lessonId: lessonId }, "assessment/GetAssessmentHistory");
    }

    assessmentReport(classId: number, lessonId?: number): Promise<StatReportModel[]> {
        return this.httpService.http.getDataByParam<StatReportModel[]>({ classId: classId, lessonId: lessonId }, "assessment/AssessmentReport");
    }

    reset() {
        localStorage.removeItem(this.PARAMETERS_STORAGE);
        this.assesmentParamters = [];
    }
}
