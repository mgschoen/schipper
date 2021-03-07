import distance from '@turf/distance';
import EventBus from './EventBus';
import Store from './Store';

export default class Mission {
    constructor(destination, timeInMs) {
        this.destination = destination;
        this.destinationTolerance = 0.005;
        this.timeTotal = timeInMs;
        this.timeCurrent = 0;
        this.timeIntervalLength = 1000;
        this.successCallbacks = [];
        this.expiredCallbacks = [];
        this.tickCallbacks = [];

        this.boundOnPositionChanged = () => this.onPositionChanged();

        this.init();
    }

    init() {
        this.timeInterval = window.setInterval(() => this.timeLoop(), this.timeIntervalLength);
        Store.subscribe('mapX', this.boundOnPositionChanged);
        Store.subscribe('mapY', this.boundOnPositionChanged);
        EventBus.publish('MISSION_STARTED', {
            destination: this.destination,
            current: this.timeCurrent,
            total: this.timeTotal
        });
    }

    timeLoop() {
        this.timeCurrent += this.timeIntervalLength;
        const data = {
            current: this.timeCurrent,
            total: this.timeTotal
        };
        EventBus.publish('MISSION_TIME_CHANGED', data);
        this.tickCallbacks.forEach(callback => callback(data));
        if (this.timeCurrent >= this.timeTotal) {
            this.onExpired();
            this.destroy();
        }
    }

    onPositionChanged() {
        const position = [Store.getItem('mapX'), Store.getItem('mapY')];
        let distanceToDestination = distance(this.destination, position);
        if (distanceToDestination < this.destinationTolerance) {
            this.onSuccess();
            this.destroy();
        }
    }

    onSuccess() {
        this.successCallbacks.forEach(callback => callback());
    }

    onExpired() {
        this.expiredCallbacks.forEach(callback => callback());
    }

    on(eventName, callback) {
        switch(eventName) {
            case 'success':
                this.successCallbacks.push(callback);
                break;
            case 'expired':
                this.expiredCallbacks.push(callback);
                break;
            case 'tick':
                this.tickCallbacks.push(callback);
                break;
            default:
                console.warn(`Invalid eventName: "${eventName}"`);
        }
    }

    off(eventName, callback) {
        switch(eventName) {
            case 'success':
                this.successCallbacks = this.successCallbacks.filter(fun => fun !== callback);
                break;
            case 'expired':
                this.expiredCallbacks = this.expiredCallbacks.filter(fun => fun !== callback);
                break;
            case 'tick':
                this.tickCallbacks = this.tickCallbacks.filter(fun => fun !== callback);
                break;
            default:
                console.warn(`Invalid eventName: "${eventName}"`);
        }
    }

    destroy() {
        window.clearInterval(this.timeInterval);
        this.timeInterval = null;
        Store.unsubscribe('mapX', this.boundOnPositionChanged);
        Store.unsubscribe('mapY', this.boundOnPositionChanged);
        this.successCallbacks = [];
        this.expiredCallbacks = [];
        this.tickCallbacks = [];
    }
}
