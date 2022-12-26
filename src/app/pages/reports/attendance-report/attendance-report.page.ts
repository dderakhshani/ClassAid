import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentsService } from 'src/app/api/students.service';
import { StudentAttendanceReportModel } from 'src/app/models/student';
import { GlobalService } from 'src/app/services/global.service';

@Component({
    selector: 'app-attendance-report',
    templateUrl: './attendance-report.page.html',
    styleUrls: ['./attendance-report.page.scss'],
})
export class AttendanceReportPage implements OnInit {

    students: StudentAttendanceReportModel[];

    constructor(public studentsService: StudentsService,
        public globalService: GlobalService,
        private router: Router) { }

    ngOnInit() {
    }

    ionViewWillEnter() {

        this.globalService.ready$.subscribe(ready => {
            if (ready) {
                this.studentsService.getStudentAttendanceReport(this.globalService.selectedClass.id).then(students => {
                    this.students = students;
                });
            }
        })
    }

}
