import { HomeWorkModel } from './../../models/home-work';
import { Reminder, StudentReminder, StudentNotes, Note } from './../../models/remider';
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
import { combineLatest } from 'rxjs';

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
    modalNotes: Note[];
    modalHomeWorks: HomeWorkModel[];

    isStudentActionsModalOpen = false;
    isScoreModalOpen = false;
    isReminderModalOpen = false;
    isNotesModalOpen = false;
    isHomeWorkModalOpen = false;

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
    }

    ionViewWillEnter() {

        //tobe sure students will load from server if not already loaded
        combineLatest(this.globalService.classSessions$, this.globalService.ready$).subscribe(([sessions, ready]) => {
            if (this.globalService.currentSession && ready) {
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
                    this.initStudents();
                });
            }

        })
        //If students state changed by attendance
        this.studentsService.students$.subscribe(students => {
            this.students = [...students];
            //Must set all reminders at once for student and display it by type
            this.initStudents();
        })
    }

    initStudents() {
        //TODO: can move this.studentsService.students$.subscribe and not check this.globalService.currentSession
        if (this.globalService.currentSession) {
            const scores = this.globalService.currentSession.reminders?.filter(x => x.type == ReminderType.Score).map(x => x as Score);
            const reminders = this.globalService.currentSession.reminders?.filter(x => x.type == ReminderType.StudentReminder).map(x => x as StudentReminder);
            const notes = this.globalService.currentSession.reminders?.filter(x => x.type == ReminderType.StudentNotes).map(x => x as StudentNotes);
            const assesments = this.globalService.currentSession.assessments;

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

                const s_n = notes?.filter(x => x.studentId == s.id);
                if (s_n)
                    s_n.forEach(x => {
                        s.notes.push(x);
                    });

                s.hasAssessment = assesments?.filter(x => x.studentId == s.id).length > 0;


            })
        }

    }

    attendance() {
        this.router.navigateByUrl(`/tabs/home/attendance/${this.globalService.currentSession.id}`);
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

    remindersCount() {
        return this.globalService.currentSession?.reminders?.filter(x => x.type == ReminderType.Reminder).length;
    }

    notesCount() {
        return this.globalService.currentSession?.reminders?.filter(x => x.type == ReminderType.Notes).length;
    }

    homeWorksCount() {
        return this.globalService.currentSession?.homeWorks?.filter(x => x.creatorTaskId == this.globalService.currentSession.id).length;
    }

    onAssess() {
        this.isStudentActionsModalOpen = false;
        setTimeout(() => {
            this.router.navigateByUrl(`/tabs/class/assessment/${this.lesson.id}/${this.selectedStudent.id}/${this.globalService.currentSession.id}`);
        });
    }

    onHomeWork() {
        this.selectedStudent = null;
        this.modalHomeWorks = this.globalService.currentSession.homeWorks?.filter(x => x.creatorTaskId == this.globalService.currentSession.id);
        this.isStudentActionsModalOpen = false;
        this.isHomeWorkModalOpen = true;
        // this.router.navigateByUrl(`/tabs/home-work/${this.globalService.currentSession.id}`);
    }

    onStudentReminder() {
        this.modalReminders = this.selectedStudent.reminders;
        this.isStudentActionsModalOpen = false;
        this.isReminderModalOpen = true;

    }

    onStudentNotes() {
        this.modalNotes = this.selectedStudent.notes;
        this.isStudentActionsModalOpen = false;
        this.isNotesModalOpen = true;
    }

    onScore() {
        this.isStudentActionsModalOpen = false;
        this.isScoreModalOpen = true;
    }

    onReminder() {
        this.selectedStudent = null;
        this.modalReminders = this.globalService.currentSession.reminders?.filter(x => x.type == ReminderType.Reminder);
        this.isStudentActionsModalOpen = false;
        this.isReminderModalOpen = true;
    }

    onNotes() {
        this.selectedStudent = null;
        this.modalNotes = this.globalService.currentSession.reminders?.filter(x => x.type == ReminderType.Notes).map(x => x as Note);
        this.isStudentActionsModalOpen = false;
        this.isNotesModalOpen = true;
    }

}
