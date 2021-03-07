import Scene from './Scene';
import InputObserver from './InputObserver';
import BaseLoop from './BaseLoop';
import Mission from './Mission';
import Store from './Store';

export default class Schipper {
    constructor(root, position) {
        Store.setItem('mapX', position[0]);
        Store.setItem('mapY', position[1]);

        this.inputObserver = new InputObserver();
        this.scene = new Scene(root);
        this.baseLoop = new BaseLoop(this.scene);
        this.activeMission = null;

        this.baseLoop.start();
    }

    onMissionSuccess() {
        console.log('Success!');
    }

    onMissionTimeChanged(data) {
        console.log(data);
    }

    onMissionExpired() {
        console.log('Oh noes, your time is up!');
    }

    startMission() {
        const destination = [10.0066302, 53.5761585];
        this.activeMission = new Mission(destination, 30000);
        this.activeMission.on('success', () => this.onMissionSuccess());
        this.activeMission.on('expired', () => this.onMissionExpired());
        this.activeMission.on('tick', (data) => this.onMissionTimeChanged(data));
        this.scene.adMarkerToMap(destination);
    }
}
