import EventBus from './EventBus';
import Store from './store';

export default class InputObserver {
    constructor() {
        Store.setItem('activeKeys', {
            left: false,
            up: false,
            right: false,
            down: false
        });
        window.addEventListener('keydown', (event) => this.listener(event));
        window.addEventListener('keyup', (event) => this.listener(event));
    }

    listener(event) {
        let oldActiveKeys = Object.assign({}, Store.getItem('activeKeys'));
        let newActiveKeys = Object.assign({}, oldActiveKeys);
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
            newActiveKeys[direction] = event.type === 'keydown' ? true : false;
        }
        let directionStatesChanged = false;
        for (let dir in newActiveKeys) {
             if (newActiveKeys[dir] !== oldActiveKeys[dir]) {
                 directionStatesChanged = true;
             }
        }
        if (directionStatesChanged) {
            Store.setItem('activeKeys', newActiveKeys);
        }
    }
}
