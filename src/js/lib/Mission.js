import distance from '@turf/distance';
import Store, { useStore } from './store';

export default class Mission {
    constructor(destination, timeInMs, options) {
        this.destination = destination;
        this.destinationTolerance = 0.005;
        this.shortDescription = options.shortDescription || '';
        this.timeTotal = timeInMs;
        this.timeCurrent = 0;
        this.timeIntervalLength = 1000;
        this.successCallbacks = [];
        this.expiredCallbacks = [];
        this.tickCallbacks = [];

        this.boundOnPositionChanged = () => this.onPositionChanged();

        this.timeInterval = window.setInterval(() => this.intervalTick(), this.timeIntervalLength);
        this.positionSubscription = useStore([
            'mapX',
            'mapY'
        ], () => this.onPositionChanged());
        Store.setItem('missionDestinationX', this.destination[0]);
        Store.setItem('missionDestinationY', this.destination[1]);
        Store.setItem('missionTimeTotal', timeInMs);
        Store.setItem('missionTimeCurrent', 0);
        Store.setItem('missionDescription', this.shortDescription);
        Store.setItem('missionIsActive', true);
    }

    intervalTick() {
        const timeTotal = Store.getItem('missionTimeTotal');
        const timeCurrentBefore = Store.getItem('missionTimeCurrent')
        Store.setItem('missionTimeCurrent', timeCurrentBefore + this.timeIntervalLength);
        const timeCurrentAfter = Store.getItem('missionTimeCurrent');

        this.tickCallbacks.forEach(callback => callback({
            current: timeCurrentAfter,
            total: timeTotal
        }));

        if (timeCurrentAfter >= timeTotal) {
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
        this.positionSubscription.cancel();
        this.successCallbacks = [];
        this.expiredCallbacks = [];
        this.tickCallbacks = [];
        Store.setItem('missionIsActive', false);
    }
}
