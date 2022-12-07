import { Subject, BehaviorSubject } from 'rxjs';
import { Ring } from './../models/day';
import { Lesson } from 'src/app/models/lessons';
import { ClassModel, ClassTaskModel } from './../models/class';
import { StorageService } from './../core/services/storage.service';
import { Injectable } from '@angular/core';
import { ScheduleService } from '../api/schedule.service';
import { StudentsService } from '../api/students.service';
import { LessonService } from '../api/lesson.service';
const CLASS_STORAGE = "CLASSAID_CLASS";

@Injectable({
    providedIn: 'root'
})
export class GlobalService {

    public teacherId: number = 7;

    public rings: Ring[];//Ring is diffrent for each school & grade (& maybe class)

    selectedClass$ = new BehaviorSubject<ClassModel>(null);
    public currentClassTask: ClassTaskModel | undefined;


    constructor(private storageService: StorageService,
        private studentsService: StudentsService,
        public lessonService: LessonService,
        private scheduleService: ScheduleService) {

        const currentClassJson = this.storageService.loadStorage(CLASS_STORAGE);
        if (currentClassJson) {
            this.currentClassTask = JSON.parse(currentClassJson);
            this.currentClassTask.book = Object.assign(new Lesson(), this.currentClassTask.book);
            this.currentClassTask.lesson = Object.assign(new Lesson(), this.currentClassTask.lesson);
        }

    }

    //When selectedClass is changed then rings & students must be reloaded
    public set selectedClass(value: ClassModel) {
        this.selectedClass$.next(value);
        //Load rings of class/grade
        this.scheduleService.getRings(value.schoolId, value.gradeId).then(data => {
            this.rings = data;
        });
        //load students of the class
        this.studentsService.getStudentsOfClass(value.id).then(data => {
            //load students inot service
        });

        this.lessonService.getBooks(this.selectedClass.schoolId, this.selectedClass.gradeId).then(data => {
            //load students inot service
        });

    }
    public get selectedClass() {
        return this.selectedClass$.value;
    }


    saveClass() {
        this.storageService.saveStorage(CLASS_STORAGE, JSON.stringify(this.currentClassTask));
    }

    endClass() {
        this.currentClassTask = undefined;
        this.storageService.removeStorage(CLASS_STORAGE);
    }
}
