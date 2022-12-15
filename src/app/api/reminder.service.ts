import { StudentReminder, LessonReminder, Reminder, ReminderType } from './../models/remider';
import { Injectable } from '@angular/core';
import { ReplaySubject, BehaviorSubject } from 'rxjs';
import { HttpService } from '../core/services/http.service';

@Injectable({
    providedIn: 'root'
})
export class ReminderService {

    student_reminders$ = new BehaviorSubject<StudentReminder[]>([]);
    lesson_reminders$ = new BehaviorSubject<LessonReminder[]>([]);

    constructor(private httpService: HttpService) {

    }

    addReminder(reminder: Reminder): Promise<boolean> {
        return new Promise(resolve => {
            this.httpService.http.postJsonData<boolean>(reminder, "session/AddReminder").then(data => {
                return resolve(data);
            });
        });
    }

    getSessionReminders(sessionId: string): Promise<Reminder[]> {
        return new Promise(resolve => {
            this.httpService.http.getDataByParam<Reminder[]>({ sessionId: sessionId }, "session/GetSessionReminders").then(data => {
                return resolve(data);
            });
        });
    }

    getActiveClassReminders(classId: number): Promise<Reminder[]> {
        return new Promise(resolve => {
            this.httpService.http.getDataByParam<Reminder[]>({ classId: classId }, "class/GetActiveClassReminders").then(data => {
                const lesson_reminders = data.filter(x => x.type == ReminderType.Reminder).map(x => (x as LessonReminder));
                const student_reminders = data.filter(x => x.type == ReminderType.StudentReminder).map(x => (x as StudentReminder));
                this.lesson_reminders$.next(lesson_reminders);
                this.student_reminders$.next(student_reminders);
                return resolve(data);
            });
        });
    }


}
