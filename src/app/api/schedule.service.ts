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
        return this.httpService.http.getDataByParam<ScheduleModel>({ classId: classId }, "Schedule/Get");
    }

    getRings(schoolId: number, gradeId: number): Promise<Ring[]> {
        return this.httpService.http.getDataByParam<Ring[]>({ schoolId: schoolId, gradeId: gradeId }, "Schedule/GetRings");
    }

    saveSchedule(schedule: ScheduleModel): Promise<string> {
        return this.httpService.http.postJsonData<string>(schedule, "Schedule/AddUpdateSchedule");
    }

}
