class Boot2Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Boot2Scene' });
    }

    init(data) {
        this.selectedScene = data.selectedScene;
    }

    preload() {
        this.load.image('chargingBarFrame', 'assets/Sprites_charging_bar.png');
    }

    create() {
        console.log("Sono nella Boot2Scene");
        this.scene.start('Preloader2Scene', {selectedScene: this.selectedScene });
    }
}

export default Boot2Scene;