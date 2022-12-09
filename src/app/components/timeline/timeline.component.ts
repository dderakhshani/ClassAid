import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, PickerColumnOption, PickerController } from '@ionic/angular';
import { DateDay, Ring } from 'src/app/models/day';
import { Lesson } from 'src/app/models/lessons';
import { ScheduleTimeModel, ScheduleModel } from 'src/app/models/schedule';
import { GlobalService } from 'src/app/services/global.service';
import { ChartService } from 'src/app/services/chart.service';

@Component({
    selector: 'app-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit {


    @Input()
    schedules: ScheduleTimeModel[];

    @Input()
    lessons: Lesson[];

    @Input()
    selectedDay: number;

    @Input()
    rings: Ring[];


    constructor(private router: Router,
        private alertController: AlertController,
        private chartService: ChartService,
        public globalService: GlobalService,) {

    }

    ngOnInit() {

    }

    getSchedule(ring: Ring) {
        //Reminder: remove -1
        const schedule = this.schedules.find(x => x.ringId == ring.id && x.dayNo == this.selectedDay - 1);
        return schedule;
    }

    lessonChartOptions(schedule: ScheduleTimeModel): any {
        return this.chartService.createPieGaugeChart(15, 0, 100, "ساعت");
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
