class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    init(data) {
        this.chosenCharacter = data.chosenCharacter;
    }

    preload() {
        // Carica il frame della barra di caricamento
        this.load.image('chargingBarFrame', 'assets/Sprites_charging_bar.png');
    }

    create() {
        // Una volta caricata l'immagine, passa alla scena PreloaderScene
        this.scene.start('PreloaderScene', { chosenCharacter: this.chosenCharacter });
    }
}

export default BootScene;