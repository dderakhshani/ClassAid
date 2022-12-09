import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { HTTP, HTTPResponse } from '@awesome-cordova-plugins/http/ngx';

@Injectable({
    providedIn: 'root'
})
export class HttpNativeService {


    constructor(private http: HTTP,
        private toastController: ToastController) { }

    getData<T>(action: string): Promise<T> {
        return new Promise(resolve => {
            this.http.get(`${environment.apiUrl}/api/${action}`, {}, {}).then(result => {
                return resolve(result.data);
            }).catch(error => {
                this.handleError(error);
            });
        });
    }
    getDataByParam<T>(param: any, action: string): Promise<T> {
        return new Promise(resolve => {
            this.http.get(`${environment.apiUrl}/api/${action}`, param, {}).then(result => {
                return resolve(result.data);
            }).catch(error => {
                this.handleError(error);
            });
        });
    }
    postJsonData<T>(data: any, action: string): Promise<T> {
        return new Promise(resolve => {
            this.http.post(`${environment.apiUrl}/api/${action}`, data, {}).then(result => {
                return resolve(result.data);
            }).catch(error => {
                this.handleError(error);
            });
        });
    }

    private handleError(error: any) {
        alert(error);
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong.
        let errorMessage: string = "ارتباط با سرور میسر نیست";
        if (error.status == 401)
            errorMessage = "دسترسی غیر مجاز. دوبار وارد شوید";
        else if (error.status != 0)
            errorMessage = `وجود خطا در  ارتباط با سرور، کد خطا: ${error.status} `

        this.presentToast(errorMessage);

        console.error("Native Http Call Error: " + JSON.stringify(error));


    }

    async presentToast(message: string) {
        const toast = await this.toastController.create({
            message: message,
            duration: 2000
        });
        toast.present();
    }

}
