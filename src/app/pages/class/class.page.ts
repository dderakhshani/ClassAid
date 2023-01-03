import { takeUntil } from 'rxjs/operators';
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
import { ReminderType } from 'src/app/models/remider';
import { AttendanceStatus } from 'src/app/models/attendance-model';
import { combineLatest, interval, Observable, Subject, Subscription } from 'rxjs';
import { ChartService } from 'src/app/services/chart.service';
import { GroupStudentModel } from 'src/app/models/student-group';
import { ELocalNotificationTriggerUnit, LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';

@Component({
    selector: 'app-class',
    templateUrl: './class.page.html',
    styleUrls: ['./class.page.scss'],
})
export class ClassPage implements OnInit {
    AttendanceStatus = AttendanceStatus;


    lesson: Lesson;
    book: Lesson;
    all_students: StudentModel[];
    students: StudentModel[];
    groupStudent: GroupStudentModel[] = [];

    searchTerm = "";

    selectedStudent?: StudentModel;
    lessonId: number;
    scheduleId?: number;
    modalReminders: Reminder[];
    modalNotes: Note[];
    modalHomeWorks: HomeWorkModel[];
    homeWork: HomeWorkModel;

    isStudentActionsModalOpen = false;
    isScoreModalOpen = false;
    isReminderModalOpen = false;
    isNotesModalOpen = false;
    isHomeWorkModalOpen = false;
    isSortModalOpen = false;
    isCreateTimerModalOpen = false;
    seconds = 60;
    mintues = 45;

    seconds2 = 0;
    mintues2 = 0;

    percentTimer1 = 100;
    percentTimer2 = 100;
    timer1Subscribtion: Subscription;
    timer2Subscribtion: Subscription;

    randomStudent: StudentModel;
    isRandomModalOpen = false;
    showSearch = false;

    viewMode: 'grid' | 'list' = 'grid';
    listMode: 'single' | 'group' = 'single';
    sortType: '' | 'name' | 'lastname' | 'attendance' | 'score' = ''
    sortOrder: number = 1;

    presentingElement = null;

    constructor(public lessonService: LessonService,
        public studentsService: StudentsService,
        public globalService: GlobalService,
        private route: ActivatedRoute,
        private alertController: AlertController,
        private actionSheetCtrl: ActionSheetController,
        private chartService: ChartService,
        private localNotifications: LocalNotifications,
        private router: Router) {

        this.lessonId = Number(this.route.snapshot.paramMap.get('lessonId'));
        if (this.route.snapshot.paramMap.has('scheduleId'))
            this.scheduleId = Number(this.route.snapshot.paramMap.get('scheduleId'))

    }

    ngOnInit() {
        this.presentingElement = document.querySelector('.ion-page');
    }

    ionViewWillEnter() {
        this.viewMode = this.globalService.settings.studentViewMode;
        this.sortType = this.globalService.settings.studentSortType;
        this.sortOrder = this.globalService.settings.studentSortOrder;

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
                this.homeWork = this.globalService.currentSession.homeWorks?.find(x => x.creatorTaskId != this.globalService.currentSession.id);
                // this.studentsService.getStudentsOfClass(this.globalService.selectedClass.id).then(students => {
                //     this.students = [...students];
                //     //Must set all reminders at once for student and display it by type
                //     this.initStudents();
                // });
                this.initTimer();
                this.initTimer2();
            }
            else if (ready)
                this.router.navigateByUrl('tabs/home', { replaceUrl: true })

        })
        //If students state changed by attendance
        this.studentsService.students$.subscribe(students => {
            this.all_students = [...students];
            this.students = this.all_students;
            this.groupStudent.push(<GroupStudentModel>{
                title: 'قدرت',
                students: [this.students[0], this.students[2], this.students[4], this.students[6]]
            });
            this.groupStudent.push(<GroupStudentModel>{
                title: 'شهامت',
                students: [this.students[1], this.students[3], this.students[5]]
            });
            //Must set all reminders at once for student and display it by type
            this.initStudents();
            this.sort();
        })
    }


    initStudents() {
        //TODO: can move this.studentsService.students$.subscribe and not check this.globalService.currentSession
        if (this.globalService.currentSession) {
            const scores = this.globalService.currentSession.scores;
            const reminders = this.globalService.currentSession.reminders?.filter(x => x.type == ReminderType.StudentReminder).map(x => x as StudentReminder);
            const notes = this.globalService.currentSession.reminders?.filter(x => x.type == ReminderType.StudentNotes).map(x => x as StudentNotes);
            const assesments = this.globalService.currentSession.assessments;

            this.all_students.forEach(s => {
                const s_s = scores?.filter(x => x.studentId == s.id);
                if (s_s) {
                    s.scores = [];
                    s_s.forEach(x => {
                        s.scores.push(x);
                    });
                }


                const s_r = reminders?.filter(x => x.studentId == s.id);
                if (s_r) {
                    s.reminders = [];
                    s_r.forEach(x => {
                        s.reminders.push(x);
                    });
                }


                const s_n = notes?.filter(x => x.studentId == s.id);
                if (s_n) {
                    s.notes = [];
                    s_n.forEach(x => {
                        s.notes.push(x);
                    });
                }

                s.hasAssessment = assesments?.filter(x => x.studentId == s.id).length > 0;


            })
        }

    }

    initTimer() {
        const durationMinute = 45;
        let duration = new Date().getTime() - this.globalService.currentSession.startTime.getTime();
        duration = Math.floor(duration / 1000);
        duration = durationMinute * 60 - duration;
        if (duration > 0) {

            this.mintues = Math.floor(duration / 60);
            this.seconds = duration - this.mintues * 60;
            this.timer1Subscribtion = interval(1000).subscribe(x => {
                this.seconds -= 1;
                if (this.seconds < 0) {
                    this.seconds = 59;
                    this.mintues -= 1;
                }
                this.percentTimer1 = (this.mintues + (this.seconds / 60)) / 45 * 100;
            });
        }
        else
            this.percentTimer1 = 0;
    }

    createTimer(minutes: number) {
        const startTime = new Date().getTime();
        localStorage.setItem("CLASSAID_TIMER", `${startTime},${minutes}`);

        this.initTimer2();


    }

    initTimer2() {
        const data = localStorage.getItem("CLASSAID_TIMER");
        if (data) {
            this.localNotifications.cancel(200);
            const dataParts = data.split(",");
            let startTime = parseInt(dataParts[0]);
            const durationMinute = parseInt(dataParts[1]);
            let duration = new Date().getTime() - startTime;
            duration = Math.floor(duration / 1000);
            duration = durationMinute * 60 - duration;

            this.mintues2 = Math.floor(duration / 60);
            this.seconds2 = duration - this.mintues2 * 60;
            this.timer2Subscribtion = interval(1000)
                .subscribe(x => {
                    this.seconds2 -= 1;
                    if (this.seconds2 < 0) {
                        this.seconds2 = 59;
                        this.mintues2 -= 1;
                    }
                    if (this.mintues2 < 0)
                        this.stopTimer();
                    this.percentTimer2 = (this.mintues2 + (this.seconds2 / 60)) / durationMinute * 100;

                });

            this.localNotifications.schedule({
                id: 200,
                text: 'پایان زمان سنج',
                trigger: { in: this.mintues, unit: ELocalNotificationTriggerUnit.MINUTE },
                led: 'FF0000',
                sound: null
            });
        }

    }

    stopTimer() {
        this.timer2Subscribtion.unsubscribe();
        this.timer2Subscribtion = undefined;
        this.localNotifications.cancel(200);
    }

    createRandomStudent() {
        this.isRandomModalOpen = true;
        let counter = 0;
        let looper = setInterval(x => {
            if (counter > 8)
                clearInterval(looper);
            counter++;
            const students = this.all_students.filter(x => x.attendanceStatus != AttendanceStatus.Absent);
            const rnd = Math.floor(Math.random() * students.length);
            this.randomStudent = students[rnd];
        }, 150);
    }

    setViewMode(value) {
        this.viewMode = value;
        this.globalService.settings.studentViewMode = value;
        this.globalService.saveSetting();
    }

    onSort(value) {
        if (value == this.sortType && value != '')
            this.sortOrder = this.sortOrder * -1;
        this.sortType = value;
        this.globalService.settings.studentSortType = this.sortType;
        this.globalService.settings.studentSortOrder = this.sortOrder;
        this.globalService.saveSetting();
        this.sort();
    }

    sort() {
        this.searchTerm = "";
        switch (this.sortType) {
            case 'name':
                if (this.sortOrder)
                    this.all_students = this.all_students.sort((a, b) => a.name > b.name ? this.sortOrder : (a.name < b.name ? this.sortOrder * -1 : 0))

                break;
            case 'lastname':
                this.all_students = this.all_students.sort((a, b) => a.family > b.family ? this.sortOrder : (a.family < b.family ? this.sortOrder * -1 : 0))
                break;
            case 'attendance':
                this.all_students = this.all_students.sort((a, b) => a.attendanceStatus > b.attendanceStatus ? this.sortOrder : (a.attendanceStatus < b.attendanceStatus ? this.sortOrder * -1 : 0))
                break;
            default:
                break;
        }
    }

    search(event) {
        if (this.searchTerm)
            this.students = this.all_students.filter(x => x.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()));
        else
            this.students = this.all_students;
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

    async onTest() {
        const alert = await this.alertController.create({
            header: 'عدم آمادگی',
            message: 'این قابلیت در دست ساخت می باشد',
            buttons: [
                {
                    text: 'تایید',
                    role: 'confirm'
                }
            ],
        });

        await alert.present();
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

    assessHomeWork() {
        this.router.navigateByUrl(`tabs/home-work/${this.homeWork.id}`)
    }




}
