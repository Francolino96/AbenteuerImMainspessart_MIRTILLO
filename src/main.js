import TitleScene from './scenes/TitleScene.js';
import FirstScene from './scenes/FirstScene.js';

let titleScene = new TitleScene();
let config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    title: 'Abenteuer im Main-Spessart',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 700 },
            debug: true
        }
    },
    scene: [TitleScene, FirstScene]
};
let game = new Phaser.Game(config);