import { LessonService } from './../../../api/lesson.service';
import { Lesson } from './../../../models/lessons';
import { ClassSessionModel } from './../../../models/class';
import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';

@Component({
    selector: 'app-sessions-report',
    templateUrl: './sessions-report.page.html',
    styleUrls: ['./sessions-report.page.scss'],
})
export class SessionsReportPage implements OnInit {

    sessions: ClassSessionModel[];
    lessonFilter: Lesson;
    lessons: Lesson[];

    dateType: 'week' | 'last-week' | 'month' | 'last-month' | 'last-custom' = 'week';
    constructor(public globalService: GlobalService,
        private lessonService: LessonService) {

    }

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.globalService.ready$.subscribe(ready => {
            if (ready) {
                this.lessons = this.lessonService.books$.value;
            }
        })
        this.globalService.classSessions$.subscribe(sessions => {
            if (sessions) {
                this.loadData();
            }
        })
    }

    loadData() {
        if (this.dateType == 'week') {
            let startTime = new Date();
            startTime.setDate(startTime.getDate() - 7);
            this.sessions = this.globalService.sessions.filter(x => x.startTime > startTime);

        }
        else if (this.dateType == 'month') {
            let startTime = new Date();
            startTime.setDate(startTime.getDate() - 30);
            this.sessions = this.globalService.sessions.filter(x => x.startTime > startTime);
        }
        if (this.lessonFilter)
            this.sessions = this.sessions.filter(x => x.lessonId == this.lessonFilter.id);
    }
}
