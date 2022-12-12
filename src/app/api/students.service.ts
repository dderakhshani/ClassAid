import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from '../core/services/http.service';
import { AttendanceStatus } from '../models/attendance-model';
import { StudentModel } from '../models/student';
import { GlobalService } from '../services/global.service';

@Injectable({
    providedIn: 'root'
})
export class StudentsService {

    students$ = new BehaviorSubject<StudentModel[]>([]);
    constructor(private httpService: HttpService) {
    }

    getStudentsOfClass(classId: number): Promise<StudentModel[]> {
        return new Promise(resolve => {
            if (this.students$.value.length > 0)
                return resolve(this.students$.value);
            else
                this.httpService.http.getDataByParam<StudentModel[]>({ classId: classId }, "Student/GetByClass").then(data => {
                    const students = data.map(x => Object.assign(new StudentModel(), { ...x, attendanceStatus: AttendanceStatus.Present }));
                    this.students$.next(students);
                    return resolve(students);
                });

        });

    }

    getStudentsById(studentId: number): Promise<StudentModel> {
        return new Promise(resolve => {
            if (this.students$.value.length > 0)
                return resolve(this.students$.value.find(x => x.id == studentId));
            else
                this.httpService.http.getDataByParam<StudentModel>({ studentId: studentId }, "Student/getStudentsById").then(data => {
                    return resolve(Object.assign(new StudentModel(), data));
                });

        });

    }
}
