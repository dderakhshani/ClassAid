import { ScheduleTimeModel } from './../../models/schedule';
import { Component, Input, OnInit } from '@angular/core';
import { ChartService } from 'src/app/services/chart.service';
import { GlobalService } from 'src/app/services/global.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
    selector: 'app-schedule-item',
    templateUrl: './schedule-item.component.html',
    styleUrls: ['./schedule-item.component.scss'],
})
export class ScheduleItemComponent implements OnInit {

    @Input()
    schedule: ScheduleTimeModel;

    constructor(private chartService: ChartService,
        private router: Router,
        private alertController: AlertController,
        public globalService: GlobalService,) { }

    ngOnInit() { }

    lessonChartOptions(schedule: ScheduleTimeModel): any {
        return this.chartService.createPieGaugeChart(schedule.lesson?.sessionsCount, 0, 100, "جلسه");
    }

    openClass(schedule: ScheduleTimeModel) {
        if (schedule.session?.endTime) {
            //TODO: Open Report class
        }
        else
            this.router.navigateByUrl(`/tabs/class/0`);
    }

    async start(schedule: ScheduleTimeModel) {
        if (this.globalService.currentClassTask) {
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
