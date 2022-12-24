import { HomeWorkModel } from './../models/home-work';
import { Injectable } from '@angular/core';
import { HttpService } from '../core/services/http.service';
import { AssessmentModel, AssessParamterModel } from '../models/asses-param';
import { StatReportModel } from '../models/stats-serie';

@Injectable({
    providedIn: 'root'
})
export class AssessmentService {

    assesmentParamters: AssessParamterModel[] = [];

    constructor(private httpService: HttpService) { }

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
            this.httpService.http.getDataByParam<AssessParamterModel[]>({ lessonId: lessonId, gradeId: gradeId }, "assessment/GetParameters").then(data => {
                this.assesmentParamters = data;
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
}
