import { GlobalService } from './../services/global.service';
import { Lesson } from 'src/app/models/lessons';

import { HttpService } from './../core/services/http.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LessonService {
    LESSON_STORAGE = "CLASSAID_LESSONS";
    allLessons$ = new BehaviorSubject<Lesson[]>([]);
    books$ = new BehaviorSubject<Lesson[]>([]);


    constructor(private httpService: HttpService) {
        const lessonsJson = localStorage.getItem(this.LESSON_STORAGE);
        if (lessonsJson) {
            const lessons = JSON.parse(lessonsJson);
            this.initBooks(lessons);
        }
    }

    reset() {
        localStorage.removeItem(this.LESSON_STORAGE);
        this.allLessons$.next([]);
        this.books$.next([]);
    }
    //TODO: Get Lessons by SchoolId not load all lessons
    getBooks(schoolId: number, gradeId: number): Promise<Lesson[]> {
        return new Promise((resolve, reject) => {
            if (this.books$.value.length > 0)
                return resolve(this.books$.value.filter(x => x.gradeId == gradeId && (x.schoolId == schoolId || x.schoolId == null)));
            else
                this.httpService.http.getDataByParam<Lesson[]>({ gradeId: gradeId }, "lesson/GetByGrade").then(r => {
                    localStorage.setItem(this.LESSON_STORAGE, JSON.stringify(r));
                    this.initBooks(r);
                    return resolve(this.books$.value.filter(x => x.gradeId == gradeId && (x.schoolId == schoolId || x.schoolId == null)));
                }, err => {
                    reject(err);
                });

        });
    }

    initBooks(rawData: Lesson[]) {
        const allLessons = rawData.map(x => Object.assign(new Lesson(), x));
        const books = allLessons.filter(x => x.parentId == null);
        this.allLessons$.next(allLessons);
        books.forEach(b => {
            b.subLessonCount = allLessons.filter(x => x.parentId == b.id).length;
        })
        this.books$.next(books);
    }

    getLessonsByParentId(parentId: number): Promise<Lesson[]> {
        return new Promise(resolve => {
            return resolve(this.allLessons$.value.filter(x => x.parentId == parentId));
        });
    }

    //Must load once all grade/School lesson
    getLessonById(lessonId: number): Promise<Lesson> {
        if (this.allLessons$.value.length > 0)
            return new Promise(resolve => {
                const lesson = this.allLessons$.value.find(x => x.id == lessonId);
                return resolve(lesson);
            });
    }

    getLessonByIdSynce(lessonId: number): Lesson {
        return this.allLessons$.value.find(x => x.id == lessonId);
    }


    // getLessonImage(lesson: Lesson) {
    //     return `${environment.imageUrl}/lessons_org/grade_${lesson.GradeId}/c_${lesson.Id}.jpg`;
    // }

    getLessonImageById(lessonId: number) {
        const lesson = this.allLessons$.value.find(x => x.id == lessonId);
        return `${environment.imageUrl}/lessons_org/grade_${lesson.gradeId}/c_${lesson.id}.jpg`;
    }


}
