import Scene from './Scene';
import InputObserver from './InputObserver';
import MainLoop from './loop';
import Store from './store';
import MissionController from './MissionController';
import createComponentLoader from './ui-components';

export default class Schipper {
    constructor(root, position, options) {
        Store.setItem('mapX', position[0]);
        Store.setItem('mapY', position[1]);

        this.components = createComponentLoader();
        this.inputObserver = new InputObserver();
        this.scene = new Scene(root);
        this.mainLoop = new MainLoop(this.scene);
        this.missionController = new MissionController(options.missions || []);

        this.mainLoop.start();
    }
}
