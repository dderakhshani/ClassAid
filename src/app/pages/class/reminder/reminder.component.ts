import { ReminderService } from './../../../api/reminder.service';
import { ClassSessionModel } from './../../../models/class';
import { Lesson } from './../../../models/lessons';
import { StudentReminder, LessonReminder } from './../../../models/remider';
import { StudentModel } from 'src/app/models/student';
import { Component, Input, OnInit } from '@angular/core';
import { DateDay } from 'src/app/models/day';

@Component({
    selector: 'app-reminder',
    templateUrl: './reminder.component.html',
    styleUrls: ['./reminder.component.scss'],
})
export class ReminderComponent implements OnInit {

    dateType: string = "next";

    @Input()
    modal: any;

    @Input()
    classTask: ClassSessionModel;

    @Input()
    lesson: Lesson;

    @Input()
    book: Lesson;

    @Input()
    student?: StudentModel;



    days: DateDay[] = [
        <DateDay>{ no: 1, dayName: 'شنبه', symbol: 'شنبه', date: new Date() },
        <DateDay>{ no: 2, dayName: 'یکشنبه', symbol: 'یک', date: new Date() },
        <DateDay>{ no: 3, dayName: 'دوشنبه', symbol: 'دو', date: new Date() },
        <DateDay>{ no: 4, dayName: 'سه شنبه', symbol: 'سه', date: new Date() },
        <DateDay>{ no: 5, dayName: 'چهارشنبه', symbol: 'چهار', date: new Date() },
        <DateDay>{ no: 6, dayName: 'پنجشنبه', symbol: 'پنج', date: new Date() },
    ];
    selectedDay: DateDay;

    notes: string;

    constructor(private reminderService: ReminderService) { }

    ngOnInit() { }

    save() {
        if (this.student) {

            //TODO: Save to server
            const reminder = <StudentReminder>{
                id: "",
                studentId: this.student.id,
                lessonId: this.book.id,
                subLessonId: this.lesson.id,
                taskId: this.classTask.id,
                remindTime: "",
                notes: this.notes
            };
            this.student.reminders.push(reminder);
            this.reminderService.student_reminders$.next([...this.reminderService.student_reminders$.value, reminder]);
        }
        else {
            const reminder = <LessonReminder>{
                id: "",
                lessonId: this.book.id,
                subLessonId: this.lesson.id,
                taskId: this.classTask.id,
                remindTime: "",
                notes: this.notes
            };
            this.reminderService.lesson_reminders$.next([...this.reminderService.student_reminders$.value, reminder]);
        }
        this.modal.dismiss();
    }

}
