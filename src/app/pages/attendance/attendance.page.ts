import { AttendanceModel, AttendanceStatus } from './../../models/attendance-model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { ClassService } from 'src/app/api/class.service';
import { StudentsService } from 'src/app/api/students.service';
import { StudentModel } from 'src/app/models/student';
import { GlobalService } from 'src/app/services/global.service';
import { Lesson } from 'src/app/models/lessons';
import { Location } from '@angular/common'
import { LessonService } from 'src/app/api/lesson.service';

@Component({
    selector: 'app-attendance',
    templateUrl: './attendance.page.html',
    styleUrls: ['./attendance.page.scss'],
})
export class AttendancePage implements OnInit {

    sessionIdParam: string;

    lesson: Lesson;
    book: Lesson;

    AttendanceStatus = AttendanceStatus;
    students: StudentModel[];

    constructor(
        public location: Location,
        private studentsService: StudentsService,
        public lessonService: LessonService,
        public globalService: GlobalService,
        private classService: ClassService,
        private route: ActivatedRoute,
        private loadingCtrl: LoadingController,
        private navCtrl: NavController,) {
        this.sessionIdParam = this.route.snapshot.paramMap.get('sessionId');
    }

    ngOnInit() {
        //NOTE: Current Session is available as navigate is through the class session
        this.globalService.ready$.subscribe(ready => {
            if (ready) {

                this.studentsService.getStudentsOfClass(this.globalService.selectedClass.id).then(data => {
                    this.students = data.map(x => Object.assign(new StudentModel(), x));
                });
                const session = this.globalService.sessions.find(x => x.id == this.sessionIdParam);
                this.lessonService.getLessonById(session.lessonId).then(b => {
                    this.book = b;
                });
                this.lessonService.getLessonById(session.subLessonId).then(l => {
                    this.lesson = l;

                });

                // this.book = this.globalService.currentSession.book;
                // this.lesson = this.globalService.currentSession.lesson;
            }

        })

    }

    onStudentAction(student: StudentModel) {
        student.attendanceStatus = (student.attendanceStatus + 1) % 5;
        student.attendanceStatus = student.attendanceStatus as any == 0 ? 1 : student.attendanceStatus;
    }

    async save() {
        const loading = await this.loadingCtrl.create();
        loading.present();

        const attendances = this.students
            .map(x => (<AttendanceModel>{
                studentId: x.id,
                status: x.attendanceStatus,
                taskId: this.sessionIdParam
            }));

        this.classService.addCallRolls(attendances, this.globalService.selectedClass.id).then(x => {
            loading.dismiss();
            this.studentsService.students$.next(this.students);
            if (this.globalService.currentSession)
                this.globalService.currentSession.didAttendance = true;
            this.navCtrl.back();
        },
            err => {
                loading.dismiss();
            });

    }
}
