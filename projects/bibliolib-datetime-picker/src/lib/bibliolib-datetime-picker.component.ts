import { Component, EventEmitter, Input, Output, WritableSignal, effect, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BibliolibDatetimePickerService } from './bibliolib-datetime-picker.service';

export type DateTime = {
  date: string;
  hour: string;
}

@Component({
  selector: 'bibliolib-datetime-picker',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [BibliolibDatetimePickerService],
  template: `
    <section class="input-wrapper">
        <input class="datepickerClass" type="date" onfocus="this.showPicker()" [formControl]="dateCtrl">
        <select class="hourpickerClass" [formControl]="hourCtrl">
        @for(hour of hourList; track hour) {
          <option [value]="hour">{{hour}}</option>
        }
        </select>
    </section>
  `,
  styles: [
    `
    .input-wrapper {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      gap: 1em;
      flex-wrap: nowrap;
    }
    `
  ]
})
export class BibliolibDatetimePickerComponent {
  /** 
   * @optional
   * specify the start hour of the hourpicker
   * default: 0
   * @type {number}
   */
  @Input() startHours: number = 0;
  /**
   * @optional
   * specify the end hour of the hourpicker
   * default: 23
   * @type {number}
  */
  @Input() endHours: number = 23;
  /**
   * @optional
   * specify the step hour of the hourpicker
   * default: 60
   * @type {number}
  */
  @Input() stepHours: number = 60;
  /**
   * @required
   * get the date and hour selected on change
   * @type {WritableSignal<DateTime>}
   * @memberof BibliolibDatetimePickerComponent
  */
  @Input() currentDate: WritableSignal<DateTime> = signal<DateTime>({date: '', hour: ''});
  /**
   * @required
   * get the date and hour selected on change
   * @type {EventEmitter<DateTime>}
   * @memberof BibliolibDatetimePickerComponent
  */
  @Output() dateChange: EventEmitter<DateTime> = new EventEmitter<DateTime>();


  dateCtrl: FormControl<string> = new FormControl<string>('', { nonNullable: true });
  hourCtrl: FormControl<string> = new FormControl<string>('', { nonNullable: true });

  hourList: string[] = [];
  constructor(private dateTimeService: BibliolibDatetimePickerService) {
    effect(() => {
      this.dateCtrl.setValue(this.currentDate().date, { emitEvent: false });
      this.dateCtrl.updateValueAndValidity({ emitEvent: false });
      this.hourCtrl.setValue(this.currentDate().hour, { emitEvent: false });
      this.hourCtrl.updateValueAndValidity({ emitEvent: false});
    });  
   }

  ngOnInit(): void {
    this.hourList = this.dateTimeService.getHourList(this.startHours, this.endHours, this.stepHours);
    this.dateCtrl.valueChanges.subscribe((value: string) => {
      this.dateChange.emit({date: value, hour: this.hourCtrl.value});
    });
    this.hourCtrl.valueChanges.subscribe((value: string) => {
      this.dateChange.emit({date: this.dateCtrl.value, hour: value});
    });
  }

}


