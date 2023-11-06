import { Observable } from 'rxjs';
import { JobDatum, JobsByCountry } from '../../art-history-data.model';

export class ArtHistoryDataServiceStub {
  data$: Observable<JobDatum[]>;
  dataBySchool$: Observable<JobsByCountry[]>;
}
