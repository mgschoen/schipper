import Schipper from './lib/Schipper';
import config from './content';

const { startPosition, missions } = config;
const game = new Schipper('canvas', startPosition, {
    missions
});

window.schipper = game;
