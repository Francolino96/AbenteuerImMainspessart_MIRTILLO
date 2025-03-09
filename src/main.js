import TitleScene from './scenes/TitleScene.js';
import CharacterSelectionScene from './scenes/CharacterSelectionScene.js';
import FirstScene from './scenes/FirstScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import PreloaderScene from './scenes/PreloaderScene.js';
import BootScene from './scenes/BootScene.js';
import VictoryScene from './scenes/VictoryScene.js';
import AnswerScene from './scenes/AnswerScene.js';

let config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    title: 'Abenteuer im Main-Spessart',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1200 },
            debug: false
        }
    },
    scene: [TitleScene, CharacterSelectionScene, BootScene, PreloaderScene, FirstScene, GameOverScene, VictoryScene, AnswerScene],
    scale: {
        mode: Phaser.Scale.RESIZE, // Permette il ridimensionamento automatico
        autoCenter: Phaser.Scale.CENTER_BOTH // Centra il gioco
    }
};
document.fonts.ready.then(() => {
    let game = new Phaser.Game(config);
});

window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});