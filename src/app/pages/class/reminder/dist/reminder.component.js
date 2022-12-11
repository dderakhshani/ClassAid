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
var day_1 = require("./../../../models/day");
var remider_1 = require("./../../../models/remider");
var core_1 = require("@angular/core");
var uuid_1 = require("uuid");
var ReminderComponent = /** @class */ (function () {
    function ReminderComponent(reminderService) {
        this.reminderService = reminderService;
        this.dateType = "next";
        this.nextDays = [];
        var d = new Date();
        for (var i = 1; i < 15; i++) {
            var date = new Date();
            date.setDate(date.getDate() + i);
            var dateDay = new Intl.DateTimeFormat('en-US-u-ca-persian', { day: 'numeric' }).format(date);
            var dayName = day_1.Days[(date.getDay() + 1) % 7].symbol;
            this.nextDays.push({ dayNo: parseInt(dateDay), dayName: dayName, date: date });
        }
    }
    ReminderComponent.prototype.ngOnInit = function () {
    };
    ReminderComponent.prototype.save = function () {
        var _this = this;
        if (this.student) {
            var remindTime = new Date();
            if (this.dateType == 'tommorow')
                remindTime.setDate(remindTime.getDate() + 1);
            else if (this.dateType == 'exact-date')
                remindTime = this.selectedDay;
            else {
                //find next schedule of the lesson;
            }
            var reminder_1 = {
                id: uuid_1.v4(),
                studentId: this.student.id,
                lessonId: this.book.id,
                subLessonId: this.lesson.id,
                taskId: this.classTask.id,
                remindTime: remindTime,
                note: this.notes,
                type: remider_1.ReminderType.StudentReminder
            };
            this.reminderService.addReminder(reminder_1).then(function (x) {
                _this.student.reminders.push(reminder_1);
                _this.reminderService.student_reminders$.next(__spreadArrays(_this.reminderService.student_reminders$.value, [reminder_1]));
            });
        }
        else {
            var reminder_2 = {
                id: uuid_1.v4(),
                lessonId: this.book.id,
                subLessonId: this.lesson.id,
                taskId: this.classTask.id,
                remindTime: new Date(),
                note: this.notes,
                type: remider_1.ReminderType.Reminder
            };
            this.reminderService.addReminder(reminder_2).then(function (x) {
                _this.classTask.reminders.push(reminder_2);
                _this.reminderService.lesson_reminders$.next(__spreadArrays(_this.reminderService.student_reminders$.value, [reminder_2]));
            });
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
