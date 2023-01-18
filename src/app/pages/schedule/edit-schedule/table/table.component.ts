
import { environment } from 'src/environments/environment';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActionSheetController, PickerColumnOption, PickerController } from '@ionic/angular';
import { ScheduleMode } from 'src/app/core/bases/constants';
import { DateDay, Ring } from 'src/app/models/day';
import { Lesson } from 'src/app/models/lessons';
import { GlobalService } from 'src/app/services/global.service';
import { ScheduleTimeModel } from 'src/app/models/schedule';
import { LessonService } from 'src/app/api/lesson.service';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {

    @Input()
    scheduleMode: ScheduleMode;

    @Input()
    schedules: ScheduleTimeModel[];
    @Output()
    schedulesChange = new EventEmitter<ScheduleTimeModel[]>();

    @Input()
    lessons: Lesson[];
    @Input()
    rings: Ring[];
    @Input()
    days: DateDay[];

    ringMode: 'time' | 'title' = 'time';

    constructor(private pickerCtrl: PickerController,
        private actionSheetCtrl: ActionSheetController,
        public lessonService: LessonService) {

    }

    ngOnInit() {

    }

    async openLessonPicker(ring: Ring, dayNo: number) {
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
                        this.schedules.push(<ScheduleTimeModel>{ ringId: ring.id, ring: ring, dayNo: dayNo, lessonId: lesson.id, lesson: lesson });
                        this.schedulesChange.emit(this.schedules);
                    },
                },
            ],
        });

        await picker.present();
    }

    async openMenu(schedule: ScheduleTimeModel) {
        const actionSheet = await this.actionSheetCtrl.create({
            header: 'انتخاب عملیات',
            buttons: [
                {
                    text: 'حذف',
                    role: 'destructive',
                    icon: 'trash-outline',
                    data: {
                        action: 'delete',
                    },
                },
                {
                    text: 'ویرایش',
                    icon: 'create-outline',
                    data: {
                        action: 'edit',
                    },
                },
                {
                    text: 'لغو',
                    role: 'cancel',
                    data: {
                        action: 'cancel',
                    },
                },
            ],
        });

        await actionSheet.present();

        const result = await actionSheet.onDidDismiss();
        if (result.data?.action == "delete") {
            this.schedules.splice(this.schedules.indexOf(schedule), 1);
        }
        else if (result.data?.action == "edit") {
            this.schedules.splice(this.schedules.indexOf(schedule), 1);
            this.openLessonPicker(schedule.ring, schedule.dayNo);
        }

    }

    getSchedule(ring: Ring, day: DateDay) {
        return this.schedules.find(x => x.ringId == ring.id && x.dayNo == day.no);
    }



}
