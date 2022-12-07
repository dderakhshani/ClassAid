import { element } from 'protractor';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-multi-input',
  templateUrl: './multi-input.component.html',
  styleUrls: ['./multi-input.component.scss'],
})
export class MultiInputComponent implements OnInit {

  values: string[] = ["", "", "", "", ""];
  @Input()
  error: boolean = false;

  @Input()
  set value(val: string) {

  }

  @Output()
  valueChange = new EventEmitter<string>();

  constructor(private _changeDetectionRef: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    //   this.inputs = new Array(parseInt(this.inputCount));
  }

  // onValueChanged() {
  //   let text = '';
  //   this.inputs.forEach(v => text += v + ' ')
  //   this.valueChange.emit(text);
  // }

  onfocus(event) {
    event.target.value = '';
    event.target.select();
  }

  keyDown(event, nextElement) {
    if (event.keyCode == 9) {
      nextElement.setFocus();
      event.preventDefault();
      return;
    }
  }

  moveFocus(event, nextElement, previousElement) {
    this.error = false;
    if (event.keyCode == 8 && previousElement) {
      previousElement.setFocus();
    } else if (event.keyCode >= 48 && event.keyCode <= 57) {
      if (nextElement) {
        nextElement.setFocus();
        this._changeDetectionRef.detectChanges();
      }
    } else {
      event.path[0].value = '';
    }
    this.valueChange.emit(this.values.join(""));
  }


}
