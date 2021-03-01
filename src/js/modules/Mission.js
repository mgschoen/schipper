import distance from '@turf/distance';
import EventBus from './EventBus';

export default class Mission {
    constructor(destination, time, successCallback, expiredCallback) {
        this.destination = destination;
        this.destinationTolerance = 0.005;
        this.timeTotal = time;
        this.timeCurrent = 0;
        this.timeIntervalLength = 1000;
        this.successCallback = successCallback;
        this.expiredCallback = expiredCallback;

        this.boundOnPositionChanged = (data) => this.onPositionChanged(data);

        this.init();
    }

    init() {
        this.timeInterval = window.setInterval(() => this.timeLoop(), this.timeIntervalLength);
        EventBus.subscribe('POSITION_CHANGED', this.boundOnPositionChanged);
        EventBus.publish('MISSION_STARTED', {
            destination: this.destination,
            current: this.timeCurrent,
            total: this.timeTotal
        });
    }

    timeLoop() {
        this.timeCurrent += this.timeIntervalLength;
        EventBus.publish('MISSION_TIME_CHANGED', {
            current: this.timeCurrent,
            total: this.timeTotal
        });
        if (this.timeCurrent >= this.timeTotal) {
            this.expiredCallback();
            this.destroy();
        }
    }

    onPositionChanged(position) {
        let distanceToDestination = distance(this.destination, position);
        if (distanceToDestination < this.destinationTolerance) {
            this.successCallback();
            this.destroy();
        }
    }

    destroy() {
        window.clearInterval(this.timeInterval);
        this.timeInterval = null;
        EventBus.unsubscribe('POSITION_CHANGED', this.boundOnPositionChanged);
    }
}
