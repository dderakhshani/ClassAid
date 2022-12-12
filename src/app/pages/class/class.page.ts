import { Reminder, StudentReminder } from './../../models/remider';
import { StudentModel } from 'src/app/models/student';
import { StudentsService } from './../../api/students.service';
import { ClassSessionModel } from './../../models/class';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonService } from 'src/app/api/lesson.service';
import { Lesson } from 'src/app/models/lessons';
import { GlobalService } from 'src/app/services/global.service';

import { ActionSheetController, AlertController } from '@ionic/angular';
import { ReminderType, Score } from 'src/app/models/remider';
import { AttendanceStatus } from 'src/app/models/attendance-model';

@Component({
    selector: 'app-class',
    templateUrl: './class.page.html',
    styleUrls: ['./class.page.scss'],
})
export class ClassPage implements OnInit {
    AttendanceStatus = AttendanceStatus;

    lesson: Lesson;
    book: Lesson;
    students: StudentModel[];
    selectedStudent?: StudentModel;
    lessonId: number;
    scheduleId?: number;
    modalReminders: Reminder[];
    modalNotes: Reminder[];

    isStudentActionsModalOpen = false;
    isScoreModalOpen = false;
    isReminderModalOpen = false;
    isNotesModalOpen = false;

    presentingElement = null;

    constructor(public lessonService: LessonService,
        public studentsService: StudentsService,
        public globalService: GlobalService,
        private route: ActivatedRoute,
        private alertController: AlertController,
        private actionSheetCtrl: ActionSheetController,
        private router: Router) {

        this.lessonId = Number(this.route.snapshot.paramMap.get('lessonId'));
        if (this.route.snapshot.paramMap.has('scheduleId'))
            this.scheduleId = Number(this.route.snapshot.paramMap.get('scheduleId'))



    }

    ngOnInit() {
        this.presentingElement = document.querySelector('.ion-page');
        //tobe sure students will load from server if not already loaded
        this.globalService.ready$.subscribe(ready => {
            if (ready) {
                if (this.lessonId == 0) {
                    this.lesson = this.globalService.currentSession.lesson;
                    this.book = this.globalService.currentSession.book;
                }
                else {
                    this.lessonService.getLessonById(this.lessonId).then(l => {
                        this.lesson = l;
                        this.lessonService.getLessonById(this.lesson.parentId).then(b => {
                            this.book = b;
                        });
                    });
                }
                this.studentsService.getStudentsOfClass(this.globalService.selectedClass.id).then(students => {
                    this.students = [...students];
                    //Must set all reminders at once for student and display it by type
                    const scores = this.globalService.currentSession.reminders?.filter(x => x.type == ReminderType.Score).map(x => x as Score);
                    const reminders = this.globalService.currentSession.reminders?.filter(x => x.type == ReminderType.StudentReminder).map(x => x as StudentReminder);

                    this.students.forEach(s => {
                        const s_s = scores?.filter(x => x.studentId == s.id);
                        if (s_s)
                            s_s.forEach(x => {
                                s.scores.push(x);
                            });

                        const s_r = reminders?.filter(x => x.studentId == s.id);
                        if (s_r)
                            s_r.forEach(x => {
                                s.reminders.push(x);
                            });

                    })
                });
            }

        })

    }

    async onStudentAction(student: StudentModel) {
        if (student.attendanceStatus == AttendanceStatus.Absent)
            return;
        this.isStudentActionsModalOpen = true;
        this.selectedStudent = student;

    }

    async endClass() {
        const alert = await this.alertController.create({
            header: 'اتمام کلاس',
            message: 'آیا از اتمام کلاس اطمینان داری؟',
            buttons: [
                {
                    text: 'بله',
                    role: 'confirm',
                    handler: () => {
                        this.globalService.endClass();
                        this.router.navigateByUrl("tabs/home");
                    },
                },
                {
                    text: 'خیر',
                    role: 'cancel',
                },
            ],
        });

        await alert.present();

        //TODO: Promise base then navigate

    }

    getColor(student: StudentModel) {
        return student.attendanceStatus == AttendanceStatus.Absent ? 'medium' : ''
    }

    hasReminder() {
        return this.globalService.currentSession?.reminders?.filter(x => x.type == ReminderType.Reminder).length > 0;
    }

    hasNotes() {
        return this.globalService.currentSession?.reminders?.filter(x => x.type == ReminderType.Notes).length > 0;
    }

    hasHomeWork() {
        return this.globalService.currentSession?.reminders?.filter(x => x.type == ReminderType.Reminder).length > 0;
    }

    onAssess() {
        this.isStudentActionsModalOpen = false;
        setTimeout(() => {
            this.router.navigateByUrl(`/tabs/class/assessment/${this.book.id}/${this.selectedStudent.id}`);
        });
    }

    onStudentReminder() {
        this.modalReminders = this.selectedStudent.reminders.filter(x => x.type == ReminderType.StudentReminder);
        this.isStudentActionsModalOpen = false;
        this.isReminderModalOpen = true;

    }

    onStudentNotes() {
        this.modalNotes = this.selectedStudent.reminders.filter(x => x.type == ReminderType.StudentNotes);
        this.isStudentActionsModalOpen = false;
        this.isNotesModalOpen = true;
    }

    onScore() {
        this.isStudentActionsModalOpen = false;
        this.isScoreModalOpen = true;
    }

    onReminder() {
        this.selectedStudent = null;
        this.modalReminders = this.globalService.currentSession.reminders.filter(x => x.type == ReminderType.Reminder);
        this.isStudentActionsModalOpen = false;
        this.isReminderModalOpen = true;
    }

    onNotes() {
        this.selectedStudent = null;
        this.modalNotes = this.globalService.currentSession.reminders.filter(x => x.type == ReminderType.Notes);
        this.isStudentActionsModalOpen = false;
        this.isNotesModalOpen = true;
    }

}
