import { StudentModel } from 'src/app/models/student';
import { StudentsService } from './../../api/students.service';
import { ClassSessionModel } from './../../models/class';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonService } from 'src/app/api/lesson.service';
import { Lesson } from 'src/app/models/lessons';
import { GlobalService } from 'src/app/services/global.service';

import { ActionSheetController } from '@ionic/angular';
import { Score } from 'src/app/models/remider';

@Component({
    selector: 'app-class',
    templateUrl: './class.page.html',
    styleUrls: ['./class.page.scss'],
})
export class ClassPage implements OnInit {

    lesson: Lesson;
    book: Lesson;
    selectedStudent?: StudentModel;
    lessonId: number;
    scheduleId?: number;

    isStudentActionsModalOpen = false;
    isScoreModalOpen = false;
    isReminderModalOpen = false;
    isNotesModalOpen = false;

    presentingElement = null;

    constructor(public lessonService: LessonService,
        public studentsService: StudentsService,
        public globalService: GlobalService,
        private route: ActivatedRoute,
        private actionSheetCtrl: ActionSheetController,
        private router: Router) {

        this.lessonId = Number(this.route.snapshot.paramMap.get('lessonId'));
        if (this.route.snapshot.paramMap.has('scheduleId'))
            this.scheduleId = Number(this.route.snapshot.paramMap.get('scheduleId'))



    }

    ngOnInit() {
        this.presentingElement = document.querySelector('.ion-page');
        //tobe sure students will load from server if not already loaded
        this.globalService.ready$.subscribe(ready => {
            if (ready) {
                if (this.lessonId == 0) {
                    this.lesson = this.globalService.currentClassTask.lesson;
                    this.book = this.globalService.currentClassTask.book;
                }
                else {
                    this.lessonService.getLessonById(this.lessonId).then(l => {
                        this.lesson = l;
                        this.lessonService.getLessonById(this.lesson.parentId).then(b => {
                            this.book = b;
                        });
                    });
                }
                this.studentsService.getStudentsOfClass(this.globalService.selectedClass.id).then(data => {

                });
            }

        })

    }

    async onStudentAction(student: StudentModel) {
        if (!student.present)
            return;
        this.isStudentActionsModalOpen = true;
        this.selectedStudent = student;

    }

    endClass() {
        //TODO: Promise base then navigate
        this.globalService.endClass();
        this.router.navigateByUrl("tabs/home");
    }

    getColor(student: StudentModel) {
        return !student.present ? 'medium' : ''
    }

    onAssess() {
        this.isStudentActionsModalOpen = false;
        this.router.navigateByUrl(`/tabs/class/assessment/${this.selectedStudent.id}`);
    }

    onStudentReminder() {
        this.isStudentActionsModalOpen = false;
        this.isReminderModalOpen = true;

    }

    onStudentNotes() {
        this.isStudentActionsModalOpen = false;
        this.isNotesModalOpen = true;
    }

    onScore() {
        this.isStudentActionsModalOpen = false;
        this.isScoreModalOpen = true;
    }

    saveScore() {
        //Save to server
        this.selectedStudent.scores.push(<Score>{
            id: "",
            studentId: this.selectedStudent.id,
            lessonId: this.book.id,
            subLessonId: this.lesson.id,
            taskId: this.globalService.currentClassTask.id,
            positiveNegetive: true,
            notes: ""
        });
        this.isScoreModalOpen = false;
    }

    onReminder() {
        this.selectedStudent = null;
        this.isStudentActionsModalOpen = false;
        this.isReminderModalOpen = true;
    }

    onNotes() {
        this.selectedStudent = null;
        this.isStudentActionsModalOpen = false;
        this.isNotesModalOpen = true;
    }

}
