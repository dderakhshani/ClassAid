import { ScoreAssessmentModel } from './../../../models/asses-param';
import { ReminderService } from './../../../api/reminder.service';
import { Component, Input, OnInit } from '@angular/core';
import { ClassSessionModel } from 'src/app/models/class';
import { Lesson } from 'src/app/models/lessons';
import { ReminderType } from 'src/app/models/remider';
import { StudentModel } from 'src/app/models/student';
import { v4 as uuidv4 } from 'uuid';
import { AssessmentService } from 'src/app/api/assessment.service';
import { AssessParamterModel } from 'src/app/models/asses-param';
import { Days } from 'src/app/models/day';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-score',
    templateUrl: './score.component.html',
    styleUrls: ['./score.component.scss'],
})
export class ScoreComponent implements OnInit {
    imageUrl = environment.imageUrl;

    expanded = false;

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

    @Input()
    prevScores: ScoreAssessmentModel[];


    posNeg: 'positive' | 'negative' = 'positive';
    notes: string;
    rate: number;
    selectedeParameter: AssessParamterModel;
    // param: AssessParamModel;

    assesmentParamters: AssessParamterModel[];

    constructor(private assessmentService: AssessmentService) {

    }

    ngOnInit() {
        //TODO: maybe filter by lessonId==undefined
        this.assesmentParamters = this.assessmentService.assesmentParamters.filter(x => x.rank == 2)
    }

    saveScore() {
        if (this.posNeg) {
            const score = <ScoreAssessmentModel>{
                id: uuidv4(),
                studentId: this.student.id,
                lessonId: this.book.id,
                subLessonId: this.lesson.id,
                eduParameterId: this.selectedeParameter.id,
                eduParameterTitle: this.selectedeParameter.title,
                taskId: this.session.id,
                note: this.notes,
                level: 0,//this is only mark,Server will always set this to 0 for Score, 
                progerssFlag: this.posNeg == "positive" ? 1 : -1,
                progerssStep: this.rate
            }
            this.assessmentService.addScore(score).then(x => {
                //TODO: check prev assessment
                this.session.scores = this.session.scores ?? [];
                this.session.scores.push(score);

                this.student.scores.push(score);
                this.modal.dismiss();
            })

        }
        else {

        }

    }

    remove(score: ScoreAssessmentModel) {

    }

    getScale(index: number) {
        if (this.expanded)
            return 1;
        else
            return 1 - ((this.prevScores.length - 1) - index) * 0.08;
    }

}
