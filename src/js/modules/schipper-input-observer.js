function SchipperInputObserver (eventCallback) {

    this.eventCallback = eventCallback;
    this.directionStates = {
        left: false,
        up: false,
        right: false,
        down: false
    };

    let listener = event => {
        let oldDirectionStates = Object.assign({}, this.directionStates);
        let direction;
        switch(event.keyCode) {
            case 37:
                direction = 'left'; break;
            case 38:
                direction = 'up'; break;
            case 39:
                direction = 'right'; break;
            case 40:
                direction = 'down'; break;
            default:
        }
        if (direction) {
            this.directionStates[direction] = event.type === 'keydown' ? true : false;
        }
        let directionStatesChanged = false;
        for (let dir in this.directionStates) {
             if (this.directionStates[dir] !== oldDirectionStates[dir]) {
                 directionStatesChanged = true;
             }
        }
        if (directionStatesChanged) {
            this.eventCallback(this.directionStates);
        }
    }

    window.addEventListener('keydown', listener);
    window.addEventListener('keyup', listener);
}

export default SchipperInputObserver;
