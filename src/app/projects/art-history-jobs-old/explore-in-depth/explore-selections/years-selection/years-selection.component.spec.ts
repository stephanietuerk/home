import { ComponentFixture, TestBed } from '@angular/core/testing';
import { YearsSelectionComponent } from './years-selection.component';

describe('YearsSelectionComponent', () => {
    let component: YearsSelectionComponent;
    let fixture: ComponentFixture<YearsSelectionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [YearsSelectionComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(YearsSelectionComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
