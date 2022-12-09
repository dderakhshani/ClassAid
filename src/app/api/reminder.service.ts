import { StudentReminder, LessonReminder } from './../models/remider';
import { Injectable } from '@angular/core';
import { ReplaySubject, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ReminderService {

    student_reminders$ = new BehaviorSubject<StudentReminder[]>([]);
    lesson_reminders$ = new BehaviorSubject<LessonReminder[]>([]);

    constructor() {

    }
}
