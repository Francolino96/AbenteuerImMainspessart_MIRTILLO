class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    init(data) {
        this.chosenCharacter = data.chosenCharacter;
    }

    preload() {
        this.load.image('chargingBarFrame', 'assets/Sprites_charging_bar.png');
    }

    create() {
        console.log("Sono nella BootScene");
        this.scene.start('PreloaderScene', { chosenCharacter: this.chosenCharacter});
    }
}

export default BootScene;