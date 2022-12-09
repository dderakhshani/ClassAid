import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PickerColumnOption, PickerController } from '@ionic/angular';
import { DateDay, Ring } from 'src/app/models/day';
import { Lesson } from 'src/app/models/lessons';
import { ScheduleTimeModel } from 'src/app/models/schedule';

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

    constructor(private pickerCtrl: PickerController,) {

    }

    ngOnInit() {
        //Single day mode has no days
        if (this.days && this.days.length > 0)
            this.selectedDay = this.days[0];
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
                    text: 'لغو',
                    role: 'cancel',
                },
                {
                    text: 'انتخاب',
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
