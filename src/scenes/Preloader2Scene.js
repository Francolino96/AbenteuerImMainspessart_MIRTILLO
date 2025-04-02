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
            this.load.spritesheet('snake', 'assets/Sprites_snake.png', {
                frameWidth: 1200/3,
                frameHeight: 60,
                margin: 0,
                spacing: 6.71
            });
            this.load.spritesheet('fish', 'assets/Sprites_fish.png', {
                frameWidth: 200,
                frameHeight: 74
            });
            this.load.spritesheet('spider', 'assets/Sprites_spider.png', {
                frameWidth: 594.8/4,
                frameHeight: 75,
                margin: 0,
                spacing: 6.71
            });
            this.load.spritesheet('fly', 'assets/Sprites_fly.png', {
                frameWidth: 147/2,
                frameHeight: 75
            });
            this.load.image('hazelnut', 'assets/Sprites_hazelnut.png');
            this.load.image('apple', 'assets/Sprites_apple.png');
            this.load.image('fence', 'assets/Sprites_fence.png');
            this.load.image('appleTree1', 'assets/Sprites_apple_tree_1.png');
            this.load.image('appleTree2', 'assets/Sprites_apple_tree_2.png');
            this.load.image('appleTree3', 'assets/Sprites_apple_tree_3.png');
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
