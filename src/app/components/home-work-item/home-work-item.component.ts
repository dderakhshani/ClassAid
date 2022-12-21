import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HomeWorkModel } from 'src/app/models/home-work';
import { environment } from 'src/environments/environment';
import { ViewerModalComponent } from 'ngx-ionic-image-viewer';

@Component({
    selector: 'app-home-work-item',
    templateUrl: './home-work-item.component.html',
    styleUrls: ['./home-work-item.component.scss'],
})
export class HomeWorkItemComponent implements OnInit {

    homeWork = HomeWorkModel;
    imageUrl = environment.imageUrl;

    @Input()
    item: HomeWorkModel;

    @Input()
    expanded: boolean = false;

    @Input()
    readonly: boolean = false;

    constructor(public modalController: ModalController,) { }

    ngOnInit() { }

    remove(item: HomeWorkModel) {

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
}
