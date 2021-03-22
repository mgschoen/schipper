import AbstractComponent from './_AbstractComponent';
import { useStore } from '../store';

export default class MissionDashboard extends AbstractComponent {
    constructor(...args) {
        super(...args);

        this._visible = false;

        this.storeSubscription = useStore([
            'missionIsActive',
            'missionTimeTotal',
            'missionTimeCurrent',
            'missionDescription'
        ], (state) => this.onStoreChanged(state));
    }

    onStoreChanged(state) {
        this.visible = state.missionIsActive;
        if (typeof state.missionTimeTotal === 'number' && typeof state.missionTimeCurrent === 'number') {
            this.elements.time.textContent = this.formatTimeData(state.missionTimeTotal, state.missionTimeCurrent);
        }
        if (state.missionDescription) {
            this.elements.description.textContent = state.missionDescription;
        }
    }

    formatTimeData(total, current) {
        let remaining = total - current;
        let remainingSeconds = remaining / 1000;
        let remainingString = '' + 
            ((remainingSeconds >= 60) ? Math.floor(remainingSeconds / 60) + 'm' : '') + 
            remainingSeconds % 60 + 's';
        return remainingString;
    }

    updateVisibility() {
        if (this.visible) {
            this.root.style.opacity = '1';
            this.root.style.transform = 'translateY(0)';
        } else {
            this.root.style.opacity = '0';
            this.root.style.transform = 'translateY(150%)';
        }
    }

    get visible() {
        return this._visible;
    }

    set visible(value) {
        if (!typeof value === 'boolean') {
            return;
        }
        this._visible = value;
        this.updateVisibility();
    }

    destroy() {
        super.destroy();
        this.storeSubscription.cancel();
    }
}