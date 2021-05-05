import AbstractComponent from './_AbstractComponent';
import { useStore } from '../store';

export default class MissionCounter extends AbstractComponent {
    constructor(...args) {
        super(...args);

        this._visible = false;

        this.storeSubscription = useStore([
            'missionLifecycle',
            'missionIndexCurrent',
            'missionCountTotal'
        ], (state) => this.onStoreChanged(state));
    }

    onStoreChanged(state) {
        this.visible = state.missionLifecycle !== 'inactive';
        if (typeof state.missionIndexCurrent === 'number') {
            this.elements.current.textContent = state.missionIndexCurrent + 1;
        }
        if (typeof state.missionCountTotal === 'number') {
            this.elements.total.textContent = state.missionCountTotal;
        }
    }

    updateVisibility() {
        if (this.visible) {
            this.root.style.opacity = '1';
            this.root.style.transform = 'translateY(0)';
        } else {
            this.root.style.opacity = '0';
            this.root.style.transform = 'translateY(-150%)';
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