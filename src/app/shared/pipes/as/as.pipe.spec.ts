import { TextContent } from '../models/section-config.model';
import { AsPipe } from './as.pipe';

describe('AsPipe', () => {
    let pipe: AsPipe;

    beforeEach(() => {
        pipe = new AsPipe();
    });
    it('should return the input value', () => {
        const result = pipe.transform('test me', TextContent);
        expect(result).toEqual('test me' as any);
    });
});
