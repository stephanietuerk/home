import { UnsubscribeDirectiveStub } from '../testing/services/classes/unsubscribe.directive.stub';

describe('the Subscription abstract class', () => {
    let directive: UnsubscribeDirectiveStub;

    beforeEach(() => {
        directive = new UnsubscribeDirectiveStub();
    });

    describe('ngOnDestroy', () => {
        beforeEach(() => {
            spyOn(directive.unsubscribe, 'next');
            spyOn(directive.unsubscribe, 'complete');
        });

        it('calls abstractClass.unsubscribe.next', () => {
            directive.ngOnDestroy();
            expect(directive.unsubscribe.next).toHaveBeenCalledTimes(1);
        });

        it('calls abstractClass.unsubscribe.complete', () => {
            directive.ngOnDestroy();
            expect(directive.unsubscribe.complete).toHaveBeenCalledTimes(1);
        });
    });
});
