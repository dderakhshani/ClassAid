"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TimelineComponent = void 0;
var core_1 = require("@angular/core");
var stats_serie_1 = require("src/app/models/stats-serie");
var TimelineComponent = /** @class */ (function () {
    function TimelineComponent(chartService, globalService) {
        this.chartService = chartService;
        this.globalService = globalService;
        this.AssessMeasures = stats_serie_1.AssessMeasures;
    }
    TimelineComponent.prototype.ngOnInit = function () {
        this.schedules.forEach(function (x) {
            var i = Math.floor(Math.random() * 4);
            x.lesson.avgAssess = stats_serie_1.AssessMeasures[i];
        });
    };
    TimelineComponent.prototype.getSchedule = function (ring) {
        var _this = this;
        var schedule = this.schedules.find(function (x) { return x.ringId == ring.id && x.dayNo == _this.selectedDay; });
        return schedule;
    };
    __decorate([
        core_1.Input()
    ], TimelineComponent.prototype, "schedules");
    __decorate([
        core_1.Input()
    ], TimelineComponent.prototype, "lessons");
    __decorate([
        core_1.Input()
    ], TimelineComponent.prototype, "selectedDay");
    __decorate([
        core_1.Input()
    ], TimelineComponent.prototype, "rings");
    TimelineComponent = __decorate([
        core_1.Component({
            selector: 'app-timeline',
            templateUrl: './timeline.component.html',
            styleUrls: ['./timeline.component.scss']
        })
    ], TimelineComponent);
    return TimelineComponent;
}());
exports.TimelineComponent = TimelineComponent;
