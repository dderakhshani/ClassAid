"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.GlobalService = void 0;
var asses_param_1 = require("./../models/asses-param");
var rxjs_1 = require("rxjs");
var core_1 = require("@angular/core");
var ngx_ionic_image_viewer_1 = require("ngx-ionic-image-viewer");
var share_1 = require("@capacitor/share");
var filesystem_1 = require("@capacitor/filesystem");
var CLASS_STORAGE = "CLASSAID_CLASS";
var GlobalService = /** @class */ (function () {
    function GlobalService(storageService, studentsService, authService, assessmentService, classService, reminderService, lessonService, modalController, scheduleService) {
        this.storageService = storageService;
        this.studentsService = studentsService;
        this.authService = authService;
        this.assessmentService = assessmentService;
        this.classService = classService;
        this.reminderService = reminderService;
        this.lessonService = lessonService;
        this.modalController = modalController;
        this.scheduleService = scheduleService;
        this.ready$ = new rxjs_1.BehaviorSubject(false);
        this.selectedClass$ = new rxjs_1.BehaviorSubject(null);
        this.classSessions$ = new rxjs_1.BehaviorSubject([]);
        var user = authService.getProfile();
        if (user) {
            this.teacherId = authService.getProfile().id;
        }
        this.todayDay = (new Date().getDay() + 1) % 7;
    }
    Object.defineProperty(GlobalService.prototype, "selectedClass", {
        get: function () {
            return this.selectedClass$.value;
        },
        //When selectedClass is changed then rings & students must be reloaded
        set: function (vClass) {
            var _this = this;
            this.reminderService.getActiveClassReminders(vClass.id).then(function (x) {
            });
            //load students of the class
            //NOTE: getCallRolls will load all daysession callRollings(include all sessions) but order by time desc
            //--So last state of the attendance will be considered
            this.classService.getCallRolls(vClass.id).then(function (callRollings) {
                _this.studentsService.getStudentsOfClass(vClass.id).then(function (students) {
                    if (callRollings && callRollings.length > 0) {
                        students.forEach(function (student) {
                            //NOTE: will find last state of the students
                            var attendance = callRollings.find(function (x) { return x.studentId == student.id; });
                            //TODO: handle if not foumd
                            student.attendanceStatus = attendance === null || attendance === void 0 ? void 0 : attendance.status;
                        });
                        _this.studentsService.students$.next(students);
                    }
                });
            });
            this.assessmentService.getParameters(0, vClass.gradeId).then(function (params) {
            });
            //Notes:
            //1. First Load Lessons of the Grade Of School
            //2. Load all sessions of the Class(Selected Class)
            //      2.1 fill book,lesson fields of each session
            //      2.2 Calc and apply sessions stats of each book to lessons
            //      2.3 find CurrentSession if exist and load its reminders
            //      2.4 Emit classSessions$ subject
            //3. Then load rings of Grade Of School(Event Class if reqiured) to load schdules
            //4. Load Schedules of the Class(Selected Class) Then:
            //      4.1 set Ring(object),Lesson(object) to each schedule by ringId,lessonId provided by prev steps
            //      4.2 filter Today Schedules
            //      4.3 Fill Today Schedules sessions
            this.lessonService.getBooks(vClass.schoolId, vClass.gradeId).then(function (books) {
                //2,3. Loading Rings
                Promise.all([_this.classService.getTodaySessionsByClass(vClass.id),
                    _this.classService.getAllSessionsByClass(vClass.id),
                    _this.scheduleService.getRings(vClass.schoolId, vClass.gradeId)])
                    .then(function (_a) {
                    var today_sessions = _a[0], sessions = _a[1], rings = _a[2];
                    return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: 
                                //2.Step: 
                                return [4 /*yield*/, this.initSessionsAsync(today_sessions, sessions, books)];
                                case 1:
                                    //2.Step: 
                                    _b.sent();
                                    this.rings = rings;
                                    //4. Loading Schedules
                                    this.scheduleService.get(vClass.id).then(function (schdule) {
                                        if (schdule) {
                                            schdule.scheduleTimes.forEach(function (st) {
                                                st.ring = _this.rings.find(function (x) { return x.id == st.ringId; });
                                                //lessonService.books$ filled when getBooks called
                                                st.lesson = _this.lessonService.books$.value.find(function (x) { return x.id == st.lessonId; });
                                            });
                                            //4.2 Clone the schedules to make it non-changable
                                            _this.todayShedules = __spreadArrays(schdule.scheduleTimes.filter(function (x) { return x.dayNo == _this.todayDay; }));
                                            _this.todayShedules.forEach(function (sch) {
                                                //4.3 
                                                sch.session = today_sessions.find(function (x) { return x.scheduleTimeId == sch.id; });
                                            });
                                        }
                                        _this.selectedClass$.next(vClass);
                                        _this.ready$.next(true);
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GlobalService.prototype, "sessions", {
        get: function () {
            return this.classSessions$.value;
        },
        enumerable: false,
        configurable: true
    });
    GlobalService.prototype.initSessionsAsync = function (today_sessions, sessions2, books) {
        return __awaiter(this, void 0, Promise, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    sessions2.forEach(function (s) {
                                        s.book = books.find(function (x) { return x.id == s.lessonId; });
                                        s.lesson = _this.lessonService.allLessons$.value.find(function (x) { return x.id == s.subLessonId; });
                                    });
                                    today_sessions.forEach(function (s) {
                                        s.avgAssessMeasure = _this.findLevelByValue(s.averageAssessment);
                                        s.book = books.find(function (x) { return x.id == s.lessonId; });
                                        s.lesson = _this.lessonService.allLessons$.value.find(function (x) { return x.id == s.subLessonId; });
                                    });
                                    //2.2 Proccesing and applying stats of each lesson
                                    this.initBooks(books, sessions2);
                                    //2.3 find currentSession and its reminders
                                    this.currentSession = today_sessions.find(function (x) { return x.endTime == null; });
                                    if (!this.currentSession) return [3 /*break*/, 2];
                                    return [4 /*yield*/, this.initCurrentSessionAsync(today_sessions)];
                                case 1:
                                    _a.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    this.classSessions$.next(sessions2);
                                    _a.label = 3;
                                case 3: return [2 /*return*/, resolve(true)];
                            }
                        });
                    }); })];
            });
        });
    };
    GlobalService.prototype.initBooks = function (books, sessions) {
        var _this = this;
        books.forEach(function (b) {
            var book_sessions = sessions.filter(function (x) { return x.lessonId == b.id; });
            //b.sessions = this.sessions.filter(x => x.lessonId == b.id);
            b.sessionsCount = book_sessions.length;
            if (book_sessions.length > 0) {
                var lastLessonId_1 = book_sessions[book_sessions.length - 1].subLessonId;
                b.lastSessionLesson = _this.lessonService.allLessons$.value.find(function (x) { return x.id == lastLessonId_1; });
            }
        });
    };
    GlobalService.prototype.initCurrentSessionAsync = function (sessions) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.all([this.reminderService.getSessionReminders(this.currentSession.id),
                        this.assessmentService.getSessionAssessments(this.currentSession.id),
                        this.classService.getLessonHomeWorks(this.currentSession.lessonId)])
                        .then(function (_a) {
                        var reminders = _a[0], assessments = _a[1], homeWorks = _a[2];
                        _this.currentSession.reminders = reminders;
                        _this.currentSession.assessments = assessments.filter(function (x) { return x.level > 0; });
                        _this.currentSession.scores = assessments.filter(function (x) { return x.level == 0; }).map(function (x) { return x; });
                        _this.currentSession.homeWorks = homeWorks;
                        _this.classSessions$.next(sessions);
                    })];
            });
        });
    };
    GlobalService.prototype.startClass = function (session) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            session.classId = _this.selectedClass.id;
            _this.classService.addTask(session).then(function (result) {
                if (!result) {
                    reject(false);
                    return;
                }
                //To prevent circular reference in saving to storage(no lesson stats)
                var raw_session = __assign({}, session);
                raw_session.book = null;
                raw_session.lesson = null;
                _this.currentSession = session;
                //Updating Schdules
                if (session.scheduleTimeId)
                    _this.todayShedules.find(function (x) { return x.id == session.scheduleTimeId; }).session = session;
                //lesson filled in Class.ts(caller)
                session.book.sessionsCount += 1;
                session.book.lastSessionLesson = _this.lessonService.allLessons$.value.find(function (x) { return x.id == session.subLessonId; });
                _this.classSessions$.next(__spreadArrays(_this.classSessions$.value, [session]));
                _this.storageService.saveStorage(CLASS_STORAGE, JSON.stringify(raw_session));
                resolve(true);
            });
        });
    };
    GlobalService.prototype.endClass = function () {
        var _this = this;
        this.classService.endTask(this.currentSession.id).then(function (result) {
            _this.currentSession.endTime = new Date();
            _this.currentSession = undefined;
            var sessions = _this.classSessions$.value;
            // const currentSession = sessions[sessions.length - 1];
            // currentSession.endTime = new Date();
            _this.storageService.removeStorage(CLASS_STORAGE);
            _this.classSessions$.next(sessions);
        });
    };
    GlobalService.prototype.findLevelByValue = function (value) {
        return asses_param_1.AssessmentLevels.find(function (x) { return x.value == Math.ceil(value); });
    };
    GlobalService.prototype.cloneArray = function (array) {
        return JSON.parse(JSON.stringify(array));
    };
    GlobalService.prototype.openImageViewer = function (imageUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var modal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.modalController.create({
                            component: ngx_ionic_image_viewer_1.ViewerModalComponent,
                            componentProps: {
                                src: imageUrl
                            },
                            cssClass: 'ion-img-viewer',
                            keyboardClose: true,
                            showBackdrop: true
                        })];
                    case 1:
                        modal = _a.sent();
                        return [4 /*yield*/, modal.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    GlobalService.prototype.shareData = function (title, text, imageUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var permission, blob, fileName_1, xhr, me_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, filesystem_1.Filesystem.checkPermissions()];
                    case 1:
                        permission = _a.sent();
                        if (!(permission.publicStorage !== "granted")) return [3 /*break*/, 3];
                        console.log("permission is required");
                        return [4 /*yield*/, filesystem_1.Filesystem.requestPermissions()]; // Why this doesn't work????
                    case 2:
                        permission = _a.sent(); // Why this doesn't work????
                        if (permission.publicStorage !== "granted") {
                            return [2 /*return*/];
                        }
                        _a.label = 3;
                    case 3:
                        if (!imageUrl) return [3 /*break*/, 4];
                        console.log("Has Image");
                        blob = undefined;
                        fileName_1 = imageUrl;
                        xhr = new XMLHttpRequest();
                        xhr.open('GET', imageUrl, true);
                        xhr.responseType = 'blob';
                        me_1 = this;
                        xhr.onload = function (e) {
                            var _this = this;
                            console.log("Blob download");
                            if (this.status !== 200)
                                return;
                            console.log("Blob Success");
                            var blob = new Blob([this.response], { type: this.response.type });
                            //Conver Blob
                            var reader = me_1.getFileReader();
                            reader.onloadend = function () { return __awaiter(_this, void 0, void 0, function () {
                                var filedata, fileResult, e_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            filedata = reader.result;
                                            console.log("Blob Read");
                                            _a.label = 1;
                                        case 1:
                                            _a.trys.push([1, 5, , 6]);
                                            console.log("Writing Blob to cache");
                                            return [4 /*yield*/, filesystem_1.Filesystem.writeFile({
                                                    path: fileName_1,
                                                    data: filedata,
                                                    directory: filesystem_1.Directory.Cache,
                                                    recursive: true
                                                })];
                                        case 2:
                                            _a.sent();
                                            return [4 /*yield*/, filesystem_1.Filesystem.getUri({
                                                    directory: filesystem_1.Directory.Cache,
                                                    path: fileName_1
                                                })];
                                        case 3:
                                            fileResult = _a.sent();
                                            console.log("Reading uri: " + fileResult.uri);
                                            return [4 /*yield*/, share_1.Share.share({
                                                    title: title,
                                                    text: text,
                                                    url: fileResult.uri,
                                                    dialogTitle: 'اشتراک گزارش'
                                                })];
                                        case 4:
                                            _a.sent();
                                            return [3 /*break*/, 6];
                                        case 5:
                                            e_1 = _a.sent();
                                            console.error('Unable to write file', e_1);
                                            return [3 /*break*/, 6];
                                        case 6: return [2 /*return*/];
                                    }
                                });
                            }); };
                            reader.readAsDataURL(blob);
                        };
                        xhr.send();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, share_1.Share.share({
                            title: title,
                            text: text,
                            //url: environment.imageUrl + '/' + note.images[0],
                            dialogTitle: 'اشتراک گزارش'
                        })];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    GlobalService.prototype.getFileReader = function () {
        var fileReader = new FileReader();
        var zoneOriginalInstance = fileReader["__zone_symbol__originalInstance"];
        return zoneOriginalInstance || fileReader;
    };
    GlobalService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], GlobalService);
    return GlobalService;
}());
exports.GlobalService = GlobalService;
