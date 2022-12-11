import { StudentReminder, LessonReminder, Reminder } from './../models/remider';
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
            this.httpService.http.postJsonData<boolean>(reminder, "class/AddReminder").then(data => {
                return resolve(data);
            });
        });
    }

    getSessionReminders(sessionId: string): Promise<Reminder[]> {
        return new Promise(resolve => {
            this.httpService.http.getDataByParam<Reminder[]>({ sessionId: sessionId }, "class/GetSessionReminders").then(data => {
                return resolve(data);
            });
        });
    }
}
