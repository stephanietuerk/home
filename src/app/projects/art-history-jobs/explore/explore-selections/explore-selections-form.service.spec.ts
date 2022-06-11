import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ExploreSelectionsFormService } from './explore-selections-form.service';

describe('ExploreSelectionsFormService', () => {
    let service: ExploreSelectionsFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
        });
        service = TestBed.inject(ExploreSelectionsFormService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
