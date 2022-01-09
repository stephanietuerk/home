import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArtHistorySelectionsComponent } from './selections.component';

describe('SelectionsComponent', () => {
    let component: ArtHistorySelectionsComponent;
    let fixture: ComponentFixture<ArtHistorySelectionsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ArtHistorySelectionsComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ArtHistorySelectionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
