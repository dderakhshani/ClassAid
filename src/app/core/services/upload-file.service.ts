import { AuthService } from './auth.service';
/* eslint-disable @typescript-eslint/type-annotation-spacing */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UploadFileService {
    SERVER_URL: string = `${environment.apiUrl}/api/Upload`;
    //  SERVER_URL_AVATAR : string = `${environment.apiUrl}/File/UploadAvatar`;
    constructor(private httpClient: HttpClient, private authService: AuthService) { }

    public upload(formData: FormData) {
        let headers = new HttpHeaders();
        const token = this.authService.getProfile().token;

        headers = headers.append('Authorization', `Bearer ${token}`)
        return this.httpClient.post<any>(this.SERVER_URL, formData, {
            reportProgress: true,
            headers: headers,
            observe: 'events'
        });
    }

}

