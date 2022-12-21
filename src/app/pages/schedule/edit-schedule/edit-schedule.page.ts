import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { LessonService } from 'src/app/api/lesson.service';
import { ScheduleService } from 'src/app/api/schedule.service';
import { DateDay, Days, Ring } from 'src/app/models/day';
import { Lesson } from 'src/app/models/lessons';
import { ScheduleModel, ScheduleTimeModel } from 'src/app/models/schedule';
import { GlobalService } from 'src/app/services/global.service';
import { Location } from '@angular/common'

@Component({
    selector: 'app-edit-schedule',
    templateUrl: './edit-schedule.page.html',
    styleUrls: ['./edit-schedule.page.scss'],
})
export class EditSchedulePage implements OnInit {

    loading = false;

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

    days: DateDay[] = Days;

    constructor(private globalService: GlobalService,
        private loadingCtrl: LoadingController,
        public lessonService: LessonService,
        private scheduleService: ScheduleService,
        public location: Location) { }

    ngOnInit() {
        this.loading = true;
        this.globalService.ready$.subscribe(ready => {
            if (ready) {
                this.rings = this.globalService.rings;
                this.lessonService.getBooks(this.globalService.selectedClass.schoolId, this.globalService.selectedClass.gradeId).then(r => {
                    this.lessons = r;
                    this.scheduleService.get(this.globalService.selectedClass.id).then(x => {
                        this.schedule = x;
                        if (this.schedule) {
                            x.scheduleTimes.forEach(st => {
                                st.ring = this.rings.find(x => x.id == st.ringId);
                                st.lesson = this.lessons.find(x => x.id == st.lessonId);
                            })
                            this.schedules = x.scheduleTimes;

                        }
                        this.loading = false;
                    });
                });
            }

        })
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
        },
            err => {
                loading.dismiss();
            });
    }

}
