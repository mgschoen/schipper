import Store from './_Store';
import BulkSubscription from './_BulkSubscription';

export default Store;

export function useStore(propertyNames, updateHandler) {
    return new BulkSubscription(propertyNames, updateHandler);
}
