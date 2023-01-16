import { Component, OnInit, Input } from '@angular/core';
import { LessonNotes } from 'src/app/models/remider';
import { GlobalService } from 'src/app/services/global.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-story-item',
    templateUrl: './story-item.component.html',
    styleUrls: ['./story-item.component.scss'],
})
export class StoryItemComponent implements OnInit {
    imageUrl = environment.imageUrl + '/';
    colors = ["primary", "danger", "success", "secondary", "warning", "tertiary", "medium"];

    @Input()
    note: LessonNotes;

    constructor(public globalService: GlobalService) { }

    ngOnInit() { }

    async share_notes(note: LessonNotes) {
        let title = note.isReport ? 'گزارش ' : 'یادداشت ';
        title += note.book.name;

        if (note.images) {
            this.globalService.shareData(title, note.note, environment.imageUrl + '/' + note.images[0]);
        }
        else
            this.globalService.shareData(title, note.note);

    }
}
