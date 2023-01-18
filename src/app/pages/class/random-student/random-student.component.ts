import { flatten } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { AttendanceStatus } from 'src/app/models/attendance-model';
import { StudentModel } from 'src/app/models/student';

@Component({
    selector: 'app-random-student',
    templateUrl: './random-student.component.html',
    styleUrls: ['./random-student.component.scss'],
})
export class RandomStudentComponent implements OnInit {

    @Input()
    modal: any;

    @Input()
    students: StudentModel[];

    selectedStudents: StudentModel[] = [];
    randomStudent: StudentModel;

    selectAbsent = true;
    selectOnlyNew = false;

    counter = 0;
    constructor() { }

    ngOnInit() {
        this.selectRandom();
    }

    selectRandom() {
        this.counter = 0;
        if (this.selectOnlyNew == false)
            this.selectedStudents = [];
        let looper = setInterval(x => {
            if (this.counter > 5) {
                clearInterval(looper);
                this.selectedStudents.push(this.randomStudent);
                return;
            }

            this.counter++;
            const students = this.students.filter(x =>
                (x.attendanceStatus != AttendanceStatus.Absent || this.selectAbsent == true) &&
                (!this.selectedStudents.includes(x) || this.selectOnlyNew == false));
            if (students.length == 0) {
                this.randomStudent = new StudentModel();
                this.randomStudent.fullName = "تمام دانش آموزان انتخاب شده اند";
                return;
            }
            const rnd = Math.floor(Math.random() * students.length);
            this.randomStudent = students[rnd];

        }, 200);
    }

}
