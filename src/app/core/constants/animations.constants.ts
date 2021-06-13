import { animate, query, style, transition, trigger } from '@angular/animations';

export const animations = {
    slide: (className) =>
        trigger('slide', [
            transition(':enter', [
                query(`.${className}`, [
                    style({ opacity: 0, height: 0 }),
                    animate(
                        '0.2s ease-out',
                        style({
                            opacity: 1,
                            height: '*',
                        })
                    ),
                ]),
            ]),
            transition(':leave', [
                query(`.${className}`, [
                    style({ opacity: 1, height: '*' }),
                    animate(
                        '0.2s ease-in',
                        style({
                            opacity: 0,
                            height: 0,
                        })
                    ),
                ]),
            ]),
        ]),
};
