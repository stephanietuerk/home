import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExploreLineChartComponent } from './explore-line-chart.component';

describe('ExploreLineComponent', () => {
    let component: ExploreLineChartComponent;
    let fixture: ComponentFixture<ExploreLineChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ExploreLineChartComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ExploreLineChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
