import Schipper from './lib/Schipper';

const game = new Schipper('canvas', [10.01303, 53.57882]);
game.initScene();

window.schipper = game;
