import Store from './_Store';

export default class Intermediary {
    constructor(propertyNames, instance, optionalUpdateHandler) {
        this.state = {};
        this.subscribers = {};
        this.updateHandler = optionalUpdateHandler;
        this.instance = instance;

        propertyNames.forEach((propertyName) => {
            this.subscribers[propertyName] = (value) => {
                this.state[propertyName] = value;
                if (this.updateHandler) {
                    this.updateHandler({...this.state});
                } else {
                    this.instance.update({...this.state});
                }
            };
            Store.subscribe(propertyName, this.subscribers[propertyName]);
        });
    }

    destroy() {
        Object.keys(this.subscribers).forEach((propertyName) => {
            Store.unsubscribe(propertyName, this.subscribers[propertyName]);
        });
        this.state = null;
        this.subscribers = null;
        this.updateHandler = null;
        this.instance = null;
    }
}