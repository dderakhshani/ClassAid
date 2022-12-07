import { ScheduleService } from './../../api/schedule.service';
import { GlobalService } from 'src/app/services/global.service';
import { Component, OnInit } from '@angular/core';
import { LessonService } from 'src/app/api/lesson.service';
import { DateDay, Ring } from 'src/app/models/day';
import { Lesson } from 'src/app/models/lessons';
import { ScheduleModel, ScheduleTimeModel } from 'src/app/models/schedule';
import { LoadingController } from '@ionic/angular';

@Component({
    selector: 'app-schedule',
    templateUrl: './schedule.page.html',
    styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {

    displayMode: string = 'table';
    _schedules: ScheduleTimeModel[] = [];
    schedule: ScheduleModel;
    set schedules(value: ScheduleTimeModel[]) {
        this._schedules = value;
    }

    get schedules() {
        return this._schedules;
    }

    lessons: Lesson[];

    rings: Ring[];

    days: DateDay[] = [
        <DateDay>{ no: 1, dayName: 'شنبه', symbol: 'شنبه' },
        <DateDay>{ no: 2, dayName: 'یکشنبه', symbol: 'یک' },
        <DateDay>{ no: 3, dayName: 'دوشنبه', symbol: 'دو' },
        <DateDay>{ no: 4, dayName: 'سه شنبه', symbol: 'سه' },
        <DateDay>{ no: 5, dayName: 'چهارشنبه', symbol: 'چهار' },
        <DateDay>{ no: 6, dayName: 'پنجشنبه', symbol: 'پنج' },
    ];

    constructor(public lessonService: LessonService,
        private scheduleService: ScheduleService,
        private loadingCtrl: LoadingController,
        private globalService: GlobalService) {
        this.rings = this.globalService.rings;
    }

    ngOnInit() {
        this.lessonService.getBooks(this.globalService.selectedClass.schoolId, this.globalService.selectedClass.gradeId).then(r => {
            this.lessons = r;
            this.scheduleService.get(this.globalService.selectedClass.id).then(x => {
                this.schedule = x;
                x.scheduleTimes.forEach(st => {
                    st.ring = this.rings.find(x => x.id == st.ringId);
                    st.lesson = this.lessons.find(x => x.id == st.lessonId);
                })
                this.schedules = x.scheduleTimes;
            });
        });
    }

    async save() {

        if (this.schedule == undefined) {
            this.schedule = <ScheduleModel>{
                classId: this.globalService.selectedClass.id,
                scheduleTimes: this.schedules
            };
        }
        const loading = await this.loadingCtrl.create();

        loading.present();
        this.scheduleService.saveSchedule(this.schedule).then(x => {
            loading.dismiss();
        });
    }

}
