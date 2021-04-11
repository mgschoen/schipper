import Store from './_Store';

export default class BulkSubscription {
    constructor(propertyNames, updateHandler) {
        if (!Array.isArray(propertyNames)) {
            throw new Error('`propertyNames` must be an array of store properties');
        }
        if (typeof updateHandler !== 'function') {
            throw new Error('missing callback `updateHandler` (invoked when store properties change)');
        }

        this.state = {};
        this.subscribers = {};
        this.updateHandler = updateHandler;

        propertyNames.forEach((propertyName) => {
            this.subscribers[propertyName] = (value) => {
                this.state[propertyName] = value;
                this.updateHandler({...this.state});
            };
            Store.subscribe(propertyName, this.subscribers[propertyName]);
        });
    }

    cancel() {
        Object.keys(this.subscribers).forEach((propertyName) => {
            Store.unsubscribe(propertyName, this.subscribers[propertyName]);
        });
        this.state = null;
        this.subscribers = null;
        this.updateHandler = null;
        this.instance = null;
    }
}