import distance from '@turf/distance';
import SchipperEvents from './schipper-events';

export default class SchipperMission {
    constructor(destination, time, successCallback, expiredCallback) {
        this.destination = destination;
        this.destinationTolerance = 0.005;
        this.timeTotal = time;
        this.timeCurrent = 0;
        this.timeIntervalLength = 1000;
        this.successCallback = successCallback;
        this.expiredCallback = expiredCallback;

        this.boundTimeLoop = () => this.timeLoop();
        this.boundOnPositionChanged = (data) => this.onPositionChanged(data);

        this.init();
    }

    init() {
        this.timeInterval = window.setInterval(this.boundTimeLoop, this.timeIntervalLength);
        SchipperEvents.subscribe('POSITION_CHANGED', this.boundOnPositionChanged);
        SchipperEvents.publish('MISSION_STARTED', {
            destination: this.destination,
            current: this.timeCurrent,
            total: this.timeTotal
        });
    }

    timeLoop() {
        this.timeCurrent += this.timeIntervalLength;
        SchipperEvents.publish('MISSION_TIME_CHANGED', {
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
        SchipperEvents.unsubscribe('POSITION_CHANGED', this.boundOnPositionChanged);
    }
}
