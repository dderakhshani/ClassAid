import { AttendanceModel } from './../../../../models/attendance-model';
import { Component, OnInit } from '@angular/core';
import { StudentsService } from 'src/app/api/students.service';
import { GlobalService } from 'src/app/services/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonService } from 'src/app/api/lesson.service';
import { StudentModel } from 'src/app/models/student';

@Component({
    selector: 'app-attendance-detail',
    templateUrl: './attendance-detail.page.html',
    styleUrls: ['./attendance-detail.page.scss'],
})
export class AttendanceDetailPage implements OnInit {

    studentIdParam: number;
    attendances: AttendanceModel[];
    student: StudentModel;

    constructor(public studentsService: StudentsService,
        public globalService: GlobalService,
        private lessonService: LessonService,
        private route: ActivatedRoute,
        private router: Router) {
        this.studentIdParam = Number(this.route.snapshot.paramMap.get('studentId'));
        this.student = this.studentsService.getStudentsByIdSync(this.studentIdParam);
    }

    ngOnInit() {
    }

    ionViewWillEnter() {

        this.globalService.ready$.subscribe(ready => {
            if (ready) {
                this.studentsService.GetStudentAttendances(this.studentIdParam).then(attendances => {
                    attendances.forEach(item => {
                        item.session = this.globalService.sessions.find(x => x.id == item.taskId);
                    })
                    this.attendances = attendances;
                });
            }
        })
    }

}
