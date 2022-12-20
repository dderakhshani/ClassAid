import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-score-rating',
    templateUrl: './score-rating.component.html',
    styleUrls: ['./score-rating.component.scss'],
})
export class ScoreRatingComponent implements OnInit {
    @Input()
    maxScore: number = 10;

    @Input()
    score;

    @Output()
    scoreChange = new EventEmitter<number>()

    scores: number[] = [];

    constructor() {

    }

    ngOnInit() {
        for (let index = 0; index < this.maxScore; index++) {
            this.scores.push(index + 1)
        }
    }

    select(item: number) {
        this.score = item;
        this.scoreChange.emit(this.score);
    }

}
