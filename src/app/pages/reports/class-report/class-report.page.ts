import { AttendanceModel, AttendanceStatus } from './../../../models/attendance-model';
import { AssessmentModel } from 'src/app/models/asses-param';
import { ClassService } from './../../../api/class.service';
import { Note, StudentReminder, LessonReminder, ReminderType, StudentNotes, LessonNotes } from './../../../models/remider';
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
    reminderType = ReminderType;

    sessionIdParam: string;
    colors = ["primary", "danger", "success", "secondary", "warning", "tertiary", "medium"];

    lesson: Lesson;
    book: Lesson;
    absentStudents: AttendanceModel[] = [];
    lesson_notes: LessonNotes[];
    student_notes: StudentNotes[];
    reminders: LessonReminder[];
    student_reminders: StudentReminder[];
    scores: Score[];
    assessments: AssessmentModel[];
    notes_expanded = false;
    notes_expandable = true;
    notes_expanded2 = false;
    notes_expandable2 = true;
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

                    this.lesson_notes = reminders.filter(x => x.type == ReminderType.Notes).map(x => x as LessonNotes);
                    if (this.lesson_notes.length <= 1) {
                        this.notes_expanded = true;
                        this.notes_expandable = false;
                    }

                    this.student_notes = reminders.filter(x => x.type == ReminderType.StudentNotes).map(x => x as StudentNotes);
                    if (this.student_notes.length <= 1) {
                        this.notes_expanded2 = true;
                        this.notes_expandable2 = false;
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

    async share_notes(note: Note) {
        let title = note.isReport ? 'گزارش ' : 'یادداشت ';

        if (note.type == ReminderType.StudentNotes)
            title += this.studentsService.getStudentsByIdSync((note as StudentNotes).studentId).fullName + ' ';
        title += this.lessonService.getLessonByIdSynce(note.lessonId).name;

        let blob = undefined;
        if (note.images)
            blob = await fetch(environment.imageUrl + '/' + note.images[0], {
                mode: 'no-cors',
                method: 'get'
            }).then(r => r.blob())


        const data = {
            files: blob ? ([
                new File([blob], 'file.jpg', {
                    type: blob.type,
                }),
            ]) : undefined,
            title: title,
            text: note.note,
        };

        try {
            // if (!(navigator.canShare(data))) {
            //     throw new Error("Can't share data.");
            // }
            await navigator.share(data);
        } catch (err) {
            console.error(err.name, err.message);
        }

    }


    getScale(index: number, data: any[], expanded: boolean) {
        if (expanded)
            return 1;
        else
            return 1 - ((data.length - 1) - index) * 0.05;
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
