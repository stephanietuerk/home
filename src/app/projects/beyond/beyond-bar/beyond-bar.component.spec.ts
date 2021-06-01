import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeyondBarComponent } from './beyond-bar.component';

describe('BeyondBarComponent', () => {
  let component: BeyondBarComponent;
  let fixture: ComponentFixture<BeyondBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeyondBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeyondBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
