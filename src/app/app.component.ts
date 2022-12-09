import { ClassService } from './api/class.service';
import { GlobalService } from 'src/app/services/global.service';
import { Component, OnInit } from '@angular/core';
import { StudentsService } from './api/students.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
    constructor(private globalService: GlobalService,
        private classService: ClassService) {

    }

    ngOnInit() {
        this.classService.getClassesByTeacherId(this.globalService.teacherId).then(data => {
            this.globalService.selectedClass = data[0];//will load students and rings automatically

        });

    }
}
