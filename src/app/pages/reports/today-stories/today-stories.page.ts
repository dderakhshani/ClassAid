import { Component, OnInit } from '@angular/core';
import { ClassService } from 'src/app/api/class.service';
import { ReminderService } from 'src/app/api/reminder.service';
import { LessonNotes } from 'src/app/models/remider';
import { GlobalService } from 'src/app/services/global.service';
import { environment } from 'src/environments/environment';

import { LessonService } from 'src/app/api/lesson.service';

@Component({
    selector: 'app-today-stories',
    templateUrl: './today-stories.page.html',
    styleUrls: ['./today-stories.page.scss'],
})
export class TodayStoriesPage implements OnInit {
    imageUrl = environment.imageUrl + '/';

    sessionIdParam: string;
    colors = ["primary", "danger", "success", "secondary", "warning", "tertiary", "medium"];


    lesson_notes: LessonNotes[];

    constructor(private reminderService: ReminderService,
        public lessonService: LessonService,
        public globalService: GlobalService,) { }

    ngOnInit() {
        this.globalService.ready$.subscribe(ready => {
            if (ready)
                this.reminderService.getTodayNotes(this.globalService.selectedClass.id).then(data => {
                    this.lesson_notes = data;
                    this.lesson_notes.forEach(item => {
                        item.book = this.lessonService.getLessonByIdSynce(item.lessonId);
                        item.lesson = this.lessonService.getLessonByIdSynce(item.subLessonId);
                    })
                });
        })
    }

    async share_notes(note: LessonNotes) {
        let title = note.isReport ? 'گزارش ' : 'یادداشت ';
        title += note.book.name;

        if (note.images) {
            this.globalService.shareData(title, note.note, environment.imageUrl + '/' + note.images[0]);
        }
        else
            this.globalService.shareData(title, note.note);

    }


}
