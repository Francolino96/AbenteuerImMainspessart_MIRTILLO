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
    scene: [TitleScene, FirstScene],
    scale: {
        mode: Phaser.Scale.RESIZE, // Permette il ridimensionamento automatico
        autoCenter: Phaser.Scale.CENTER_BOTH // Centra il gioco
    }
};
let game = new Phaser.Game(config);

window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});