"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.ReminderComponent = void 0;
var core_1 = require("@angular/core");
var ReminderComponent = /** @class */ (function () {
    function ReminderComponent(reminderService) {
        this.reminderService = reminderService;
        this.dateType = "next";
        this.days = [
            { no: 1, dayName: 'شنبه', symbol: 'شنبه', date: new Date() },
            { no: 2, dayName: 'یکشنبه', symbol: 'یک', date: new Date() },
            { no: 3, dayName: 'دوشنبه', symbol: 'دو', date: new Date() },
            { no: 4, dayName: 'سه شنبه', symbol: 'سه', date: new Date() },
            { no: 5, dayName: 'چهارشنبه', symbol: 'چهار', date: new Date() },
            { no: 6, dayName: 'پنجشنبه', symbol: 'پنج', date: new Date() },
        ];
    }
    ReminderComponent.prototype.ngOnInit = function () { };
    ReminderComponent.prototype.save = function () {
        if (this.student) {
            //TODO: Save to server
            var reminder = {
                id: "",
                studentId: this.student.id,
                lessonId: this.book.id,
                subLessonId: this.lesson.id,
                taskId: this.classTask.id,
                remindTime: "",
                notes: this.notes
            };
            this.student.reminders.push();
            this.reminderService.student_reminders$.next(__spreadArrays(this.reminderService.student_reminders$.value, [reminder]));
        }
        else {
            var reminder = {
                id: "",
                lessonId: this.book.id,
                subLessonId: this.lesson.id,
                taskId: this.classTask.id,
                remindTime: "",
                notes: this.notes
            };
            this.reminderService.lesson_reminders$.next(__spreadArrays(this.reminderService.student_reminders$.value, [reminder]));
        }
        this.modal.dismiss();
    };
    __decorate([
        core_1.Input()
    ], ReminderComponent.prototype, "modal");
    __decorate([
        core_1.Input()
    ], ReminderComponent.prototype, "classTask");
    __decorate([
        core_1.Input()
    ], ReminderComponent.prototype, "lesson");
    __decorate([
        core_1.Input()
    ], ReminderComponent.prototype, "book");
    __decorate([
        core_1.Input()
    ], ReminderComponent.prototype, "student");
    ReminderComponent = __decorate([
        core_1.Component({
            selector: 'app-reminder',
            templateUrl: './reminder.component.html',
            styleUrls: ['./reminder.component.scss']
        })
    ], ReminderComponent);
    return ReminderComponent;
}());
exports.ReminderComponent = ReminderComponent;
