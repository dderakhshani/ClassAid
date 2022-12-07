import { StudentModel } from 'src/app/models/student';
import { StudentsService } from './../../api/students.service';
import { ClassTaskModel } from './../../models/class';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonService } from 'src/app/api/lesson.service';
import { Lesson } from 'src/app/models/lessons';
import { GlobalService } from 'src/app/services/global.service';
import { v4 as uuidv4 } from 'uuid';
import { ActionSheetController } from '@ionic/angular';

@Component({
    selector: 'app-class',
    templateUrl: './class.page.html',
    styleUrls: ['./class.page.scss'],
})
export class ClassPage implements OnInit {

    lesson: Lesson;
    book: Lesson;
    selectedStudent: StudentModel;
    isModalOpen = false;
    presentingElement = null;

    constructor(public lessonService: LessonService,
        public studentsService: StudentsService,
        public globalService: GlobalService,
        private route: ActivatedRoute,
        private actionSheetCtrl: ActionSheetController,
        private router: Router) {

        const lessonId = Number(this.route.snapshot.paramMap.get('lessonId'));

        if (lessonId == 0) {
            this.lesson = globalService.currentClassTask.lesson;
            this.book = globalService.currentClassTask.book;
        }
        else {
            lessonService.getLessonById(lessonId).then(l => {
                this.lesson = l;
                lessonService.getLessonById(this.lesson.parentId).then(b => {
                    this.book = b;

                    globalService.currentClassTask = <ClassTaskModel>{
                        id: uuidv4(),
                        lesson: this.lesson,
                        book: this.book,
                        lessonId: this.book.id,
                        subLessonId: this.lesson.id,
                        startTime: new Date()
                    };
                    globalService.saveClass();
                });
            });


        }

    }

    ngOnInit() {
        this.presentingElement = document.querySelector('.ion-page');
        //tobe sure students will load from server if not already loaded
        this.studentsService.getStudentsOfClass(this.globalService.selectedClass.id).then(data => {

        });
    }

    async onStudentAction(student: StudentModel) {
        this.isModalOpen = true;
        this.selectedStudent = student;

    }

    endClass() {
        this.globalService.endClass();
        this.router.navigateByUrl("tabs/home");
    }

    getColor(student: StudentModel) {
        return !student.present ? 'medium' : ''
    }

    onAssess() {
        this.isModalOpen = false;
        setTimeout(x => {
            this.router.navigateByUrl(`/tabs/class/assessment/${this.selectedStudent.id}`)
        });
    }

}
