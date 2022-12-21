"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ScoreComponent = void 0;
var core_1 = require("@angular/core");
var uuid_1 = require("uuid");
var environment_1 = require("src/environments/environment");
var ScoreComponent = /** @class */ (function () {
    function ScoreComponent(assessmentService) {
        this.assessmentService = assessmentService;
        this.imageUrl = environment_1.environment.imageUrl;
        this.expanded = false;
    }
    ScoreComponent.prototype.ngOnInit = function () {
        //TODO: maybe filter by lessonId==undefined
        this.assesmentParamters = this.assessmentService.assesmentParamters.filter(function (x) { return x.rank == 2; });
    };
    ScoreComponent.prototype.saveScore = function () {
        var _this = this;
        if (this.posNeg) {
            var score_1 = {
                id: uuid_1.v4(),
                studentId: this.student.id,
                lessonId: this.book.id,
                subLessonId: this.lesson.id,
                eduParameterId: this.selectedeParameter.id,
                eduParameterTitle: this.selectedeParameter.title,
                taskId: this.session.id,
                note: this.notes,
                level: 0,
                progerssFlag: this.posNeg == "postive" ? 1 : -1,
                progerssStep: this.rate
            };
            this.assessmentService.addScore(score_1).then(function (x) {
                var _a;
                //TODO: check prev assessment
                _this.session.scores = (_a = _this.session.scores) !== null && _a !== void 0 ? _a : [];
                _this.session.scores.push(score_1);
                _this.student.scores.push(score_1);
                _this.modal.dismiss();
            });
        }
        else {
        }
    };
    ScoreComponent.prototype.remove = function (score) {
    };
    ScoreComponent.prototype.getScale = function (index) {
        if (this.expanded)
            return 1;
        else
            return 1 - ((this.prevScores.length - 1) - index) * 0.08;
    };
    __decorate([
        core_1.Input()
    ], ScoreComponent.prototype, "modal");
    __decorate([
        core_1.Input()
    ], ScoreComponent.prototype, "session");
    __decorate([
        core_1.Input()
    ], ScoreComponent.prototype, "lesson");
    __decorate([
        core_1.Input()
    ], ScoreComponent.prototype, "book");
    __decorate([
        core_1.Input()
    ], ScoreComponent.prototype, "student");
    __decorate([
        core_1.Input()
    ], ScoreComponent.prototype, "prevScores");
    ScoreComponent = __decorate([
        core_1.Component({
            selector: 'app-score',
            templateUrl: './score.component.html',
            styleUrls: ['./score.component.scss']
        })
    ], ScoreComponent);
    return ScoreComponent;
}());
exports.ScoreComponent = ScoreComponent;
