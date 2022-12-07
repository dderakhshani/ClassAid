import { ScheduleModel } from './../models/schedule';
import { Ring } from './../models/day';
import { Injectable } from '@angular/core';
import { HttpService } from '../core/services/http.service';

@Injectable({
    providedIn: 'root'
})
export class ScheduleService {

    constructor(private httpService: HttpService) {

    }

    get(classId: number): Promise<ScheduleModel> {
        return new Promise(resolve => {
            this.httpService.http.getDataByParam<ScheduleModel>({ classId: classId }, "Schedule/Get").then(data => {
                return resolve(data);
            });
        });
    }

    getRings(schoolId: number, gradeId: number): Promise<Ring[]> {
        return new Promise(resolve => {
            this.httpService.http.getDataByParam<Ring[]>({ schoolId: schoolId, gradeId: gradeId }, "Schedule/GetRings").then(data => {
                return resolve(data);
            });
        });
    }

    saveSchedule(schedule: ScheduleModel): Promise<string> {
        return new Promise(resolve => {
            this.httpService.http.postJsonData<string>(schedule, "Schedule/AddUpdateSchedule").then(data => {
                return resolve(data);
            });
        });
    }

}
