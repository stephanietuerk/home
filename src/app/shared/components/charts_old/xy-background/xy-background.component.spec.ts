import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartComponent } from '../chart/chart.component';
import { XYChartSpaceComponent } from '../xy-chart-space/xy-chart-space.component';
import { XyBackgroundComponent } from './xy-background.component';

describe('ChartBackgroundComponent', () => {
    let component: XyBackgroundComponent;
    let fixture: ComponentFixture<XyBackgroundComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [XyBackgroundComponent],
            providers: [XYChartSpaceComponent, ChartComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(XyBackgroundComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
