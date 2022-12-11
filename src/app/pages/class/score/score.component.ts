import { ReminderService } from './../../../api/reminder.service';
import { Component, Input, OnInit } from '@angular/core';
import { ClassSessionModel } from 'src/app/models/class';
import { Lesson } from 'src/app/models/lessons';
import { ReminderType, Score } from 'src/app/models/remider';
import { StudentModel } from 'src/app/models/student';
import { v4 as uuidv4 } from 'uuid';

@Component({
    selector: 'app-score',
    templateUrl: './score.component.html',
    styleUrls: ['./score.component.scss'],
})
export class ScoreComponent implements OnInit {


    @Input()
    modal: any;

    @Input()
    session: ClassSessionModel;

    @Input()
    lesson: Lesson;

    @Input()
    book: Lesson;

    @Input()
    student?: StudentModel;

    posNeg: string;
    notes: string;

    constructor(private reminderService: ReminderService) { }

    ngOnInit() { }

    saveScore() {
        if (this.posNeg) {
            const score = <Score>{
                id: uuidv4(),
                studentId: this.student.id,
                lessonId: this.book.id,
                subLessonId: this.lesson.id,
                taskId: this.session.id,
                positiveNegetive: this.posNeg == "postive",
                note: this.notes,
                type: ReminderType.Score
            }
            this.reminderService.addReminder(score).then(x => {
                this.session.reminders.push(score);
                this.student.scores.push(score);
                this.modal.dismiss();
            })

        }
        else {

        }

    }
}
