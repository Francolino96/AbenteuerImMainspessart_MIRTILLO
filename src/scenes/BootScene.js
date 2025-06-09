<<<<<<< HEAD
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

=======
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

>>>>>>> 921c98abe545e84d802a3ba87864e9adecb508c7
export default BootScene;