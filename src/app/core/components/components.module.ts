import { ScoreRatingComponent } from './score-rating/score-rating.component';
import { ExpandableSectionComponent } from './expandable-section/expandable-section.component';
import { UploaderComponent } from './uploader/uploader.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
    ],
    declarations: [UploaderComponent, ExpandableSectionComponent, ScoreRatingComponent],
    exports: [UploaderComponent, ExpandableSectionComponent, ScoreRatingComponent]
})
export class ComponentsModule { }
