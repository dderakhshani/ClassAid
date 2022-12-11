import { Injectable } from '@angular/core';
import { HttpService } from '../core/services/http.service';
import { AssessParamModel } from '../models/asses-param';

@Injectable({
    providedIn: 'root'
})
export class AssessmentService {

    assesmentParamters: AssessParamModel[] = [];

    constructor(private httpService: HttpService) { }

    getParameters(lessonId?: number, gradeId?: number): Promise<AssessParamModel[]> {
        return new Promise(resolve => {
            this.httpService.http.getDataByParam<AssessParamModel[]>({ lessonId: lessonId, gradeId: gradeId }, "assessment/GetParameters").then(data => {
                this.assesmentParamters = data;
                return resolve(data);
            });
        });
    }

    getLessonParametersSync(lessonId: number) {
        return this.assesmentParamters.filter(x => x.lessonId == lessonId);
    }
}
