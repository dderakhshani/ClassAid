import { ClassSessionModel } from './../../../models/class';
import { HomeWorkModel } from './../../../models/home-work';
import { ScoreAssessmentModel } from './../../../models/asses-param';
import { AttendanceModel, AttendanceStatus } from './../../../models/attendance-model';
import { AssessmentModel } from 'src/app/models/asses-param';
import { ClassService } from './../../../api/class.service';
import { Note, StudentReminder, LessonReminder, ReminderType, StudentNotes, LessonNotes } from './../../../models/remider';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { AlertController } from '@ionic/angular';
import { Lesson } from 'src/app/models/lessons';
import { Reminder } from 'src/app/models/remider';
import { StudentModel } from 'src/app/models/student';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonService } from 'src/app/api/lesson.service';
import { StudentsService } from 'src/app/api/students.service';
import { AssessmentService } from 'src/app/api/assessment.service';
import { GlobalService } from 'src/app/services/global.service';
import { ChartService } from 'src/app/services/chart.service';
import { ReminderService } from 'src/app/api/reminder.service';
import { init } from 'echarts';
import { environment } from 'src/environments/environment';
import { Share } from '@capacitor/share';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

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
    session: ClassSessionModel;
    colors = ["primary", "danger", "success", "secondary", "warning", "tertiary", "medium"];

    lesson: Lesson;
    book: Lesson;
    absentStudents: AttendanceModel[] = [];
    lesson_notes: LessonNotes[];
    student_notes: StudentNotes[];
    reminders: LessonReminder[];
    student_reminders: StudentReminder[];
    scores: ScoreAssessmentModel[];
    assessments: AssessmentModel[];
    homeWorks: HomeWorkModel[];

    modalNotes: Note[];
    modalReminders: Reminder[];
    notes_expanded = false;
    notes_expanded2 = false;
    reminder_expanded = false;
    student_reminder_expanded = false;

    selectedStudent: StudentModel;
    isScoreModalOpen = false;
    isReminderModalOpen = false;
    isNotesModalOpen = false;
    isHomeWorkModalOpen = false;
    selectStudentModalOpen = false;

    studentAction: 'score' | 'notes' | 'reminder';

    presentingElement = null;
    loading = true;

    constructor(private alertController: AlertController,
        private route: ActivatedRoute,
        private location: Location,
        private classService: ClassService,
        public lessonService: LessonService,
        private studentsService: StudentsService,
        private assessmentService: AssessmentService,
        private reminderService: ReminderService,
        public globalService: GlobalService,
        private router: Router,
        private chartService: ChartService,) {
        this.sessionIdParam = this.route.snapshot.paramMap.get('sessionId');
    }

    ngOnInit() {
        this.presentingElement = document.querySelector('.ion-page');
        this.globalService.ready$.subscribe(ready => {
            if (ready)
                this.init();
        })
    }

    init() {
        this.classService.getSession(this.sessionIdParam).then(session => {
            this.session = session;
            this.lessonService.getLessonById(session.subLessonId).then(l => {
                this.lesson = l;
            });
            this.lessonService.getLessonById(session.lessonId).then(b => {
                this.book = b;
            });

            this.classService.getSessionCallRolls(session.id).then(data => {
                this.absentStudents = data.filter(x => x.status == 2 || x.status == 3);
            });

            this.classService.getHomeWorkBySession(session.id).then(data => {
                this.homeWorks = data;
            })

            Promise.all(
                [this.reminderService.getSessionReminders(session.id),
                this.assessmentService.getSessionAssessments(session.id)])
                .then(([reminders, assessments]) => {
                    this.student_reminders = reminders.filter(x => x.type == ReminderType.StudentReminder).map(x => x as StudentReminder);
                    this.reminders = reminders.filter(x => x.type == ReminderType.Reminder).map(x => x as LessonReminder);
                    if (this.reminders.length == 1)
                        this.reminder_expanded = true;

                    this.scores = assessments.filter(x => (x as any).progerssFlag && x.level == 0).map(x => x as ScoreAssessmentModel);

                    this.lesson_notes = reminders.filter(x => x.type == ReminderType.Notes).map(x => x as LessonNotes);
                    if (this.lesson_notes.length <= 1) {
                        this.notes_expanded = true;
                    }

                    this.student_notes = reminders.filter(x => x.type == ReminderType.StudentNotes).map(x => x as StudentNotes);
                    if (this.student_notes.length <= 1) {
                        this.notes_expanded2 = true;
                    }

                    this.assessments = assessments;
                    this.loading = false;
                });

        })
    }

    remove_notes(reminder: Reminder) {

    }

    async share_notes(note: Note) {
        let title = note.isReport ? 'گزارش ' : 'یادداشت ';

        if (note.type == ReminderType.StudentNotes)
            title += this.studentsService.getStudentsByIdSync((note as StudentNotes).studentId).fullName + ' ';
        title += this.lessonService.getLessonByIdSynce(note.lessonId).name;

        if (note.images) {
            this.globalService.shareData(title, note.note, environment.imageUrl + '/' + note.images[0]);
        }
        else
            this.globalService.shareData(title, note.note);

    }

    remove_reminder(reminder: Reminder) {

    }
    share_reminders(reminder: Reminder) {
        let title = reminder.isReport ? 'گزارش ' : 'یادداشت ';

        if (reminder.type == ReminderType.StudentReminder)
            title += this.studentsService.getStudentsByIdSync((reminder as StudentReminder).studentId).fullName + ' ';
        title += this.lessonService.getLessonByIdSynce(reminder.lessonId).name;

        this.globalService.shareData(title, reminder.note);
    }

    share_homework(homeWork: HomeWorkModel) {

        this.globalService.shareData(homeWork.title, homeWork.description, environment.imageUrl + '/' + homeWork.files[0]);
    }

    getScale(index: number, data: any[], expanded: boolean) {
        if (expanded)
            return 1;
        else
            return 1 - ((data.length - 1) - index) * 0.05;
    }

    async showReminder(reminder: Reminder) {
        const alert = await this.alertController.create({
            header: 'یادداشت ',
            message: reminder.note,
            buttons: [
                {
                    text: 'بستن',
                    role: 'confirm'
                }
            ],
        });

        await alert.present();
    }

    async showScore(score: ScoreAssessmentModel) {
        if (score.note) {
            const alert = await this.alertController.create({
                header: 'یادداشت ',
                message: score.note,
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



    assessHomeWork(homeWork: HomeWorkModel) {
        this.router.navigateByUrl(`home-work/${homeWork.id}`)
    }

    onHomeWork() {
        this.selectedStudent = null;
        // this.modalHomeWorks = this.globalService.currentSession.homeWorks?.filter(x => x.creatorTaskId == this.globalService.currentSession.id);
        this.isHomeWorkModalOpen = true;
    }

    onSelectStudent(students: StudentModel[]) {
        this.selectedStudent = students[0];
        this.selectStudentModalOpen = false;
        if (this.studentAction == 'score')
            this.isScoreModalOpen = true;
        else if (this.studentAction == 'notes') {
            this.modalNotes = this.student_notes.filter(x => x.studentId == this.selectedStudent.id);
            this.isNotesModalOpen = true;
        }

        else if (this.studentAction == 'reminder') {
            this.modalReminders = this.student_reminders.filter(x => x.studentId == this.selectedStudent.id);
            this.isReminderModalOpen = true;
        }

    }

    onStudentReminder() {
        this.selectStudentModalOpen = true;
        this.studentAction = 'reminder';

    }

    onStudentNotes() {
        this.selectStudentModalOpen = true;
        this.studentAction = 'notes';
    }

    onScore() {
        this.selectStudentModalOpen = true;
        this.studentAction = 'score';
    }

    onReminder() {
        this.selectedStudent = null;
        this.modalReminders = this.reminders;
        this.isReminderModalOpen = true;
    }

    onNotes() {
        this.selectedStudent = null;
        this.modalNotes = this.lesson_notes;
        this.isNotesModalOpen = true;
    }

    attendance() {
        this.router.navigateByUrl(`/tabs/home/attendance/${this.sessionIdParam}`);
    }

    reminderSaved(reminder: Reminder) {
        if (this.selectedStudent)
            this.student_reminders.push(reminder as StudentReminder);
        else
            this.reminders.push(reminder as LessonReminder);
    }

    homeWorkSaved(homeWork: HomeWorkModel) {
        this.homeWorks.push(homeWork);
    }

    noteSaved(note: Note) {
        if (this.selectedStudent)
            this.student_notes.push(note as StudentNotes);
        else
            this.lesson_notes.push(note as LessonNotes);
    }

    scoreSaved(score: ScoreAssessmentModel) {
        this.scores.push(score);
    }

}
