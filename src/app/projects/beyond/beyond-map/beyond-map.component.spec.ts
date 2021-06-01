import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeyondMapComponent } from './beyond-map.component';

describe('BeyondMapComponent', () => {
  let component: BeyondMapComponent;
  let fixture: ComponentFixture<BeyondMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeyondMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeyondMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
