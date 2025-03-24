class Preloader2Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Preloader2Scene' });
        this.progressBar = null;
    }

    init(data) {
        this.selectedScene = data.selectedScene;
    }

    preload() {

        this.cameras.main.setBackgroundColor('#000');
        this.personalScale = (this.scale.height + this.scale.width) / 2200;

        let centerX = this.scale.width / 2;
        let centerY = this.scale.height / 2;

        this.progressBar = this.add.graphics();

        this.load.on('progress', (value) => {
            this.progressBar.clear();
            this.progressBar.fillStyle(0xff0000, 1);

            let fillWidth = 2 * 290 * value * this.personalScale * 0.8;
            let fillHeight = 90 * this.personalScale * 0.8;
            let frameX = centerX - 290 * this.personalScale * 0.8;
            let frameY = centerY - (90 / 2) * this.personalScale * 0.8;
            this.progressBar.fillRect(frameX, frameY, fillWidth, fillHeight);
        });

        this.add.image(centerX, centerY, 'chargingBarFrame').setOrigin(0.5).setScale(this.personalScale * 0.8);

        this.loadingText = this.add.text(
            this.scale.width / 2 - (6 * 30 * this.personalScale) / 2,
            this.scale.height / 2 - 100 * this.personalScale,
            'Lädt',
            {
                fontFamily: 'PressStart2P',
                fontSize: 30 * this.personalScale,
                fill: '#fff',
                align: 'center'
            }
        ).setOrigin(0, 0.5);

        const loadingStates = ['Lädt', 'Lädt.', 'Lädt..', 'Lädt...'];
        let currentIndex = 0;

        this.time.addEvent({
            delay: 500,
            loop: true,
            callback: () => {
                currentIndex = (currentIndex + 1) % loadingStates.length;
                this.loadingText.setText(loadingStates[currentIndex]);
            }
        });

        if (this.selectedScene == "FirstScene") {
            this.load.image('fields_background', 'assets/fields_background.jpg');
        }
        else if (this.selectedScene == "WaterScene") {
            this.load.image('water_background', 'assets/water_background.jpg');
        }
        else if (this.selectedScene == "ForestScene") {
            this.load.image('forest_background', 'assets/forest_background.jpg');
        }
        else if (this.selectedScene == "FieldsScene") {
            this.load.image('fields_background', 'assets/fields_background.jpg');
        }
        else if (this.selectedScene == "OrchardScene") {
            this.load.image('orchard_background', 'assets/orchard_background.jpg');
        }
    }

    create() {
        console.log("Sono nella Preloader2Scene");
        this.cameras.main.fadeIn(800, 0, 0, 0);
        this.cameras.main.fadeOut(800, 0, 0, 0);
        this.time.delayedCall(800, () => {
            this.load.on('complete', () => {
                if (this.progressBar) {
                    this.progressBar.destroy();
                }
            });
            this.scene.start(this.selectedScene);
        });
    }
}

export default Preloader2Scene;
