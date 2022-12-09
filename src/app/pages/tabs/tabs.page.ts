import { AlertController, NavController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ScheduleTimeModel } from 'src/app/models/schedule';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage {

    constructor(private router: Router,
        private navCtl: NavController,
        private alertController: AlertController,
        public globalService: GlobalService) { }

    startClass() {
        if (this.globalService.currentClassTask)
            // this.navCtl.navigateRoot(`/tabs/class/0`);
            this.router.navigateByUrl(`/tabs/class/0`);

    }

    startNewClass() {
        // this.navCtl.navigateRoot(`/tabs/lessons`);
        this.router.navigateByUrl(`/tabs/lessons`);
    }

    async startNextClass() {
        const todayShedules = this.globalService.todayShedules;

        const nextSchedule = todayShedules.find((x: ScheduleTimeModel) => x.session == null);
        const nextScheduleIndex = todayShedules.indexOf(nextSchedule);

        if (nextScheduleIndex > -1 && nextScheduleIndex < todayShedules.length) {

            const nextLesson = todayShedules[nextScheduleIndex].lesson;
            this.router.navigateByUrl(`/lessons/details/${nextLesson.id}/${nextSchedule.id}`);
        }
        else {
            let msg = "";
            if (todayShedules.length > 0)
                msg = "تمام کلاس های امروز به اتمام رسیده و کلاس دیگری برای شروع در برنامه کلاسی وجود ندارد";

            else msg = "کلاس بعدی یافت نشد زیرا برنامه کلاسی تعریف نشده";
            const alert = await this.alertController.create({
                header: 'هشدار',
                subHeader: 'نمی توانید کلاس بعدی را شروع نمایید',
                message: msg,
                buttons: [
                    {
                        text: 'تایید',
                        role: 'confirm'
                    }
                ],
            });

            await alert.present();
        }




    }
}
