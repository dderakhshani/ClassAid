import { ScheduleTimeModel } from './../../models/schedule';
import { Component, Input, OnInit } from '@angular/core';
import { ChartService } from 'src/app/services/chart.service';
import { GlobalService } from 'src/app/services/global.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'app-schedule-item',
    templateUrl: './schedule-item.component.html',
    styleUrls: ['./schedule-item.component.scss'],
})
export class ScheduleItemComponent implements OnInit {

    @Input()
    schedule: ScheduleTimeModel;
    language: any;

    constructor(private chartService: ChartService,
        private router: Router,
        private alertController: AlertController,
        public globalService: GlobalService,
        private translateConfigService: TranslateConfigService,
        private translate: TranslateService) {
        this.translateConfigService.initLanguage();
        this.language = this.translateConfigService.getCurrentLang();
    }

    ngOnInit() { }

    lessonChartOptions(schedule: ScheduleTimeModel): any {
        return this.chartService.createPieGaugeChart(schedule.lesson?.sessionsCount, 0, 100, "جلسه");
    }

    openClass(schedule: ScheduleTimeModel) {
        if (schedule.session?.endTime) {
            this.router.navigateByUrl(`/tabs/reports/class-report/${schedule.session.id}`);
        }
        else
            this.router.navigateByUrl(`/tabs/class/0`);
    }

    async start(schedule: ScheduleTimeModel) {
        if (this.globalService.currentSession) {
            const alert = await this.alertController.create({
                header: 'هشدار',
                subHeader: 'نمی توانید کلاس جدیدی را شروع کرد',
                message: 'کلاس قبلی هنوز باز می باشد، می بایست وارد کلاس شده و کلاس را پایان دهید',
                buttons: [
                    {
                        text: 'تایید',
                        role: 'cancel',
                        handler: () => {

                        },
                    },
                    {
                        text: 'رفتن به کلاس',
                        role: 'confirm',
                        handler: () => {
                            this.router.navigateByUrl(`/tabs/class/0`);
                        },
                    },
                ],
            });

            await alert.present();
            return;
        }
        this.router.navigateByUrl(`/lessons/details/${schedule.lessonId}/${schedule.id}`);

    }

}
