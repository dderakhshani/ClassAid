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
    STUDENT_STORAGE = "CLASSAID_STUDENTS";
    students$ = new BehaviorSubject<StudentModel[]>([]);

    constructor(private httpService: HttpService) {
        const studentsJson = localStorage.getItem(this.STUDENT_STORAGE);
        if (studentsJson) {
            const students = JSON.parse(studentsJson);
            this.initStudents(students);
        }
    }

    reset() {
        localStorage.removeItem(this.STUDENT_STORAGE);
        this.students$.next([]);
    }

    getStudentsOfClass(classId: number): Promise<StudentModel[]> {
        return new Promise((resolve, reject) => {
            if (this.students$.value.length > 0)
                return resolve(this.students$.value);
            else
                this.httpService.http.getDataByParam<StudentModel[]>({ classId: classId }, "Student/GetByClass").then(data => {
                    localStorage.setItem(this.STUDENT_STORAGE, JSON.stringify(data));
                    this.initStudents(data);
                    return resolve(this.students$.value);
                }, err => {
                    reject(err)
                });
        });
    }

    initStudents(rawData: StudentModel[]) {
        const students = rawData.map(x => Object.assign(new StudentModel(), { ...x, attendanceStatus: AttendanceStatus.Present }));
        this.students$.next(students);
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
