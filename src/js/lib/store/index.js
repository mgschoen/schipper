import Store from './_Store';
import Intermediary from './_Intermediary';

export default Store;

export function useStore(propertyNames, instance, optionalUpdateHandler) {
    return new Intermediary(propertyNames, instance, optionalUpdateHandler);
}
