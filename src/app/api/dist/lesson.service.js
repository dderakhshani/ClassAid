"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.LessonService = void 0;
var lessons_1 = require("src/app/models/lessons");
var core_1 = require("@angular/core");
var environment_1 = require("src/environments/environment");
var rxjs_1 = require("rxjs");
var LessonService = /** @class */ (function () {
    function LessonService(httpService) {
        this.httpService = httpService;
        this.allLessons$ = new rxjs_1.BehaviorSubject([]);
        this.books$ = new rxjs_1.BehaviorSubject([]);
    }
    //TODO: Get Lessons by SchoolId not load all lessons
    LessonService.prototype.getBooks = function (schoolId, gradeId) {
        var _this = this;
        return new Promise(function (resolve) {
            if (_this.books$.value.length > 0)
                return resolve(_this.books$.value.filter(function (x) { return x.gradeId == gradeId && x.schoolId == schoolId; }));
            else
                _this.httpService.http.getData("lesson/getAll").then(function (r) {
                    var allLessons = r.map(function (x) { return Object.assign(new lessons_1.Lesson(), x); });
                    var books = allLessons.filter(function (x) { return x.parentId == null && x.schoolId; });
                    _this.allLessons$.next(allLessons);
                    books.forEach(function (b) {
                        b.subLessonCount = allLessons.filter(function (x) { return x.parentId == b.id; }).length;
                    });
                    _this.books$.next(books);
                    return resolve(books.filter(function (x) { return x.gradeId == gradeId && x.schoolId == schoolId; }));
                });
        });
    };
    LessonService.prototype.getLessonsByParentId = function (parentId) {
        var _this = this;
        return new Promise(function (resolve) {
            return resolve(_this.allLessons$.value.filter(function (x) { return x.parentId == parentId; }));
        });
    };
    //Must load once all grade/School lesson
    LessonService.prototype.getLessonById = function (lessonId) {
        var _this = this;
        if (this.allLessons$.value.length > 0)
            return new Promise(function (resolve) {
                var lesson = _this.allLessons$.value.find(function (x) { return x.id == lessonId; });
                return resolve(lesson);
            });
    };
    // getLessonImage(lesson: Lesson) {
    //     return `${environment.imageUrl}/lessons_org/grade_${lesson.GradeId}/c_${lesson.Id}.jpg`;
    // }
    LessonService.prototype.getLessonImageById = function (lessonId) {
        var lesson = this.allLessons$.value.find(function (x) { return x.id == lessonId; });
        return environment_1.environment.imageUrl + "/lessons_org/grade_" + lesson.gradeId + "/c_" + lesson.id + ".jpg";
    };
    LessonService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], LessonService);
    return LessonService;
}());
exports.LessonService = LessonService;
