import { Directive, ElementRef, HostListener, Inject } from '@angular/core';

@Directive({
    selector: '[appHour]',
    standalone: true
})
export class HourDirective {
    constructor(@Inject(ElementRef) private el: ElementRef) { }

    @HostListener('input', ['$event'])
    onInput(event: KeyboardEvent) {
        const input = this.el.nativeElement as HTMLInputElement;
        let value = input.value.toUpperCase().replace(/[^0-9]/g, '').substring(0, 4);
        let regexHour = new RegExp('^[0-9]{2}:[0-9]{2}$');
        if (value.length > 2 && !value.includes(':')) {
            value = value.substring(0, 2) + ':' + value.substring(2);
        } else if (value.length > 5) {
            event.preventDefault();
        } 
        
        input.value = value;
    }

}