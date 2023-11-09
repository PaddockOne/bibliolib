import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>
      test works!
    </p>
  `,
  styles: ``
})
export class TestComponent {

}
