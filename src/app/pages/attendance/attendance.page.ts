import { AttendanceModel, AttendanceStatus } from './../../models/attendance-model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ClassService } from 'src/app/api/class.service';
import { StudentsService } from 'src/app/api/students.service';
import { StudentModel } from 'src/app/models/student';
import { GlobalService } from 'src/app/services/global.service';

@Component({
    selector: 'app-attendance',
    templateUrl: './attendance.page.html',
    styleUrls: ['./attendance.page.scss'],
})
export class AttendancePage implements OnInit {

    students: StudentModel[];

    constructor(
        private studentsService: StudentsService,
        public globalService: GlobalService,
        private classService: ClassService,
        private navCtrl: NavController,) { }

    ngOnInit() {
        this.globalService.ready$.subscribe(ready => {
            if (ready)
                this.studentsService.getStudentsOfClass(this.globalService.selectedClass.id).then(data => {
                    this.students = data.map(x => Object.assign(new StudentModel(), x));
                })
        })

    }

    onStudentAction(student: StudentModel) {
        student.present = !student.present;
    }

    save() {
        const attendances = this.students.map(x => (<AttendanceModel>{ studentId: x.id, status: x.present ? AttendanceStatus.Present : AttendanceStatus.Absent }));

        this.classService.addCallRolls(attendances, this.globalService.selectedClass.id).then(x => {
            this.studentsService.students$.next(this.students);
            this.navCtrl.navigateRoot('tabs/home');
        })

    }
}
