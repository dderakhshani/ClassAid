import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, PickerColumnOption, PickerController } from '@ionic/angular';
import { DateDay, Ring } from 'src/app/models/day';
import { Lesson } from 'src/app/models/lessons';
import { ScheduleTimeModel, ScheduleModel } from 'src/app/models/schedule';
import { GlobalService } from 'src/app/services/global.service';
import { ChartService } from 'src/app/services/chart.service';
import { AssessMeasures } from 'src/app/models/stats-serie';

@Component({
    selector: 'app-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit {
    AssessMeasures = AssessMeasures;

    @Input()
    schedules: ScheduleTimeModel[];

    @Input()
    lessons: Lesson[];

    @Input()
    selectedDay: number;

    @Input()
    rings: Ring[];


    constructor(

        private chartService: ChartService,
        public globalService: GlobalService,) {

    }

    ngOnInit() {
        this.schedules.forEach(x => {
            const i = Math.floor(Math.random() * 4);
            x.lesson.avgAssess = AssessMeasures[i];
        })
    }

    getSchedule(ring: Ring) {
        const schedule = this.schedules.find(x => x.ringId == ring.id && x.dayNo == this.selectedDay);
        return schedule;
    }



}
