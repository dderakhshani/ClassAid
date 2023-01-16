import { Days } from './../../../models/day';
import { ReminderService } from './../../../api/reminder.service';
import { ClassSessionModel } from './../../../models/class';
import { Lesson } from './../../../models/lessons';
import { StudentReminder, LessonReminder, ReminderType, Reminder } from './../../../models/remider';
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

    expanded = false;
    @Input()
    prevReminders: Reminder[];

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

    isSaving = false;

    dateType: "next" | 'tommorow' | "exact-date" = "next";
    nextDays: { dayNo: number, dayName: string, date: Date }[] = [];
    selectedDay: any;
    isReport: string = 'true';
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

    remove(reminder: Reminder) {

    }

    getScale(index: number) {
        if (this.expanded)
            return 1;
        else
            return 1 - ((this.prevReminders.length - 1) - index) * 0.05;
    }


    save() {
        this.isSaving = true;
        if (this.student) {

            const reminder = <StudentReminder>{
                id: uuidv4(),
                studentId: this.student.id,
                lessonId: this.book.id,
                subLessonId: this.lesson.id,
                taskId: this.classTask.id,
                remindTime: this.getReminderTime(),
                note: this.notes,
                isReport: this.isReport == 'true',
                type: ReminderType.StudentReminder,
                studentFullName: this.student.fullName,//Helper
            };
            this.reminderService.addReminder(reminder).then(x => {
                this.student.reminders = this.student.reminders ?? [];
                this.student.reminders.push(reminder);
                this.reminderService.student_reminders$.next([...this.reminderService.student_reminders$.value, reminder]);
                this.isSaving = false;
            }, err => {
                // loading.dismiss();
                this.isSaving = false;
            });

        }
        else {
            const reminder = <LessonReminder>{
                id: uuidv4(),
                lessonId: this.book.id,
                subLessonId: this.lesson.id,
                taskId: this.classTask.id,
                remindTime: this.getReminderTime(),
                note: this.notes,
                isReport: this.isReport == 'true',
                type: ReminderType.Reminder,
                lessonName: this.lesson.name
            };
            this.reminderService.addReminder(reminder).then(x => {
                this.classTask.reminders = this.classTask.reminders ?? [];
                this.classTask.reminders.push(reminder);
                this.reminderService.lesson_reminders$.next([...this.reminderService.lesson_reminders$.value, reminder]);
                this.isSaving = false;
            }, err => {
                // loading.dismiss();
                this.isSaving = false;
            });

        }
        this.modal.dismiss();
    }

    getReminderTime(): Date {
        if (this.dateType == 'exact-date')
            return this.selectedDay.date
        else if (this.dateType == 'tommorow') {
            let d = new Date();
            d.setDate(d.getDate() + 1);
            return d;
        }
        else
            //TODO: Find next lesson time
            return new Date()

    }
}


