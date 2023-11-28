import {
    animate,
    style,
    transition,
    trigger
} from "@angular/animations";

const MobileAnimations = [
        trigger('searchandfilter', [
            transition(':enter', [
                style({ transform: 'translateY(100%)' }),
                animate('0.25s ease-in-out', style({ transform: 'translateY(0%)' })),
            ]),
            transition(':leave', [
                style({ transform: 'translateY(0%)' }),
                animate('0.25s ease-in-out', style({ transform: 'translateY(100%)' })),
            ]),
        ])
];

const DesktopAnimations = [
        trigger('searchandfilter', [
            transition(':enter', [
                style({ transform: 'translateX(100%)' }),
                animate('0.25s ease-in-out', style({ transform: 'translateX(0%)' })),
            ]),
            transition(':leave', [
                style({ transform: 'translateX(0%)' }),
                animate('0.25s ease-in-out', style({ transform: 'translateX(100%)' })),
            ]),
        ])
];

export function getAnimations() {
    const isDesktop = matchMedia("(min-width: 1280px)").matches;
    return isDesktop ? DesktopAnimations : MobileAnimations;
}