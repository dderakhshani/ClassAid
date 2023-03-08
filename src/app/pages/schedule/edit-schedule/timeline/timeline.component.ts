import { GlobalService } from 'src/app/services/global.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PickerColumnOption, PickerController } from '@ionic/angular';
import { DateDay, Ring } from 'src/app/models/day';
import { Lesson } from 'src/app/models/lessons';
import { ScheduleTimeModel } from 'src/app/models/schedule';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit {

    @Input()
    singleDay: boolean = false;

    @Input()
    schedules: ScheduleTimeModel[];
    @Output()
    schedulesChange = new EventEmitter<ScheduleTimeModel[]>();

    @Input()
    lessons: Lesson[];

    @Input()
    selectedDay: DateDay;

    @Input()
    rings: Ring[];
    @Input()
    days: DateDay[];

    constructor(private pickerCtrl: PickerController,
        private translate: TranslateService,
        private globalService: GlobalService) {

    }

    ngOnInit() {
        //Single day mode has no days
        if (this.days && this.days.length > 0) {
            this.selectedDay = this.days[0];
            this.selectedDay = this.days.find(x => x.no == this.globalService.todayDay);

        }

    }

    getSchedule(ring: Ring) {
        return this.schedules.find(x => x.ringId == ring.id && x.dayNo == this.selectedDay.no);
    }

    async edit(schedule: ScheduleTimeModel) {
        this.schedules.splice(this.schedules.indexOf(schedule), 1);
        this.openPicker(schedule.ring);
    }

    deleteItem(schedule: ScheduleTimeModel) {
        this.schedules.splice(this.schedules.indexOf(schedule), 1);
    }

    async openPicker(ring: Ring) {
        const picker = await this.pickerCtrl.create({
            columns: [
                {
                    name: 'lessons',
                    options: this.lessons.map(x => (<PickerColumnOption>{ text: x.name, value: x.id }))
                },
            ],
            mode: 'ios',
            buttons: [
                {
                    text: this.translate.instant('CANCEL'),
                    role: 'cancel',
                },
                {
                    text: this.translate.instant('SCHEDULE.SELECT'),
                    handler: (value) => {
                        const lesson = this.lessons.find(x => x.id == value.lessons.value);
                        this.schedules.push(<ScheduleTimeModel>{ ringId: ring.id, ring: ring, dayNo: this.selectedDay.no, lessonId: lesson.id, lesson: lesson });
                        this.schedulesChange.emit(this.schedules);
                    },
                },
            ],
        });

        await picker.present();
    }

}
