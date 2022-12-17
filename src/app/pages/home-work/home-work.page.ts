import { StudentModel } from './../../models/student';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { AssessmentLevels } from 'src/app/models/asses-param';
import { combineLatest } from 'rxjs';
import { LessonService } from 'src/app/api/lesson.service';
import { StudentsService } from 'src/app/api/students.service';
import { GlobalService } from 'src/app/services/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Lesson } from 'src/app/models/lessons';
import { ReminderType } from 'src/app/models/remider';

@Component({
    selector: 'app-home-work',
    templateUrl: './home-work.page.html',
    styleUrls: ['./home-work.page.scss'],
})
export class HomeWorkPage implements OnInit {

    students: StudentModel[];
    assessLevels = [...AssessmentLevels.filter(x => x.value != 0)];

    lesson: Lesson;
    book: Lesson;

    sessionIdParam: string;
    lessonIdParam: number;
    studentIdParam: number;

    constructor(public lessonService: LessonService,
        public studentsService: StudentsService,
        public globalService: GlobalService,
        private route: ActivatedRoute,
        private location: Location,
        private router: Router) { }

    ngOnInit() {
    }

    ionViewWillEnter() {

        combineLatest(this.globalService.classSessions$, this.globalService.ready$).subscribe(([sessions, ready]) => {
            if (this.globalService.currentSession && ready) {

                this.studentsService.getStudentsOfClass(this.globalService.selectedClass.id).then(students => {
                    this.students = [...students];
                    //Must set all reminders at once for student and display it by type
                    this.initStudents();
                });
            }

        })

    }

    initStudents() {
        this.students.forEach(s => {

        })
    }

    back() {
        this.location.back();
    }

    save() {

    }


}
