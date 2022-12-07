import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
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
        private navCtrl: NavController,) { }

    ngOnInit() {
        this.studentsService.getStudentsOfClass(this.globalService.selectedClass.id).then(data => {
            this.students = data.map(x => Object.assign(new StudentModel(), x));
        })
    }

    onStudentAction(student: StudentModel) {
        student.present = !student.present;
    }

    save() {
        this.studentsService.students$.next(this.students);
        this.navCtrl.navigateRoot('tabs/home');
    }
}
