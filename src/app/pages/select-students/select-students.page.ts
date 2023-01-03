import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentsService } from 'src/app/api/students.service';
import { AttendanceStatus } from 'src/app/models/attendance-model';
import { StudentModel } from 'src/app/models/student';
import { GlobalService } from 'src/app/services/global.service';

@Component({
    selector: 'app-select-students',
    templateUrl: './select-students.page.html',
    styleUrls: ['./select-students.page.scss'],
})
export class SelectStudentsPage implements OnInit {


    constructor(
        private studentsService: StudentsService,
        public globalService: GlobalService,
        private route: ActivatedRoute,) {
    }

    ngOnInit() {


    }

    async save() {

    }

}
