import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpNativeService } from './http-native.service';
import { HttpWebService } from './http-web.service';

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    public http: HttpNativeService | HttpWebService;

    constructor(private platform: Platform, private angularHttp: HttpWebService, private nativeHttp: HttpNativeService) {
        this.http = this.angularHttp;//this.platform.is('mobileweb') ? this.angularHttp : this.nativeHttp;
    }
}
