import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArtHistoryDataService } from '../art-history-data.service';
import { ArtHistoryMainServiceStub } from '../testing/stubs/art-history-main.service.stub';
import { SchoolsComponent } from './schools.component';

describe('SchoolsComponent', () => {
  let component: SchoolsComponent;
  let fixture: ComponentFixture<SchoolsComponent>;
  let mainServiceStub: ArtHistoryMainServiceStub;

  beforeEach(async () => {
    mainServiceStub = new ArtHistoryMainServiceStub();
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: ArtHistoryDataService,
          useValue: mainServiceStub.artHistoryDataServiceStub,
        },
      ],
      declarations: [SchoolsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SchoolsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
