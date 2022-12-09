"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ClassService = void 0;
var core_1 = require("@angular/core");
var ClassService = /** @class */ (function () {
    // reminders$ = new Subject<Reminder[]>();
    function ClassService(httpService) {
        this.httpService = httpService;
        // this.gradeId = globalService.selectedGradeId;
        // this.schoolId = globalService.selectedSchoolId;
    }
    ClassService.prototype.getClassesByTeacherId = function (teacherId) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.httpService.http.getDataByParam({ teacherId: teacherId }, "class/getByTeacherId").then(function (data) {
                return resolve(data);
            });
        });
    };
    ClassService.prototype.getDaySession = function (classId) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.httpService.http.getDataByParam({ classId: classId }, "class/GetDaySession").then(function (data) {
                return resolve(data);
            });
        });
    };
    ClassService.prototype.addCallRolls = function (attendances, classId) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.httpService.http.postJsonData(attendances, "class/addCallRolls/" + classId).then(function (data) {
                return resolve(data);
            });
        });
    };
    ClassService.prototype.getCallRolls = function (classId) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.httpService.http.getDataByParam({ classId: classId }, "class/GetCallRolls").then(function (data) {
                return resolve(data);
            });
        });
    };
    ClassService.prototype.addTask = function (session) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.httpService.http.getDataByParam(session, "class/AddTask").then(function (data) {
                return resolve(data);
            });
        });
    };
    ClassService.prototype.endTask = function (taskId) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.httpService.http.getDataByParam({ taskId: taskId }, "class/EndTask").then(function (data) {
                return resolve(data);
            });
        });
    };
    ClassService.prototype.getSessionsByClass = function (classId) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.httpService.http.getDataByParam({ classId: classId }, "class/GetSessionsByClass").then(function (data) {
                return resolve(data);
            });
        });
    };
    ClassService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], ClassService);
    return ClassService;
}());
exports.ClassService = ClassService;
