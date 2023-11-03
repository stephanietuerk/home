import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { EnvironmentService } from './core/services/environment.service';
import { MainServiceStub } from './testing/stubs/main-service.stub';

describe('AppComponent', () => {
  let component: AppComponent;
  let mainServiceStub: MainServiceStub;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    mainServiceStub = new MainServiceStub();
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        {
          provide: EnvironmentService,
          useValue: mainServiceStub.environmentServiceStub,
        },
      ],
      declarations: [AppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('calls environment.init once', () => {
      component.ngOnInit();
      expect(mainServiceStub.environmentServiceStub.init).toHaveBeenCalledTimes(
        1
      );
    });
  });
});
