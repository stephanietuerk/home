import { ArtHistoryDataServiceStub } from './art-history-data.service.stub';
import { ArtHistoryFieldsServiceStub } from './art-history-fields.service.stub';
import { ExploreDataServiceStub } from './explore-data.service.stub';

export class ArtHistoryMainServiceStub {
  artHistoryDataServiceStub = new ArtHistoryDataServiceStub();
  artHistoryFieldsServiceStub = new ArtHistoryFieldsServiceStub();
  exploreDataServiceStub = new ExploreDataServiceStub();
}
