import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
    selector: 'app-expandable-section',
    templateUrl: './expandable-section.component.html',
    styleUrls: ['./expandable-section.component.scss'],
})
export class ExpandableSectionComponent implements OnInit {

    @Input()
    expandable: boolean = true;

    @Input()
    expanded = false;
    @Output()
    expandedChange = new EventEmitter<boolean>();

    constructor() { }

    ngOnInit() { }

    expandCollapse() {
        this.expanded = !this.expanded;
        this.expandedChange.emit(this.expanded);
    }

}
