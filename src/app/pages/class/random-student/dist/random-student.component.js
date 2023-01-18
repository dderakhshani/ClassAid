"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.RandomStudentComponent = void 0;
var core_1 = require("@angular/core");
var attendance_model_1 = require("src/app/models/attendance-model");
var student_1 = require("src/app/models/student");
var RandomStudentComponent = /** @class */ (function () {
    function RandomStudentComponent() {
        this.selectedStudents = [];
        this.selectAbsent = true;
        this.selectOnlyNew = false;
        this.counter = 0;
    }
    RandomStudentComponent.prototype.ngOnInit = function () {
        this.selectRandom();
    };
    RandomStudentComponent.prototype.selectRandom = function () {
        var _this = this;
        this.counter = 0;
        if (this.selectOnlyNew == false)
            this.selectedStudents = [];
        var looper = setInterval(function (x) {
            if (_this.counter > 5) {
                clearInterval(looper);
                _this.selectedStudents.push(_this.randomStudent);
                return;
            }
            _this.counter++;
            var students = _this.students.filter(function (x) {
                return (x.attendanceStatus != attendance_model_1.AttendanceStatus.Absent || _this.selectAbsent == true) &&
                    (!_this.selectedStudents.includes(x) || _this.selectOnlyNew == false);
            });
            if (students.length == 0) {
                _this.randomStudent = new student_1.StudentModel();
                _this.randomStudent.fullName = "تمام دانش آموزان انتخاب شده اند";
                return;
            }
            var rnd = Math.floor(Math.random() * students.length);
            _this.randomStudent = students[rnd];
        }, 200);
    };
    __decorate([
        core_1.Input()
    ], RandomStudentComponent.prototype, "modal");
    __decorate([
        core_1.Input()
    ], RandomStudentComponent.prototype, "students");
    RandomStudentComponent = __decorate([
        core_1.Component({
            selector: 'app-random-student',
            templateUrl: './random-student.component.html',
            styleUrls: ['./random-student.component.scss']
        })
    ], RandomStudentComponent);
    return RandomStudentComponent;
}());
exports.RandomStudentComponent = RandomStudentComponent;
