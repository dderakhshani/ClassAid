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
import { Platform } from '@ionic/angular';

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

    viewMode: "dashboard" | "timeline" = "dashboard";

    absentStudents: StudentModel[] = [];
    nextLesson: Lesson;
    lessonChartOptions: any;
    dateName: string;
    todayDay: number;
    todayShedules: ScheduleTimeModel[] = [];

    constructor(private router: Router,
        private studentsService: StudentsService,
        private scheduleService: ScheduleService,
        private platform: Platform,
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

        this.globalService.selectedClass$.subscribe(selectedClass => {
            if (selectedClass) {
                this.todayShedules = this.globalService.todayShedules;

                this.lessonService.getLessonById(1185).then(l => {
                    this.nextLesson = l;
                    this.lessonChartOptions = this.chartService.createPieGaugeChart(10, 0, 100, "ساعت");
                });

            }

        });

        this.studentsService.students$.subscribe(students => {

            this.absentStudents = students.filter(x => !x.present);
        });


    }

    attendance() {
        this.router.navigateByUrl(`/tabs/home/attendance`)
    }

}
