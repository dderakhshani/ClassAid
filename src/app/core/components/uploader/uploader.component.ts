// import { X } from '@angular/cdk/keycodes';
import { HttpErrorResponse, HttpEvent, HttpEventType, HttpProgressEvent } from '@angular/common/http';
import { outputAst } from '@angular/compiler';
import { Component, ElementRef, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UploadFileService } from 'src/app/core/services/upload-file.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-uploader',
    templateUrl: './uploader.component.html',
    styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnInit {

    @Input()
    addTitle = "افزودن تصویر";

    @Input()
    autoUpload: boolean = true;

    @Input()
    singleFile: boolean = false;


    @Output()
    isUploadingChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Input()
    fileFilters: string = "image/x-png,image/jpeg,image/gif"

    @Output()
    filesChange: EventEmitter<string[]> = new EventEmitter<string[]>();

    @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef;
    @ViewChild('cameraUpload', { static: false }) cameraUpload: ElementRef;

    isUploading: boolean = false;
    files: UploadFileData[] = [];

    constructor(private uploadFileService: UploadFileService,
        private actionSheetCtrl: ActionSheetController,) { }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        const fileUpload = this.fileUpload.nativeElement;
        fileUpload.onchange = () => {
            const file = fileUpload.files[0];
            if (!file)
                return;
            const fileData = <UploadFileData>{
                file: file,
                progressStatus: '',
                progress: 0,
                filePath: '',
                fullFilePath: '',
                extention: file.name.split(".")[1].toUpperCase(),
            }
            if (FileReader) {
                var fr = new FileReader();
                fr.onload = function () {
                    fileData.fullFilePath = fr.result;
                }
                fr.readAsDataURL(file);
            }

            this.files.push(fileData);
            if (this.autoUpload)
                this.uploadFile(fileData);
        };

        const cameraUpload = this.cameraUpload.nativeElement;
        cameraUpload.onchange = () => {
            const file = cameraUpload.files[0];
            if (!file)
                return;

            const fileData = <UploadFileData>{
                file: file,
                progressStatus: '',
                progress: 0,
                filePath: '',
                fullFilePath: '',
                extention: file.name.split(".")[1].toUpperCase(),
            }
            if (FileReader) {
                var fr = new FileReader();
                fr.onload = function () {
                    fileData.fullFilePath = fr.result;
                }
                fr.readAsDataURL(file);
            }

            this.files.push(fileData);
            if (this.autoUpload)
                this.uploadFile(fileData);
        };

    }

    async selectUploader() {
        const actionSheet = await this.actionSheetCtrl.create({
            header: 'انتخاب محل عکس',
            buttons: [
                {
                    text: 'دوربین',
                    role: 'camera',
                    icon: 'camera-outline'
                },
                {
                    text: 'گالری',
                    role: 'gallery',
                    icon: 'images-outline'
                },
            ],
        });

        actionSheet.present();

        const { role } = await actionSheet.onWillDismiss();

        if (role === 'camera')
            this.onClickCameraUpload();
        else if (role === 'gallery')
            this.onClickUpload();
    }

    onClickUpload() {
        const fileUpload = this.fileUpload.nativeElement;
        fileUpload.click();
    }

    onClickCameraUpload() {
        const uploadInput = this.cameraUpload.nativeElement;
        uploadInput.click();
    }

    uploadAll() {
        this.files.forEach(f => {
            if (f.progressStatus == '')
                this.uploadFile(f);
        })
    }

    uploadFile(data: UploadFileData) {
        let formData = new FormData();
        formData.set('file', data.file);
        this.isUploadingChange.emit(true);

        data.progressStatus = 'in-progress';
        this.uploadFileService
            .upload(formData)
            .pipe(map((event: HttpEvent<any>) => {
                switch (event.type) {
                    case HttpEventType.UploadProgress:
                        console.log(event.loaded);
                        data.progress = Math.round(
                            (event.loaded * 100) / (event.total ?? 1)
                        );
                        break;
                    case HttpEventType.Response:
                        let fileName = event.body?.url;
                        data.extention = fileName.split(".")[1].toUpperCase();
                        data.filePath = fileName;
                        data.fullFilePath = `${environment.imageUrl}` + "/" + fileName;
                        data.progressStatus = 'uploaded';


                        if (this.files.filter(x => x.progressStatus == 'in-progress').length == 0)
                            this.isUploadingChange.emit(false);

                        this.filesChange.emit(this.files.filter(x => x.filePath != undefined).map(x => x.filePath));
                        // console.log("File Uploaded" + this.extentionFile + " " + fileName);
                        return fileName;

                }
            }),
                catchError((error: HttpErrorResponse) => {
                    data.progressStatus = 'failed';
                    return of(`${data.file.name} upload failed.`);
                })
            )
            .subscribe((event: any) => {
                if (typeof event === 'object') {
                    console.log(event.body);
                }
            });
    }

    isImageFile(file: UploadFileData) {
        return ['PNG', 'JPG', 'JPEG'].includes(file.extention.toUpperCase());
    }

    removeImage(file: UploadFileData) {
        // this.depositReceipt.imageUrl = '';
        this.files.splice(this.files.indexOf(file), 1);
    }

}

interface UploadFileData {
    file: any;
    progressStatus: '' | 'in-progress' | 'uploaded' | 'failed';
    progress: number;
    filePath: string;
    fullFilePath: any;
    extention: string;
}
