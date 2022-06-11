import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExploreSelectionsComponent } from './explore-selections.component';

describe('ExploreSelectionsComponent', () => {
    let component: ExploreSelectionsComponent;
    let fixture: ComponentFixture<ExploreSelectionsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ExploreSelectionsComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ExploreSelectionsComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
