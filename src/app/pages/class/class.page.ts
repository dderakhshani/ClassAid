import { StudentReminder } from './../../models/remider';
import { StudentModel } from 'src/app/models/student';
import { StudentsService } from './../../api/students.service';
import { ClassSessionModel } from './../../models/class';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonService } from 'src/app/api/lesson.service';
import { Lesson } from 'src/app/models/lessons';
import { GlobalService } from 'src/app/services/global.service';

import { ActionSheetController } from '@ionic/angular';
import { ReminderType, Score } from 'src/app/models/remider';

@Component({
    selector: 'app-class',
    templateUrl: './class.page.html',
    styleUrls: ['./class.page.scss'],
})
export class ClassPage implements OnInit {

    lesson: Lesson;
    book: Lesson;
    students: StudentModel[];
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
                    this.lesson = this.globalService.currentSession.lesson;
                    this.book = this.globalService.currentSession.book;
                }
                else {
                    this.lessonService.getLessonById(this.lessonId).then(l => {
                        this.lesson = l;
                        this.lessonService.getLessonById(this.lesson.parentId).then(b => {
                            this.book = b;
                        });
                    });
                }
                this.studentsService.getStudentsOfClass(this.globalService.selectedClass.id).then(students => {
                    this.students = [...students];
                    //Must set all reminders at once for student and display it by type
                    const scores = this.globalService.currentSession.reminders?.filter(x => x.type == ReminderType.Score).map(x => x as Score);
                    const reminders = this.globalService.currentSession.reminders?.filter(x => x.type == ReminderType.StudentReminder).map(x => x as StudentReminder);

                    this.students.forEach(s => {
                        const s_s = scores?.filter(x => x.studentId == s.id);
                        if (s_s)
                            s_s.forEach(x => {
                                s.scores.push(x);
                            });

                        const s_r = reminders?.filter(x => x.studentId == s.id);
                        if (s_r)
                            s_r.forEach(x => {
                                s.reminders.push(x);
                            });

                    })
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
        setTimeout(() => {
            this.router.navigateByUrl(`/tabs/class/assessment/${this.book.id}/${this.selectedStudent.id}`);
        });
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
