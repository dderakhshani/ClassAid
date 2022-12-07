import { Injectable } from '@angular/core';
import { HttpService } from '../core/services/http.service';
import { ClassModel } from '../models/class';
import { GlobalService } from '../services/global.service';

@Injectable({
    providedIn: 'root'
})
export class ClassService {

    constructor(private httpService: HttpService, globalService: GlobalService) {
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
}
