import { Injectable } from '@angular/core';
import { HttpService } from '../core/services/http.service';
import { AssessmentModel, AssessParamModel } from '../models/asses-param';

@Injectable({
    providedIn: 'root'
})
export class AssessmentService {

    assesmentParamters: AssessParamModel[] = [];

    constructor(private httpService: HttpService) { }

    add(session: AssessmentModel[]): Promise<boolean> {
        return new Promise(resolve => {
            this.httpService.http.postJsonData<boolean>(session, "assessment/add").then(data => {
                return resolve(data);
            });
        });
    }

    getParameters(lessonId?: number, gradeId?: number): Promise<AssessParamModel[]> {
        return new Promise(resolve => {
            this.httpService.http.getDataByParam<AssessParamModel[]>({ lessonId: lessonId, gradeId: gradeId }, "assessment/GetParameters").then(data => {
                this.assesmentParamters = data;
                return resolve(data);
            });
        });
    }

    getSessionAssessments(sessionId: string): Promise<AssessmentModel[]> {
        return new Promise(resolve => {
            this.httpService.http.getDataByParam<AssessmentModel[]>({ sessionId: sessionId }, "assessment/getSessionAssessments").then(data => {
                return resolve(data);
            });
        });
    }

    getLessonParametersSync(lessonId: number) {
        return this.assesmentParamters.filter(x => x.lessonId == lessonId);
    }
}
