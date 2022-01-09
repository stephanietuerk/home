import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Sort } from 'src/app/core/enums/sort.enum';
import { SortArrowsComponent } from './sort-arrows.component';

describe('SortArrowsComponent', () => {
    let component: SortArrowsComponent;
    let fixture: ComponentFixture<SortArrowsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SortArrowsComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SortArrowsComponent);
        component = fixture.componentInstance;
    });

    describe('getSort()', () => {
        it('should return the sortDirection if there is a sortDirection', () => {
            component.sortDirection = Sort.asc;
            expect(component.getSort()).toEqual('asc');
        });
        it('should return any empty string sortDirection if sortDirection is falsey', () => {
            component.sortDirection = undefined;
            expect(component.getSort()).toEqual('');
        });
    });
});
