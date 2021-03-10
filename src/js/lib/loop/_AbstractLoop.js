export default class AbstractLoop {
    constructor(scene) {
        this.active = false;
    }

    // Public loop method
    loop() {
        if (!this.active) {
            return;
        }

        if (this._loopImplementation && typeof this._loopImplementation === 'function') {
            this._loopImplementation();
        }
    }

    // Actual loop implementation, override in child class
    _loopImplementation() {}
}