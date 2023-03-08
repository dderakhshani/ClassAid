import { ScheduleService } from './../../api/schedule.service';
import { GlobalService } from 'src/app/services/global.service';
import { Component, OnInit } from '@angular/core';
import { LessonService } from 'src/app/api/lesson.service';
import { DateDay, Days, Ring } from 'src/app/models/day';
import { Lesson } from 'src/app/models/lessons';
import { ScheduleModel, ScheduleTimeModel } from 'src/app/models/schedule';
import { LoadingController } from '@ionic/angular';
import { combineLatest } from 'rxjs';
import { Router } from '@angular/router';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-schedule',
    templateUrl: './schedule.page.html',
    styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {

    language: any;
    todayShedules: ScheduleTimeModel[] = [];

    constructor(
        private loadingCtrl: LoadingController,
        private router: Router,
        public globalService: GlobalService) {
    }

    ngOnInit() {

    }

    ionViewWillEnter() {
        combineLatest(this.globalService.classSessions$, this.globalService.ready$).subscribe(([sessions, ready]) => {
            if (ready) {
                this.todayShedules = this.globalService.todayShedules;
                //if there is no schedule defined for day (Or there is no at all) go to Edit-Schedule
                if (this.todayShedules.length == 0)
                    this.router.navigateByUrl('edit')
            }
        });
    }


}
