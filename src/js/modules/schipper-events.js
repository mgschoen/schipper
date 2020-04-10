const _subscriptions = {
    KEYS_CHANGED: []
}

const SchipperEvents = {
    subscribe: function (eventName, callback) {
        _subscriptions[eventName].push(callback);
    },
    publish: function (eventName, data) {
        _subscriptions[eventName].forEach(function (callback) {
            callback(data);
        });
    }
}

Object.freeze(SchipperEvents);
export default SchipperEvents;
