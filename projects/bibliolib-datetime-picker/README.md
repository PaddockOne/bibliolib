# Bibliolib-Datetime-picker

Simple datetime picker for angular apps.

## Installation

```bash
npm install bibliolib-datetime-picker
```

## Usage

Import the module in your app module:

```typescript
import { BibliolibDatetimePickerModule } from "bibliolib-datetime-picker";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BibliolibDatetimePickerModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

Use the component in your app:

```html
<bibliolib-datetime-picker [startHours]="startHour" [endHours]="endHours" [stepHours]="stepHours" [currentDate]="dateSignal" (dateChange)="onValueChange($event)" />
```

```typescript
import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  // Start hour of the hourpicker
  startHour: number = 8;
  // End hour of the hourpicker
  endHours: number = 20;
  // Step hour of the hourpicker
  stepHours: number = 30;
  // Signal to patch the datepicker value from the parent component
  dateSignal: WritableSignal<DateTime> = signal<DateTime>({ date: "", hour: "" });

  constructor() {}

  onValueChange(value: DateTime) {
    console.log(value);
  }

  patchDateTimePickerValue() {
    this.dateSignal.set({ date: "2021-01-01", hour: "12:00" });
  }
}
```

## License

MIT

## Author

[github: @reyvaxreecded](https://github.com/reyvaxreecded)
