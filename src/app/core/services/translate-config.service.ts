import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class TranslateConfigService {

    currentLang: any;
    currentDir: 'ltr';

    constructor(private translate: TranslateService) {
        this.currentLang = localStorage.getItem('lang');
    }

    initLanguage() {
        if (this.currentLang) {
            this.translate.setDefaultLang(this.currentLang);
        } else {
            localStorage.setItem('lang', this.translate.getBrowserLang()!);
            this.currentLang = this.translate.getBrowserLang();
            this.translate.setDefaultLang(this.currentLang);
        }
        return this.currentLang;
    }

    setLanguage(setLang: string) {
        this.translate.use(setLang);
        localStorage.setItem('lang', setLang);
    }

    getCurrentLang() {
        return localStorage.getItem('lang');
    }

    getDateName() {
        const d = new Date();
        const options: Intl.DateTimeFormatOptions = <Intl.DateTimeFormatOptions>{ dateStyle: 'full' };
        const lang = this.getCurrentLang();
        if (lang == "fa")
            return new Intl.DateTimeFormat('fa-IR', options).format(d);
        else
            return new Intl.DateTimeFormat('en-US', options).format(d);
    }

}