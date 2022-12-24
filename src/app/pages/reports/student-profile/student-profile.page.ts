
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { StudentsService } from 'src/app/api/students.service';
import { StudentModel } from 'src/app/models/student';
import { GlobalService } from 'src/app/services/global.service';

@Component({
    selector: 'app-student-profile',
    templateUrl: './student-profile.page.html',
    styleUrls: ['./student-profile.page.scss'],
})
export class StudentProfilePage implements OnInit {

    students: StudentModel[];

    constructor(public studentsService: StudentsService,
        public globalService: GlobalService,
        private router: Router) { }

    ngOnInit() {
    }

    ionViewWillEnter() {

        this.globalService.ready$.subscribe(ready => {
            if (ready) {
                this.studentsService.getStudentsOfClass(this.globalService.selectedClass.id).then(students => {
                    this.students = students;

                });
            }
        })
    }

}
