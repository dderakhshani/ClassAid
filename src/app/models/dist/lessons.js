"use strict";
exports.__esModule = true;
exports.Lesson = void 0;
var environment_1 = require("src/environments/environment");
var Lesson = /** @class */ (function () {
    function Lesson() {
    }
    Lesson.prototype.getImageUrl = function () {
        return environment_1.environment.imageUrl + "/lessons_org/grade_" + this.gradeId + "/c_" + this.id + ".jpg";
    };
    Lesson.getImageUrl = function (id) {
        return environment_1.environment.imageUrl + "/lessons_org/flat/c_" + id + ".jpg";
    };
    return Lesson;
}());
exports.Lesson = Lesson;
