import { NgModule } from '@angular/core';
import { BibliolibDatetimePickerComponent } from './bibliolib-datetime-picker.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BibliolibDatetimePickerService } from './bibliolib-datetime-picker.service';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    BibliolibDatetimePickerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    BibliolibDatetimePickerService
  ],
  exports: [
    BibliolibDatetimePickerComponent
  ]
})
export class BibliolibDatetimePickerModule { }
