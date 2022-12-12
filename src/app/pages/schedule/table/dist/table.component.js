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
exports.__esModule = true;
exports.TableComponent = void 0;
var core_1 = require("@angular/core");
var TableComponent = /** @class */ (function () {
    function TableComponent(pickerCtrl, actionSheetCtrl, lessonService) {
        this.pickerCtrl = pickerCtrl;
        this.actionSheetCtrl = actionSheetCtrl;
        this.lessonService = lessonService;
        this.schedulesChange = new core_1.EventEmitter();
    }
    TableComponent.prototype.ngOnInit = function () {
    };
    TableComponent.prototype.openLessonPicker = function (ring, dayNo) {
        return __awaiter(this, void 0, void 0, function () {
            var picker;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pickerCtrl.create({
                            columns: [
                                {
                                    name: 'lessons',
                                    options: this.lessons.map(function (x) { return ({ text: x.name, value: x.id }); })
                                },
                            ],
                            mode: 'ios',
                            buttons: [
                                {
                                    text: 'لغو',
                                    role: 'cancel'
                                },
                                {
                                    text: 'انتخاب',
                                    handler: function (value) {
                                        var lesson = _this.lessons.find(function (x) { return x.id == value.lessons.value; });
                                        _this.schedules.push({ ringId: ring.id, ring: ring, dayNo: dayNo, lessonId: lesson.id, lesson: lesson });
                                        _this.schedulesChange.emit(_this.schedules);
                                    }
                                },
                            ]
                        })];
                    case 1:
                        picker = _a.sent();
                        return [4 /*yield*/, picker.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TableComponent.prototype.openMenu = function (schedule) {
        return __awaiter(this, void 0, void 0, function () {
            var actionSheet, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.actionSheetCtrl.create({
                            header: 'انتخاب عملیات',
                            buttons: [
                                {
                                    text: 'حذف',
                                    role: 'destructive',
                                    icon: 'trash-outline',
                                    data: {
                                        action: 'delete'
                                    }
                                },
                                {
                                    text: 'ویرایش',
                                    icon: 'create-outline',
                                    data: {
                                        action: 'edit'
                                    }
                                },
                                {
                                    text: 'لغو',
                                    role: 'cancel',
                                    data: {
                                        action: 'cancel'
                                    }
                                },
                            ]
                        })];
                    case 1:
                        actionSheet = _a.sent();
                        return [4 /*yield*/, actionSheet.present()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, actionSheet.onDidDismiss()];
                    case 3:
                        result = _a.sent();
                        if (result.data.action == "delete") {
                            this.schedules.splice(this.schedules.indexOf(schedule), 1);
                        }
                        else if (result.data.action == "edit") {
                            this.schedules.splice(this.schedules.indexOf(schedule), 1);
                            this.openLessonPicker(schedule.ring, schedule.dayNo);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    TableComponent.prototype.getSchedule = function (ring, day) {
        return this.schedules.find(function (x) { return x.ringId == ring.id && x.dayNo == day.no; });
    };
    __decorate([
        core_1.Input()
    ], TableComponent.prototype, "scheduleMode");
    __decorate([
        core_1.Input()
    ], TableComponent.prototype, "schedules");
    __decorate([
        core_1.Output()
    ], TableComponent.prototype, "schedulesChange");
    __decorate([
        core_1.Input()
    ], TableComponent.prototype, "lessons");
    __decorate([
        core_1.Input()
    ], TableComponent.prototype, "rings");
    __decorate([
        core_1.Input()
    ], TableComponent.prototype, "days");
    TableComponent = __decorate([
        core_1.Component({
            selector: 'app-table',
            templateUrl: './table.component.html',
            styleUrls: ['./table.component.scss']
        })
    ], TableComponent);
    return TableComponent;
}());
exports.TableComponent = TableComponent;
