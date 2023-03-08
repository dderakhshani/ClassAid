import { AlertController, NavController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ScheduleTimeModel } from 'src/app/models/schedule';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage {
    current_tab = "home"; // Set this as you default page name
    language: any;

    setCurrentTab(ev: any) {
        this.current_tab = ev.tab;
    }
    constructor(private router: Router,
        private navCtl: NavController,
        private alertController: AlertController,
        public globalService: GlobalService,
        private translateConfigService: TranslateConfigService,
        private translate: TranslateService) {
        this.translateConfigService.initLanguage();
        this.language = this.translateConfigService.getCurrentLang();
    }

    startClass() {
        if (this.globalService.currentSession)
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
