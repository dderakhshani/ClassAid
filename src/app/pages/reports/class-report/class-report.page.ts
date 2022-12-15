import { AssessmentModel } from 'src/app/models/asses-param';
import { ClassService } from './../../../api/class.service';
import { Note, StudentReminder, LessonReminder, ReminderType } from './../../../models/remider';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { AlertController } from '@ionic/angular';
import { Lesson } from 'src/app/models/lessons';
import { Reminder } from 'src/app/models/remider';
import { StudentModel } from 'src/app/models/student';
import { ActivatedRoute } from '@angular/router';
import { LessonService } from 'src/app/api/lesson.service';
import { StudentsService } from 'src/app/api/students.service';
import { AssessmentService } from 'src/app/api/assessment.service';
import { GlobalService } from 'src/app/services/global.service';
import { ChartService } from 'src/app/services/chart.service';
import { ReminderService } from 'src/app/api/reminder.service';
import { init } from 'echarts';

@Component({
    selector: 'app-class-report',
    templateUrl: './class-report.page.html',
    styleUrls: ['./class-report.page.scss'],
})
export class ClassReportPage implements OnInit {

    studentModel = StudentModel;
    sessionIdParam: string;

    lesson: Lesson;
    book: Lesson;
    absentStudents: StudentModel[] = [];
    notes: Note[];
    reminders: LessonReminder[];
    student_reminders: StudentReminder[];
    assessments: AssessmentModel[];
    notes_expanded = false;

    constructor(private alertController: AlertController,
        private route: ActivatedRoute,
        private location: Location,
        private classService: ClassService,
        public lessonService: LessonService,
        private studentsService: StudentsService,
        private assessmentService: AssessmentService,
        private reminderService: ReminderService,
        public globalService: GlobalService,
        private chartService: ChartService,) {
        this.sessionIdParam = this.route.snapshot.paramMap.get('sessionId');
    }

    ngOnInit() {
        this.globalService.ready$.subscribe(ready => {
            if (ready)
                this.init();
        })
    }

    init() {
        this.classService.getSession(this.sessionIdParam).then(session => {
            this.lessonService.getLessonById(session.subLessonId).then(l => {
                this.lesson = l;
            });
            this.lessonService.getLessonById(session.lessonId).then(b => {
                this.book = b;
            });

            Promise.all(
                [this.reminderService.getSessionReminders(session.id),
                this.assessmentService.getSessionAssessments(session.id)])
                .then(([reminders, assessments]) => {
                    this.student_reminders = reminders.filter(x => x.type == ReminderType.StudentReminder).map(x => x as StudentReminder);
                    this.reminders = reminders.filter(x => x.type == ReminderType.Reminder).map(x => x as LessonReminder);
                    this.notes = reminders.filter(x => x.type == ReminderType.Notes).map(x => x as Note);
                    this.assessments = assessments;
                });

        })
    }

    back() {
        this.location.back();
    }

    remove_notes(reminder: Reminder) {

    }

    share_notes(reminder: Reminder) {

    }


    getScale_notes(index: number) {
        if (this.notes_expanded)
            return 1;
        else
            return 1 - ((this.notes.length - 1) - index) * 0.05;
    }

    async showReminder(remidner: Reminder) {
        const alert = await this.alertController.create({
            header: 'متن یادآور',
            message: remidner.note,
            buttons: [
                {
                    text: 'تایید',
                    role: 'confirm'
                }
            ],
        });

        await alert.present();
    }

}
