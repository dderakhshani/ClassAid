import { AttendanceModel, AttendanceStatus } from './../../../models/attendance-model';
import { AssessmentModel } from 'src/app/models/asses-param';
import { ClassService } from './../../../api/class.service';
import { Note, StudentReminder, LessonReminder, ReminderType } from './../../../models/remider';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { AlertController } from '@ionic/angular';
import { Lesson } from 'src/app/models/lessons';
import { Reminder, Score } from 'src/app/models/remider';
import { StudentModel } from 'src/app/models/student';
import { ActivatedRoute } from '@angular/router';
import { LessonService } from 'src/app/api/lesson.service';
import { StudentsService } from 'src/app/api/students.service';
import { AssessmentService } from 'src/app/api/assessment.service';
import { GlobalService } from 'src/app/services/global.service';
import { ChartService } from 'src/app/services/chart.service';
import { ReminderService } from 'src/app/api/reminder.service';
import { init } from 'echarts';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-class-report',
    templateUrl: './class-report.page.html',
    styleUrls: ['./class-report.page.scss'],
})
export class ClassReportPage implements OnInit {
    imageUrl = environment.imageUrl + '/';
    AttendanceStatus = AttendanceStatus;
    studentModel = StudentModel;
    sessionIdParam: string;
    colors = ["primary", "danger", "success", "secondary", "warning", "tertiary", "medium"];

    lesson: Lesson;
    book: Lesson;
    absentStudents: AttendanceModel[] = [];
    notes: Note[];
    reminders: LessonReminder[];
    student_reminders: StudentReminder[];
    scores: Score[];
    assessments: AssessmentModel[];
    notes_expanded = false;
    notes_expandable = true;
    reminder_expanded = false;

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

            this.classService.getSessionCallRolls(session.id).then(data => {
                this.absentStudents = data.filter(x => x.status == 2 || x.status == 3);
            })

            Promise.all(
                [this.reminderService.getSessionReminders(session.id),
                this.assessmentService.getSessionAssessments(session.id)])
                .then(([reminders, assessments]) => {
                    this.student_reminders = reminders.filter(x => x.type == ReminderType.StudentReminder).map(x => x as StudentReminder);
                    this.reminders = reminders.filter(x => x.type == ReminderType.Reminder).map(x => x as LessonReminder);
                    if (this.reminders.length == 1)
                        this.reminder_expanded = true;

                    this.scores = reminders.filter(x => x.type == ReminderType.Score).map(x => x as Score);

                    this.notes = reminders.filter(x => x.type == ReminderType.Notes).map(x => x as Note);
                    if (this.notes.length == 1) {
                        this.notes_expanded = true;
                        this.notes_expandable = false;
                    }

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


    getScale(index: number, expanded: boolean) {
        if (expanded)
            return 1;
        else
            return 1 - ((this.notes.length - 1) - index) * 0.05;
    }

    async showReminder(remidner: Reminder) {
        const alert = await this.alertController.create({
            header: 'یادداشت ',
            message: remidner.note,
            buttons: [
                {
                    text: 'بستن',
                    role: 'confirm'
                }
            ],
        });

        await alert.present();
    }

}
