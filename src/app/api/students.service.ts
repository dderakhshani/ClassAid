import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from '../core/services/http.service';
import { AttendanceModel, AttendanceStatus } from '../models/attendance-model';
import { StudentAttendanceReportModel, StudentModel, StudentProfileModel } from '../models/student';
import { GlobalService } from '../services/global.service';

@Injectable({
    providedIn: 'root'
})
export class StudentsService {

    students$ = new BehaviorSubject<StudentModel[]>([]);
    constructor(private httpService: HttpService) {
    }

    getStudentsOfClass(classId: number): Promise<StudentModel[]> {
        return new Promise((resolve, reject) => {
            if (this.students$.value.length > 0)
                return resolve(this.students$.value);
            else
                this.httpService.http.getDataByParam<StudentModel[]>({ classId: classId }, "Student/GetByClass").then(data => {
                    const students = data.map(x => Object.assign(new StudentModel(), { ...x, attendanceStatus: AttendanceStatus.Present }));
                    this.students$.next(students);
                    return resolve(students);
                }, err => {
                    reject(err)
                });

        });

    }

    getStudentsById(studentId: number): Promise<StudentModel> {
        return new Promise((resolve, reject) => {
            if (this.students$.value.length > 0)
                return resolve(this.students$.value.find(x => x.id == studentId));
            else
                this.httpService.http.getDataByParam<StudentModel>({ studentId: studentId }, "Student/getStudentsById").then(data => {
                    return resolve(Object.assign(new StudentModel(), data));
                }, err => {
                    reject(err)
                });

        });
    }

    getStudentProfile(studentId: number): Promise<StudentProfileModel> {
        return new Promise((resolve, reject) => {
            this.httpService.http.getDataByParam<StudentProfileModel>({ studentId: studentId }, "Student/GetStudentProfile").then(data => {
                return resolve(Object.assign(new StudentProfileModel(), data));
            }, err => {
                reject(err)
            });

        });
    }

    getStudentAttendanceReport(classId: number): Promise<StudentAttendanceReportModel[]> {
        return new Promise((resolve, reject) => {
            this.httpService.http.getDataByParam<StudentAttendanceReportModel[]>({ classId: classId }, "Student/GetStudentAttendanceReport").then(data => {
                const students = data.map(x => Object.assign(new StudentAttendanceReportModel(), x));
                return resolve(students);
            }, err => {
                reject(err)
            });

        });
    }

    GetStudentAttendances(studentId: number): Promise<AttendanceModel[]> {
        return new Promise((resolve, reject) => {
            this.httpService.http.getDataByParam<AttendanceModel[]>({ studentId: studentId }, "Student/GetStudentAttendances").then(data => {
                return resolve(data);
            }, err => {
                reject(err)
            });

        });
    }

    getStudentsByIdSync(studentId: number) {
        return this.students$.value.find(x => x.id == studentId);

    }
}
