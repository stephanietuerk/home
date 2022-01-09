import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtHistoryTableComponent } from './art-history-table.component';

describe('ArtHistoryTableComponent', () => {
  let component: ArtHistoryTableComponent;
  let fixture: ComponentFixture<ArtHistoryTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtHistoryTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtHistoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
