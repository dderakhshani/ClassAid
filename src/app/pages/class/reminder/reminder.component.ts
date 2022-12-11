import { Days } from './../../../models/day';
import { ReminderService } from './../../../api/reminder.service';
import { ClassSessionModel } from './../../../models/class';
import { Lesson } from './../../../models/lessons';
import { StudentReminder, LessonReminder, ReminderType } from './../../../models/remider';
import { StudentModel } from 'src/app/models/student';
import { Component, Input, OnInit } from '@angular/core';
import { DateDay } from 'src/app/models/day';
import { v4 as uuidv4 } from 'uuid';

@Component({
    selector: 'app-reminder',
    templateUrl: './reminder.component.html',
    styleUrls: ['./reminder.component.scss'],
})
export class ReminderComponent implements OnInit {



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

    dateType: "next" | 'tommorow' | "exact-date" = "next";
    nextDays: { dayNo: number, dayName: string, date: Date }[] = [];
    selectedDay: any;

    notes: string;

    constructor(private reminderService: ReminderService) {
        const d = new Date();
        for (let i = 1; i < 15; i++) {
            var date = new Date();
            date.setDate(date.getDate() + i);
            const dateDay = new Intl.DateTimeFormat('en-US-u-ca-persian', { day: 'numeric' }).format(date);

            const dayName = Days[(date.getDay() + 1) % 7].symbol;

            this.nextDays.push({ dayNo: parseInt(dateDay), dayName: dayName, date: date });
        }

    }

    ngOnInit() {

    }

    save() {
        if (this.student) {

            let remindTime = new Date();
            if (this.dateType == 'tommorow')
                remindTime.setDate(remindTime.getDate() + 1);
            else if (this.dateType == 'exact-date')
                remindTime = this.selectedDay;
            else {
                //find next schedule of the lesson;
            }

            const reminder = <StudentReminder>{
                id: uuidv4(),
                studentId: this.student.id,
                lessonId: this.book.id,
                subLessonId: this.lesson.id,
                taskId: this.classTask.id,
                remindTime: remindTime,
                note: this.notes,
                type: ReminderType.StudentReminder
            };
            this.reminderService.addReminder(reminder).then(x => {
                this.student.reminders.push(reminder);
                this.reminderService.student_reminders$.next([...this.reminderService.student_reminders$.value, reminder]);
            });

        }
        else {
            const reminder = <LessonReminder>{
                id: uuidv4(),
                lessonId: this.book.id,
                subLessonId: this.lesson.id,
                taskId: this.classTask.id,
                remindTime: new Date(),
                note: this.notes,
                type: ReminderType.Reminder
            };
            this.reminderService.addReminder(reminder).then(x => {
                this.classTask.reminders.push(reminder);
                this.reminderService.lesson_reminders$.next([...this.reminderService.student_reminders$.value, reminder]);
            });

        }
        this.modal.dismiss();
    }

}
