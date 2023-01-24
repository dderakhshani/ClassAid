import { environment } from './../../../../environments/environment';
import { LessonNotes, Note, ReminderType, StudentNotes } from './../../../models/remider';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ClassSessionModel } from 'src/app/models/class';
import { Lesson } from 'src/app/models/lessons';
import { StudentModel } from 'src/app/models/student';
import { v4 as uuidv4 } from 'uuid';
import { ReminderService } from 'src/app/api/reminder.service';
import { GlobalService } from 'src/app/services/global.service';

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

    @Output()
    saveResult = new EventEmitter<Note>();

    isSaving = false;

    notes: string;
    tags: string[] = [];
    tag = "";
    isReport: string = 'true';
    uploadFiles: string[];

    colors = ["primary", "danger", "success", "secondary", "warning", "tertiary", "medium"];

    constructor(private reminderService: ReminderService, public globalService: GlobalService) { }

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
            this.isSaving = true;
            const note = <StudentNotes>{
                id: uuidv4(),
                studentId: this.student.id,
                taskId: this.classTask.id,
                lessonId: this.book.id,
                subLessonId: this.lesson.id,
                note: this.notes,
                tags: this.tags,
                isReport: this.isReport == "true",
                images: this.uploadFiles,
                type: ReminderType.StudentNotes
            }
            this.reminderService.addReminder(note).then(x => {
                this.classTask.reminders = this.classTask.reminders ?? [];
                this.student.notes = this.student.notes ?? [];
                this.student.notes.push(note);
                this.classTask.reminders.push(note);
                this.isSaving = false;
                this.saveResult.emit(note);
            }, err => {
                // loading.dismiss();
                this.isSaving = false;
            });

        }
        else {
            const note = <LessonNotes>{
                id: uuidv4(),
                taskId: this.classTask.id,
                lessonId: this.book.id,
                subLessonId: this.lesson.id,
                note: this.notes,
                type: ReminderType.Notes,
                tags: this.tags,
                isReport: this.isReport == "true",
                images: this.uploadFiles
            }
            this.reminderService.addReminder(note).then(x => {
                this.classTask.reminders = this.classTask.reminders ?? [];
                this.classTask.reminders.push(note);
                this.isSaving = false;
                this.saveResult.emit(note);
            }, err => {
                // loading.dismiss();
                this.isSaving = false;
            });
        }
        this.modal.dismiss();
    }

}
