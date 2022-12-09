"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.NoteComponent = void 0;
var core_1 = require("@angular/core");
var NoteComponent = /** @class */ (function () {
    function NoteComponent() {
    }
    NoteComponent.prototype.ngOnInit = function () { };
    NoteComponent.prototype.save = function () {
        if (this.student) {
            //Save to server
            this.student.notes.push({
                id: "",
                studentId: this.student.id,
                taskId: this.classTask.id,
                lessonId: this.book.id,
                subLessonId: this.lesson.id,
                notes: this.notes
            });
        }
        this.modal.dismiss();
    };
    __decorate([
        core_1.Input()
    ], NoteComponent.prototype, "modal");
    __decorate([
        core_1.Input()
    ], NoteComponent.prototype, "classTask");
    __decorate([
        core_1.Input()
    ], NoteComponent.prototype, "lesson");
    __decorate([
        core_1.Input()
    ], NoteComponent.prototype, "book");
    __decorate([
        core_1.Input()
    ], NoteComponent.prototype, "student");
    NoteComponent = __decorate([
        core_1.Component({
            selector: 'app-note',
            templateUrl: './note.component.html',
            styleUrls: ['./note.component.scss']
        })
    ], NoteComponent);
    return NoteComponent;
}());
exports.NoteComponent = NoteComponent;
