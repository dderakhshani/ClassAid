"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.ClassPage = void 0;
var core_1 = require("@angular/core");
var remider_1 = require("src/app/models/remider");
var attendance_model_1 = require("src/app/models/attendance-model");
var rxjs_1 = require("rxjs");
var ClassPage = /** @class */ (function () {
    function ClassPage(lessonService, studentsService, globalService, route, alertController, actionSheetCtrl, router) {
        this.lessonService = lessonService;
        this.studentsService = studentsService;
        this.globalService = globalService;
        this.route = route;
        this.alertController = alertController;
        this.actionSheetCtrl = actionSheetCtrl;
        this.router = router;
        this.AttendanceStatus = attendance_model_1.AttendanceStatus;
        this.isStudentActionsModalOpen = false;
        this.isScoreModalOpen = false;
        this.isReminderModalOpen = false;
        this.isNotesModalOpen = false;
        this.presentingElement = null;
        this.lessonId = Number(this.route.snapshot.paramMap.get('lessonId'));
        if (this.route.snapshot.paramMap.has('scheduleId'))
            this.scheduleId = Number(this.route.snapshot.paramMap.get('scheduleId'));
    }
    ClassPage.prototype.ngOnInit = function () {
        var _this = this;
        this.presentingElement = document.querySelector('.ion-page');
        //tobe sure students will load from server if not already loaded
        rxjs_1.combineLatest(this.globalService.classSessions$, this.globalService.ready$).subscribe(function (_a) {
            var sessions = _a[0], ready = _a[1];
            if (_this.globalService.currentSession && ready) {
                if (_this.lessonId == 0) {
                    _this.lesson = _this.globalService.currentSession.lesson;
                    _this.book = _this.globalService.currentSession.book;
                }
                else {
                    _this.lessonService.getLessonById(_this.lessonId).then(function (l) {
                        _this.lesson = l;
                        _this.lessonService.getLessonById(_this.lesson.parentId).then(function (b) {
                            _this.book = b;
                        });
                    });
                }
                _this.studentsService.getStudentsOfClass(_this.globalService.selectedClass.id).then(function (students) {
                    _this.students = __spreadArrays(students);
                    //Must set all reminders at once for student and display it by type
                    _this.initStudents();
                });
            }
        });
    };
    ClassPage.prototype.initStudents = function () {
        var _a, _b, _c;
        var scores = (_a = this.globalService.currentSession.reminders) === null || _a === void 0 ? void 0 : _a.filter(function (x) { return x.type == remider_1.ReminderType.Score; }).map(function (x) { return x; });
        var reminders = (_b = this.globalService.currentSession.reminders) === null || _b === void 0 ? void 0 : _b.filter(function (x) { return x.type == remider_1.ReminderType.StudentReminder; }).map(function (x) { return x; });
        var notes = (_c = this.globalService.currentSession.reminders) === null || _c === void 0 ? void 0 : _c.filter(function (x) { return x.type == remider_1.ReminderType.StudentNotes; }).map(function (x) { return x; });
        var assesments = this.globalService.currentSession.assessments;
        this.students.forEach(function (s) {
            var s_s = scores === null || scores === void 0 ? void 0 : scores.filter(function (x) { return x.studentId == s.id; });
            if (s_s)
                s_s.forEach(function (x) {
                    s.scores.push(x);
                });
            var s_r = reminders === null || reminders === void 0 ? void 0 : reminders.filter(function (x) { return x.studentId == s.id; });
            if (s_r)
                s_r.forEach(function (x) {
                    s.reminders.push(x);
                });
            var s_n = notes === null || notes === void 0 ? void 0 : notes.filter(function (x) { return x.studentId == s.id; });
            if (s_n)
                s_n.forEach(function (x) {
                    s.notes.push(x);
                });
            s.hasAssessment = (assesments === null || assesments === void 0 ? void 0 : assesments.filter(function (x) { return x.studentId == s.id; }).length) > 0;
        });
    };
    ClassPage.prototype.attendance = function () {
        this.router.navigateByUrl("/tabs/home/attendance/" + this.globalService.currentSession.id);
    };
    ClassPage.prototype.onStudentAction = function (student) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (student.attendanceStatus == attendance_model_1.AttendanceStatus.Absent)
                    return [2 /*return*/];
                this.isStudentActionsModalOpen = true;
                this.selectedStudent = student;
                return [2 /*return*/];
            });
        });
    };
    ClassPage.prototype.endClass = function () {
        return __awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: 'اتمام کلاس',
                            message: 'آیا از اتمام کلاس اطمینان داری؟',
                            buttons: [
                                {
                                    text: 'بله',
                                    role: 'confirm',
                                    handler: function () {
                                        _this.globalService.endClass();
                                        _this.router.navigateByUrl("tabs/home");
                                    }
                                },
                                {
                                    text: 'خیر',
                                    role: 'cancel'
                                },
                            ]
                        })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ClassPage.prototype.getColor = function (student) {
        return student.attendanceStatus == attendance_model_1.AttendanceStatus.Absent ? 'medium' : '';
    };
    ClassPage.prototype.remindersCount = function () {
        var _a, _b;
        return (_b = (_a = this.globalService.currentSession) === null || _a === void 0 ? void 0 : _a.reminders) === null || _b === void 0 ? void 0 : _b.filter(function (x) { return x.type == remider_1.ReminderType.Reminder; }).length;
    };
    ClassPage.prototype.notesCount = function () {
        var _a, _b;
        return (_b = (_a = this.globalService.currentSession) === null || _a === void 0 ? void 0 : _a.reminders) === null || _b === void 0 ? void 0 : _b.filter(function (x) { return x.type == remider_1.ReminderType.Notes; }).length;
    };
    ClassPage.prototype.homeWorksCount = function () {
        var _a, _b;
        return (_b = (_a = this.globalService.currentSession) === null || _a === void 0 ? void 0 : _a.reminders) === null || _b === void 0 ? void 0 : _b.filter(function (x) { return x.type == remider_1.ReminderType.Reminder; }).length;
    };
    ClassPage.prototype.onAssess = function () {
        var _this = this;
        this.isStudentActionsModalOpen = false;
        setTimeout(function () {
            _this.router.navigateByUrl("/tabs/class/assessment/" + _this.lesson.id + "/" + _this.selectedStudent.id + "/" + _this.globalService.currentSession.id);
        });
    };
    ClassPage.prototype.onStudentReminder = function () {
        this.modalReminders = this.selectedStudent.reminders;
        this.isStudentActionsModalOpen = false;
        this.isReminderModalOpen = true;
    };
    ClassPage.prototype.onStudentNotes = function () {
        this.modalNotes = this.selectedStudent.notes;
        this.isStudentActionsModalOpen = false;
        this.isNotesModalOpen = true;
    };
    ClassPage.prototype.onScore = function () {
        this.isStudentActionsModalOpen = false;
        this.isScoreModalOpen = true;
    };
    ClassPage.prototype.onReminder = function () {
        var _a;
        this.selectedStudent = null;
        this.modalReminders = (_a = this.globalService.currentSession.reminders) === null || _a === void 0 ? void 0 : _a.filter(function (x) { return x.type == remider_1.ReminderType.Reminder; });
        this.isStudentActionsModalOpen = false;
        this.isReminderModalOpen = true;
    };
    ClassPage.prototype.onNotes = function () {
        var _a;
        this.selectedStudent = null;
        this.modalNotes = (_a = this.globalService.currentSession.reminders) === null || _a === void 0 ? void 0 : _a.filter(function (x) { return x.type == remider_1.ReminderType.Notes; });
        this.isStudentActionsModalOpen = false;
        this.isNotesModalOpen = true;
    };
    ClassPage = __decorate([
        core_1.Component({
            selector: 'app-class',
            templateUrl: './class.page.html',
            styleUrls: ['./class.page.scss']
        })
    ], ClassPage);
    return ClassPage;
}());
exports.ClassPage = ClassPage;
