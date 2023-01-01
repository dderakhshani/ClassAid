import { StudentsService } from 'src/app/api/students.service';
import { AssessmentService } from 'src/app/api/assessment.service';
import { LessonService } from 'src/app/api/lesson.service';
import { GlobalService } from 'src/app/services/global.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserModel } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

    user!: UserModel;

    constructor(private router: Router,
        private authService: AuthService,
        private globalService: GlobalService,
        private lessonService: LessonService,
        private assessmentService: AssessmentService,
        private studentService: StudentsService,
        public alertController: AlertController) {
    }

    ngOnInit(): void {
        this.user = this.authService.getProfile();
    }

    onSingOut() {
        this.authService.signOut();
        this.globalService.classSessions$.next([]);
        this.globalService.callRolling = [];
        this.globalService.currentSession = undefined;
        this.globalService.selectedClass$.next(undefined);
        this.globalService.rings = [];
        this.lessonService.reset();
        this.assessmentService.reset();
        this.studentService.reset();
        this.router.navigateByUrl("/signin");
    }

    async contactAdmin() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'عدم دسترسی',
            message: 'این گزینه توسط مدیر سیستم کنترل می گردد. برای اصلاح اطلاعات مربوطه با مدیر سیستم تماس حاصل فرمایید',
            buttons: ['تایید']
        });

        await alert.present();

        const { role } = await alert.onDidDismiss();
    }

    async reportBug() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'گزارش خطا ',
            message: 'به صفحه گزارش خطا بعد از تکمیل پروژه منتقل خواهی شد',
            buttons: ['تایید']
        });

        await alert.present();

        const { role } = await alert.onDidDismiss();
    }

    async help() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'راهنمای سیستم ',
            message: 'به صفحه راهنمای سیستم بعد از تکمیل پروژه منتقل خواهی شد',
            buttons: ['تایید']
        });

        await alert.present();

        const { role } = await alert.onDidDismiss();
    }

    async support() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: ' پشتیبانی ',
            message: 'به صفحه پشتیبانی سیستم بعد از تکمیل پروژه منتقل خواهی شد',
            buttons: ['تایید']
        });

        await alert.present();

        const { role } = await alert.onDidDismiss();
    }

}
