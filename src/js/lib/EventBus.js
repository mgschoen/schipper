const _subscriptions = {
    VIEW_LOADED: []
}

const EventBus = {
    subscribe: function (eventName, callback) {
        _subscriptions[eventName].push(callback);
    },
    unsubscribe: function (eventName, callback) {
        let index = _subscriptions[eventName].indexOf(callback);
        _subscriptions[eventName].splice(index, 1);
    },
    publish: function (eventName, data) {
        _subscriptions[eventName].forEach(function (callback) {
            callback(data);
        });
    }
}

Object.freeze(EventBus);
export default EventBus;
