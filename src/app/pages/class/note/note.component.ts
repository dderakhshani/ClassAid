import { environment } from './../../../../environments/environment';
import { LessonNotes, Note, ReminderType, StudentNotes } from './../../../models/remider';
import { Component, Input, OnInit } from '@angular/core';
import { ClassSessionModel } from 'src/app/models/class';
import { Lesson } from 'src/app/models/lessons';
import { StudentModel } from 'src/app/models/student';
import { v4 as uuidv4 } from 'uuid';
import { ReminderService } from 'src/app/api/reminder.service';

@Component({
    selector: 'app-note',
    templateUrl: './note.component.html',
    styleUrls: ['./note.component.scss'],
})
export class NoteComponent implements OnInit {
    imageUrl = environment.imageUrl + '/'
    expanded = false;
    @Input()
    prevNotes: Note[];

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

    notes: string;
    tags: string[] = [];
    tag = "";
    isReport: string = 'true';
    uploadFiles: string[];

    colors = ["primary", "danger", "success", "secondary", "warning", "tertiary", "medium"];

    constructor(private reminderService: ReminderService) { }

    ngOnInit() { }

    loaded() {
        console.log('image loaded');
    }

    remove(note: Note) {

    }

    getScale(index: number) {
        if (this.expanded)
            return 1;
        else
            return 1 - ((this.prevNotes.length - 1) - index) * 0.05;
    }

    addTag() {
        if (this.tag != '') {
            this.tags.push(this.tag);
            this.tag = "";
        }
    }

    removeTag(index: number) {
        this.tags.splice(index, 1);
    }

    save() {
        if (this.student) {
            const reminder = <StudentNotes>{
                id: uuidv4(),
                studentId: this.student.id,
                taskId: this.classTask.id,
                lessonId: this.book.id,
                subLessonId: this.lesson.id,
                note: this.notes,
                tags: this.tags,
                images: this.uploadFiles,
                type: ReminderType.StudentNotes
            }
            this.reminderService.addReminder(reminder).then(x => {
                this.classTask.reminders = this.classTask.reminders ?? [];
                this.student.notes = this.student.notes ?? [];
                this.student.notes.push(reminder);
                this.classTask.reminders.push(reminder);
            });

        }
        else {
            const reminder = <LessonNotes>{
                id: uuidv4(),
                taskId: this.classTask.id,
                lessonId: this.book.id,
                subLessonId: this.lesson.id,
                note: this.notes,
                type: ReminderType.Notes,
                tags: this.tags,
                images: this.uploadFiles
            }
            this.reminderService.addReminder(reminder).then(x => {
                this.classTask.reminders = this.classTask.reminders ?? [];
                this.classTask.reminders.push(reminder);
            });
        }
        this.modal.dismiss();
    }

}
