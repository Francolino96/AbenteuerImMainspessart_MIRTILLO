import TitleScene from './scenes/TitleScene.js';
import CharacterSelectionScene from './scenes/CharacterSelectionScene.js';
import FirstScene from './scenes/FirstScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import PreloaderScene from './scenes/PreloaderScene.js';
import Preloader2Scene from './scenes/Preloader2Scene.js';
import BootScene from './scenes/BootScene.js';
import Boot2Scene from './scenes/Boot2Scene.js';
import VictoryScene from './scenes/VictoryScene.js';
import Victory2Scene from './scenes/Victory2Scene.js';
import AnswerScene from './scenes/AnswerScene.js';
import MenuScene from './scenes/MenuScene.js';
import FieldsScene from './scenes/FieldsScene.js';
import ForestScene from './scenes/ForestScene.js';
import WaterScene from './scenes/WaterScene.js';
import OrchardScene from './scenes/OrchardScene.js';

let config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    title: 'Abenteuer im Main-Spessart',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1200 * (window.innerHeight/1400)},
            debug: false
        }
    },
    scene: [
        TitleScene, 
        CharacterSelectionScene, 
        BootScene,
        Boot2Scene,
        PreloaderScene, 
        Preloader2Scene, 
        FirstScene, 
        GameOverScene, 
        VictoryScene,
        Victory2Scene,
        AnswerScene, 
        MenuScene,
        ForestScene,
        WaterScene,
        FieldsScene,
        OrchardScene,
    ],
    scale: {
        mode: Phaser.Scale.RESIZE, // Permette il ridimensionamento automatico
        autoCenter: Phaser.Scale.CENTER_BOTH // Centra il gioco
    }
};

let game;  // Dichiarazione globale

document.fonts.ready.then(() => {
    game = new Phaser.Game(config);  // Assegnazione dentro il blocco
});

window.addEventListener('resize', () => {
    if (game) { // Verifica che game sia stato inizializzato
        game.scale.resize(window.innerWidth, window.innerHeight);
    }
});
