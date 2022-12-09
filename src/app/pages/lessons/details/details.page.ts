import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonService } from 'src/app/api/lesson.service';
import { Lesson } from 'src/app/models/lessons';
import { GlobalService } from 'src/app/services/global.service';

@Component({
    selector: 'app-details',
    templateUrl: './details.page.html',
    styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

    lessons: Lesson[];
    book: Lesson;
    scheduleId?: number;

    constructor(public lessonService: LessonService,
        public globalService: GlobalService,
        private route: ActivatedRoute,
        private router: Router) {
        const bookId = Number(this.route.snapshot.paramMap.get('lessonId'));

        if (this.route.snapshot.paramMap.has('scheduleId'))
            this.scheduleId = Number(this.route.snapshot.paramMap.get('scheduleId'))

        lessonService.getLessonById(bookId).then(b => {
            this.book = b;
            this.lessonService.getLessonsByParentId(this.book.id).then(r => {
                this.lessons = [...r];
                this.lessons.forEach(l => {
                    l.sessionsCount = this.globalService.sessions.filter(x => x.subLessonId == l.id).length;
                })
            });
        });
    }

    ngOnInit() {

    }

    startClass(lesson: Lesson) {
        if (this.scheduleId)
            this.router.navigateByUrl(`/tabs/class/${lesson.id}/${this.scheduleId}`);
        else
            this.router.navigateByUrl(`/tabs/class/${lesson.id}`);
    }

}
