import { GlobalService } from 'src/app/services/global.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage {

    constructor(private router: Router, public globalService: GlobalService) { }

    startClass() {
        if (this.globalService.currentClassTask)
            this.router.navigateByUrl(`/tabs/class/0`);
        else
            this.router.navigateByUrl(`/tabs/lessons`);
    }
}
