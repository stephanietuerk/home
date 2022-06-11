import { TestBed } from '@angular/core/testing';
import { ArtHistoryFieldsService } from './art-history-fields.service';

describe('ArtHistoryFieldsService', () => {
    let service: ArtHistoryFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ArtHistoryFieldsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
