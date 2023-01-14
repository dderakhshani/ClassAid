"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SelectStudentComponent = void 0;
var core_1 = require("@angular/core");
var attendance_model_1 = require("src/app/models/attendance-model");
var student_1 = require("src/app/models/student");
var SelectStudentComponent = /** @class */ (function () {
    function SelectStudentComponent(studentsService, globalService) {
        this.studentsService = studentsService;
        this.globalService = globalService;
        this.AttendanceStatus = attendance_model_1.AttendanceStatus;
        this.source = 'both';
        this.sourceSelected = 'single';
        this.viewMode = 'grid';
        this.showConfirmButton = true;
        this.selectedChange = new core_1.EventEmitter();
        this.disabledStudentIds = [];
    }
    SelectStudentComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.globalService.ready$.subscribe(function (ready) {
            if (ready) {
                _this.studentsService.getStudentsOfClass(_this.globalService.selectedClass.id).then(function (data) {
                    //Disconnecting student from originals
                    _this.students = data.map(function (x) { return Object.assign(new student_1.StudentModel(), x); });
                    if (_this.selectedStudents)
                        _this.selectedStudents.forEach(function (ss) {
                            var s = _this.students.find(function (x) { return x.id == ss.id; });
                            s.isSelected = true;
                        });
                });
            }
        });
    };
    SelectStudentComponent.prototype.onStudentAction = function (student) {
        student.isSelected = !student.isSelected;
    };
    SelectStudentComponent.prototype.select = function () {
        var selected = this.students.filter(function (x) { return x.isSelected; });
        this.selectedChange.emit(selected);
        if (this.modal)
            this.modal.dismiss();
    };
    __decorate([
        core_1.Input()
    ], SelectStudentComponent.prototype, "modal");
    __decorate([
        core_1.Input()
    ], SelectStudentComponent.prototype, "source");
    __decorate([
        core_1.Input()
    ], SelectStudentComponent.prototype, "viewMode");
    __decorate([
        core_1.Input()
    ], SelectStudentComponent.prototype, "showConfirmButton");
    __decorate([
        core_1.Output()
    ], SelectStudentComponent.prototype, "selectedChange");
    __decorate([
        core_1.Input()
    ], SelectStudentComponent.prototype, "selectedStudents");
    __decorate([
        core_1.Input()
    ], SelectStudentComponent.prototype, "disabledStudentIds");
    SelectStudentComponent = __decorate([
        core_1.Component({
            selector: 'app-select-student',
            templateUrl: './select-student.component.html',
            styleUrls: ['./select-student.component.scss']
        })
    ], SelectStudentComponent);
    return SelectStudentComponent;
}());
exports.SelectStudentComponent = SelectStudentComponent;
