import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class HttpWebService {


    constructor(private http: HttpClient,
        public toastController: ToastController) { }

    getData<T>(action: string): Promise<T> {
        return new Promise(resolve => {
            this.http.get<T>(`${environment.apiUrl}/api/${action}`)
                .pipe(
                    catchError(this.handleError.bind(this))
                ).subscribe(result => {
                    return resolve(result);
                });
        });

    }


    getDataByParam<T>(param: any, action: string): Promise<T> {
        return new Promise(resolve => {
            this.http.get<T>(`${environment.apiUrl}/api/${action}`, {
                params: param
            }).pipe(
                catchError(this.handleError.bind(this))
            ).subscribe(result => {
                return resolve(result);
            });
        });


    }

    postJsonData<T>(data: any, action: string): Promise<T> {
        const headers = { 'Content-Type': 'application/json' }
        return new Promise(resolve => {
            this.http.post<T>(`${environment.apiUrl}/api/${action}`, JSON.stringify(data), { headers })
                .pipe(
                    catchError(this.handleError.bind(this))
                ).subscribe(result => {
                    return resolve(result);
                });
        });
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('HttpWebService: An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            let errorMessage: string = "ارتباط با سرور میسر نیست";
            if (error.status == 401)
                errorMessage = "دسترسی غیر مجاز. دوبار وارد شوید";
            else if (error.status != 0)
                errorMessage = `وجود خطا در  ارتباط با سرور، کد خطا: ${error.status} `

            this.presentToast(errorMessage);

            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error?.error}`);
        }
        // Return an observable with a user-facing error message.
        return throwError(
            'Something bad happened; please try again later.');
    }

    async presentToast(message: string) {
        const toast = await this.toastController.create({
            message: message,
            duration: 2000
        });
        toast.present();
    }
}
