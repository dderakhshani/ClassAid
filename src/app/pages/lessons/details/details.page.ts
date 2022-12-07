import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonService } from 'src/app/api/lesson.service';
import { Lesson } from 'src/app/models/lessons';

@Component({
    selector: 'app-details',
    templateUrl: './details.page.html',
    styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

    lessons: Lesson[];
    book: Lesson;
    lastLesson: Lesson | undefined;

    constructor(public lessonService: LessonService,
        private route: ActivatedRoute,
        private router: Router) {
        const bookId = Number(this.route.snapshot.paramMap.get('lessonId'));
        lessonService.getLessonById(bookId).then(b => {
            this.book = b;
            this.lessonService.getLessonsByParentId(this.book.id).then(r => {
                this.lessons = r;
            });
        });
    }

    ngOnInit() {

    }

    startClass(lesson: Lesson) {
        this.router.navigateByUrl(`/tabs/class/${lesson.id}`);
    }

}
