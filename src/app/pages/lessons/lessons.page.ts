import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LessonService } from 'src/app/api/lesson.service';
import { Lesson } from 'src/app/models/lessons';
import { GlobalService } from 'src/app/services/global.service';

@Component({
    selector: 'app-lessons',
    templateUrl: './lessons.page.html',
    styleUrls: ['./lessons.page.scss'],
})
export class LessonsPage implements OnInit {

    lessons: Lesson[];
    loading = true;

    constructor(public lessonService: LessonService,
        private globalService: GlobalService,
        private router: Router) { }

    ngOnInit() {
        this.globalService.ready$.subscribe(ready => {
            if (ready)
                this.lessonService.getBooks(this.globalService.selectedClass.schoolId, this.globalService.selectedClass.gradeId).then(r => {
                    this.loading = false;
                    this.lessons = r;

                });
        })

    }

    detail(item: Lesson) {
        this.router.navigateByUrl(`/lessons/details/${item.id}`);
    }

}
