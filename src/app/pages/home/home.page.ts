import { Reminder } from './../../models/remider';
import { environment } from 'src/environments/environment';
import { Lesson } from 'src/app/models/lessons';
import { ReminderService } from './../../api/reminder.service';
import { DateDay } from 'src/app/models/day';
import { StudentModel } from './../../models/student';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentsService } from 'src/app/api/students.service';
import { LessonService } from 'src/app/api/lesson.service';
import { ChartService } from 'src/app/services/chart.service';
import { ScheduleService } from 'src/app/api/schedule.service';
import { GlobalService } from 'src/app/services/global.service';
import { ScheduleTimeModel } from 'src/app/models/schedule';
import { AlertController, Platform } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth.service';
import { AttendanceStatus } from 'src/app/models/attendance-model';
import { combineLatest } from 'rxjs';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
    studentModel = StudentModel;
    lesson = Lesson;
    slideOpts = {
        initialSlide: 0,
        speed: 350,
        effect: 'flip',
        autoplay: true
    };


    absentStudents: StudentModel[] = [];
    nextCurrentSchedule: ScheduleTimeModel;
    nextScheduleStatus: 'none' | 'has' | 'finish' = 'none';
    lessonChartOptions: any;
    dateName: string;
    todayDay: number;
    todayShedules: ScheduleTimeModel[] = [];

    constructor(private router: Router,
        private studentsService: StudentsService,
        private scheduleService: ScheduleService,
        public authService: AuthService,
        private platform: Platform,
        private alertController: AlertController,
        private chartService: ChartService,
        public globalService: GlobalService,
        public reminderService: ReminderService,
        public lessonService: LessonService,
    ) {
        const d = new Date();
        const options: Intl.DateTimeFormatOptions = <Intl.DateTimeFormatOptions>{ dateStyle: 'full' };
        this.dateName = new Intl.DateTimeFormat('fa-IR', options).format(d);
        //alert(this.platform.is('mobileweb'));
    }

    ngOnInit(): void {
        this.todayDay = this.globalService.todayDay;
    }

    ionViewWillEnter() {
        combineLatest(this.globalService.classSessions$, this.globalService.ready$).subscribe(([sessions, ready]) => {
            if (ready) {
                this.todayShedules = this.globalService.todayShedules;
                this.setNextCurrentSchedule();

                if (sessions && sessions.length > 0) {
                    this.setNextCurrentSchedule();
                }
            }
        });

        this.studentsService.students$.subscribe(students => {

            this.absentStudents = students.filter(x => x.attendanceStatus == AttendanceStatus.Absent);
        });
    }

    async attendance() {
        if (this.globalService.currentSession)
            this.router.navigateByUrl(`/tabs/home/attendance/${this.globalService.currentSession.id}`);
        else {
            const alert = await this.alertController.create({
                header: 'هشدار',
                message: 'برای حضور و غیاب ابتدا یک کلاس درس را شروع نمایید',
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

    setNextCurrentSchedule() {
        let nextCurrentSchedule_: ScheduleTimeModel;
        if (this.globalService.currentSession) {
            nextCurrentSchedule_ = this.todayShedules.find((x: ScheduleTimeModel) => x.id == this.globalService.currentSession.scheduleTimeId);
            //Lesson started manually with no schedule
            if (nextCurrentSchedule_ == undefined) {
                nextCurrentSchedule_ = <ScheduleTimeModel>{
                    id: 0,
                    lessonId: this.globalService.currentSession.lessonId,
                    session: this.globalService.currentSession,
                    dayNo: this.globalService.todayDay,
                    lesson: this.globalService.currentSession.book
                    //  ring
                }
            }
        }
        else
            nextCurrentSchedule_ = this.todayShedules.find((x: ScheduleTimeModel) => x.session == null);

        const nextScheduleIndex = this.todayShedules.indexOf(nextCurrentSchedule_);

        if (nextCurrentSchedule_) {
            this.nextScheduleStatus = 'has';
            this.nextCurrentSchedule = nextCurrentSchedule_;
            this.lessonService.getLessonById(this.nextCurrentSchedule.lessonId).then(l => {
                this.lessonChartOptions = this.chartService.createPieGaugeChart(l.sessionsCount, 0, 100, "جلسه");
            });
        }
        else if (this.todayShedules.length > 0 && nextScheduleIndex >= this.todayShedules.length)
            this.nextScheduleStatus = 'finish';
        else
            this.nextScheduleStatus = 'none';


    }

    async showReminder(remidner: Reminder) {
        const alert = await this.alertController.create({
            header: 'متن یادآور',
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
