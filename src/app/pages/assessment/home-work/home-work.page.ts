import { ScoreAssessmentModel } from './../../../models/asses-param';
import { Note } from './../../../models/remider';
import { ClassService } from 'src/app/api/class.service';
import { StudentModel } from '../../../models/student';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { AssessmentLevels, AssessmentModel } from 'src/app/models/asses-param';
import { combineLatest } from 'rxjs';
import { LessonService } from 'src/app/api/lesson.service';
import { StudentsService } from 'src/app/api/students.service';
import { GlobalService } from 'src/app/services/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Lesson } from 'src/app/models/lessons';
import { ReminderType } from 'src/app/models/remider';
import { HomeWorkAssessmentModel, HomeWorkModel } from 'src/app/models/home-work';
import { environment } from 'src/environments/environment';
import { v4 as uuidv4 } from 'uuid';
import { AssessmentService } from 'src/app/api/assessment.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { ViewerModalComponent } from 'ngx-ionic-image-viewer';

@Component({
    selector: 'app-home-work',
    templateUrl: './home-work.page.html',
    styleUrls: ['./home-work.page.scss'],
})
export class HomeWorkPage implements OnInit {
    homeWorkModel = HomeWorkModel;
    imageUrl = environment.imageUrl;

    expanded = false;
    isModalOpen = false;

    selectedStudent: HomeWorkAssessmentModel;
    assess: HomeWorkAssessmentModel;
    studentHomeWorkAssess: HomeWorkAssessmentModel[];
    assessLevels = [...AssessmentLevels.filter(x => x.value != 0)];

    homeWork: HomeWorkModel;

    homeWorkIdParam: string;

    constructor(public classService: ClassService,
        public studentsService: StudentsService,
        private assessmentService: AssessmentService,
        public globalService: GlobalService,
        private route: ActivatedRoute,
        private location: Location,
        public modalController: ModalController,
        private loadingCtrl: LoadingController,
        private router: Router) {
        this.homeWorkIdParam = this.route.snapshot.paramMap.get('homeWorkId');
    }

    ngOnInit() {
    }

    ionViewWillEnter() {

        combineLatest(this.globalService.classSessions$, this.globalService.ready$).subscribe(([sessions, ready]) => {
            if (this.globalService.currentSession && ready) {
                this.classService.getHomeWorkById(this.homeWorkIdParam).then(h => {
                    this.homeWork = h;
                    this.studentsService.getStudentsOfClass(this.globalService.selectedClass.id).then(students => {
                        this.studentHomeWorkAssess = students.map(s => Object.assign(new HomeWorkAssessmentModel(), { student: s }));
                        this.studentHomeWorkAssess.forEach(s => {
                            const oldAssess = this.homeWork.assessments.find(x => x.studentId == s.student.id);
                            if (oldAssess) {
                                s.id = oldAssess.id;//Very critical
                                s.level = oldAssess.level;
                                s.progerssStep = oldAssess.progerssStep;
                                s.progerssFlag = 1;
                                s.note = oldAssess.note;
                            }
                        })
                    });
                })

            }

        })

    }

    back() {
        this.location.back();
    }

    async openViewer(imageUrl: string) {
        const modal = await this.modalController.create({
            component: ViewerModalComponent,
            componentProps: {
                src: imageUrl
            },
            cssClass: 'ion-img-viewer',
            keyboardClose: true,
            showBackdrop: true
        });

        return await modal.present();
    }

    onAssess(student: HomeWorkAssessmentModel) {
        this.selectedStudent = student;
        this.assess = Object.assign(new HomeWorkAssessmentModel(), student);

        this.isModalOpen = true;
    }

    addAssess() {
        this.selectedStudent.level = this.assess.level;
        this.selectedStudent.progerssStep = this.assess.progerssStep;
        this.selectedStudent.note = this.assess.note;
        this.isModalOpen = false;
    }

    async save(close: boolean) {
        let assessments = [];
        this.studentHomeWorkAssess.forEach(s => {
            if (s.level > 0) {
                const assessModel = <ScoreAssessmentModel>{
                    id: s.id ? s.id : uuidv4(),
                    eduParameterId: 0,//means home work, there is homework parameter in the database which will be filled by server
                    eduParameterTitle: "",
                    lessonId: this.homeWork.lessonId,
                    subLessonId: this.homeWork.subLessonId,
                    level: s.level,
                    studentId: s.student.id,
                    teacherId: this.globalService.teacherId,
                    progerssFlag: s.progerssFlag,
                    progerssStep: s.progerssStep,
                    time: new Date(),
                    regTimePersian: "",
                    taskId: this.homeWork.creatorTaskId,//maybe without current Session
                    homeWorkId: this.homeWork.id,
                    note: s.note
                };

                assessments.push(assessModel);
            }

        });
        const loading = await this.loadingCtrl.create();
        loading.present();
        if (close) {
            this.homeWork.assessments = assessments;
            this.assessmentService.closeHomeWorkAssessment(this.homeWork).then(result => {
                loading.dismiss();
                this.location.back();
            },
                err => {
                    loading.dismiss();
                });
        }

        else
            this.assessmentService.add(assessments).then(result => {
                loading.dismiss();
                this.location.back();
            },
                err => {
                    loading.dismiss();
                });
    }


}
