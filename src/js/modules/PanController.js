import EventBus from './EventBus';
import { translateWithBearing } from './helpers';

export default class PanController {
    constructor(target) {
        this.target = target;
        this.running = false;
        this.activeKeys = [];
        this.movementStepSize = 0.001;
        this.rotationStepSize = 1;
        this.direction = 0;         // direction in degrees, north = 0, south = 180

        this.init();
    }

    init() {
        this.boundOnKeysChanged = (data) => this.onKeysChanged(data);
        EventBus.subscribe('KEYS_CHANGED', this.boundOnKeysChanged);
    }

    onKeysChanged(data) {
        let activeKeys = Object.keys(data).filter(key => data[key]);
        if (activeKeys.length) {
            this.setKeys(activeKeys);
            if (!this.running) {
                this.start();
            }
        } else {
            this.stop();
        }
    }

    loop() {
        let currentPosition = this.target.center;
        let acceleration = 0;
        let steering = 0;
        
        if (this.activeKeys.includes('left')) {
            steering -= this.rotationStepSize;
        }
        if (this.activeKeys.includes('right')) {
            steering += this.rotationStepSize;
        }
        if (this.activeKeys.includes('up')) {
            acceleration += this.movementStepSize;
        }
        if (this.activeKeys.includes('down')) {
            acceleration -= this.movementStepSize;
        }
        if (steering) {
            this.changeDirection(steering);
            this.target.setMarkerRotation(this.direction);
        }
        if (acceleration) {
            let movementDirection = (acceleration < 0) 
                ? (this.direction + 180) % 360
                : this.direction;
            let nextPosition = translateWithBearing(
                currentPosition[0],
                currentPosition[1],
                this.movementStepSize,
                movementDirection
            );
            if (this.target.onWater(nextPosition[0], nextPosition[1])) {
                this.target.moveTo(nextPosition[0], nextPosition[1]);
            }
        }
        if (this.running) {
            window.requestAnimationFrame(() => this.loop());
        }
    }

    changeDirection(degree) {
        let nextRotation = this.direction + degree;
        if (nextRotation < 0) {
            nextRotation = 360 + nextRotation;
        }
        if (nextRotation >= 360) {
            nextRotation = nextRotation % 360;
        }
        this.direction = nextRotation;
    }

    start() {
        this.running = true;
        this.loop();
    }

    setKeys(keys) {
        this.activeKeys = keys;
    }

    stop() {
        this.running = false;
    }

    destroy() {
        EventBus.unsubscribe('KEYS_CHANGED', this.boundOnKeysChanged);
    }
}
