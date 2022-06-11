import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExploreChangeChartComponent } from './explore-change-chart.component';

describe('ExploreChangeChartComponent', () => {
    let component: ExploreChangeChartComponent;
    let fixture: ComponentFixture<ExploreChangeChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ExploreChangeChartComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ExploreChangeChartComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
