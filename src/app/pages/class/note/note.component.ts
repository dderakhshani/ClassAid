import { StudentNotes } from './../../../models/remider';
import { Component, Input, OnInit } from '@angular/core';
import { ClassSessionModel } from 'src/app/models/class';
import { Lesson } from 'src/app/models/lessons';
import { StudentModel } from 'src/app/models/student';

@Component({
    selector: 'app-note',
    templateUrl: './note.component.html',
    styleUrls: ['./note.component.scss'],
})
export class NoteComponent implements OnInit {

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

    constructor() { }

    ngOnInit() { }

    save() {
        if (this.student) {
            //Save to server
            this.student.notes.push(<StudentNotes>{
                id: "",
                studentId: this.student.id,
                taskId: this.classTask.id,
                lessonId: this.book.id,
                subLessonId: this.lesson.id,
                notes: this.notes
            });
        }
        this.modal.dismiss();
    }

}
