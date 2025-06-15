class Preloader2Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Preloader2Scene' });
        this.progressBar = null;
    }

    init(data) {
        this.selectedScene = data.selectedScene;
    }

    preload() {
        this.personalScale = (this.scale.height + this.scale.width) / 2200;
        this.cameras.main.fadeIn(800, 0, 0, 0);

        let backgroundImage;
        if (this.selectedScene == 'OrchardScene'){
            backgroundImage = 'orchard_background';
        }
        else if (this.selectedScene == 'FieldsScene'){
            backgroundImage = 'fields_background';
        }
        else if (this.selectedScene == 'ForestScene'){
            backgroundImage = 'forest_background';
        }
        else if (this.selectedScene == 'WaterScene'){
            backgroundImage = 'water_background';
        }
        this.background = this.add.sprite(0, 0, backgroundImage).setOrigin(0.5, 1);
        const aspectRatio = this.background.width / this.background.height;
        let newW, newH;
        if (this.scale.width / this.scale.height > aspectRatio) {
            newW = this.scale.width;
            newH = newW / aspectRatio;
        } else {
            newH = this.scale.height;
            newW = newH * aspectRatio;
        }
        newH *= 1.1;
        newW = newH * aspectRatio;
        this.background.setDisplaySize(newW, newH).setPosition(this.scale.width / 2, this.scale.height + 20 * this.personalScale);

        let centerX = this.scale.width / 2;
        let centerY = this.scale.height / 2;

        this.progressBar = this.add.graphics();

        this.load.on('progress', (value) => {
            this.progressBar.clear();
            this.progressBar.fillStyle(0x5a67b0, 1);

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
                fontSize: 35 * this.personalScale,
                fill: '#1f1f1f',
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

        if (this.selectedScene == "WaterScene") {
            this.load.image('water', 'assets/Sprites_water.png');
            this.load.spritesheet('fish', 'assets/Sprites_fish.png', {
                frameWidth: 200,
                frameHeight: 74
            });
            this.load.audio('snake', 'sounds/snake.mp3');
            this.load.spritesheet('snake', 'assets/Sprites_snake.png', {
                frameWidth: 1200/3,
                frameHeight: 60,
                margin: 0,
                spacing: 6.71
            });
            this.load.image('bomb', 'assets/Sprites_bomb.png');
            this.load.image('bomb_2', 'assets/Sprites_bomb_2.png');
            this.load.audio('fly', 'sounds/fly.mp3');
            this.load.spritesheet('fly', 'assets/Sprites_fly.png', {
                frameWidth: 147/2,
                frameHeight: 75
            });
            this.load.image('fence', 'assets/Sprites_fence.png');
            this.load.image('raft', 'assets/Sprites_raft.png');
            this.load.image('stiancia', 'assets/Sprites_stiancia.png');
            this.load.image('hazelnut_icon', 'assets/Sprites_hazelnut_icon.png');
            this.load.spritesheet('hazelnut', 'assets/Sprites_hazelnut.png', {
                frameWidth: 91,
                frameHeight: 91
            });
            this.load.image('milk_icon', 'assets/Sprites_milk_icon.png');
            this.load.spritesheet('milk', 'assets/Sprites_milk.png', {
                frameWidth: 91,
                frameHeight: 91
            });
        }

        else if (this.selectedScene == "ForestScene") {
            this.load.image('sugar_icon', 'assets/Sprites_sugar_cube_icon.png');
            this.load.spritesheet('sugar', 'assets/Sprites_sugar_cube.png', {
                frameWidth: 91,
                frameHeight: 91
            });
            this.load.image('blueberry_icon', 'assets/Sprites_blueberry_icon.png');
            this.load.spritesheet('blueberry', 'assets/Sprites_blueberry.png', {
                frameWidth: 91,
                frameHeight: 91
            });
            this.load.audio('boar', 'sounds/boar.mp3');
            this.load.spritesheet('boar', 'assets/Sprites_boar.png', {
                frameWidth: 133,
                frameHeight: 101
            });
            this.load.image('mushroom', 'assets/Sprites_mushroom.png');
            this.load.image('mushroom_smashed', 'assets/Sprites_mushroom_2.png');
            this.load.image('acorn', 'assets/Sprites_acorn.png');
            this.load.image('acorn_expl_1', 'assets/Sprites_acorn_explosion_1.png');
            this.load.image('acorn_expl_2', 'assets/Sprites_acorn_explosion_2.png');
            this.load.image('tree_1', 'assets/Sprites_tree_1.png');
            this.load.image('tree_2', 'assets/Sprites_tree_2.png');
            this.load.image('tree_3', 'assets/Sprites_tree_3.png');
            this.load.image('tree_4', 'assets/Sprites_tree_4.png');
        }

        else if (this.selectedScene == "FieldsScene") {
            this.load.image('sunflowers', 'assets/Sprites_sunflowers.png');
            this.load.image('hay', 'assets/Sprites_hay.png');
            this.load.audio('spider', 'sounds/spider.mp3');
            this.load.spritesheet('spider', 'assets/Sprites_spider.png', {
                frameWidth: 611.87/4,
                frameHeight: 73,
                margin: 2,
                spacing: 6.71
            });
            this.load.audio('fly', 'sounds/fly.mp3');
            this.load.spritesheet('fly', 'assets/Sprites_fly.png', {
                frameWidth: 147/2,
                frameHeight: 75
            });
            this.load.image('strawberry_icon', 'assets/Sprites_strawberry_icon.png');
            this.load.spritesheet('strawberry', 'assets/Sprites_strawberry.png', {
                frameWidth: 91,
                frameHeight: 91
            });
            this.load.image('sugar_icon', 'assets/Sprites_sugar_cube_icon.png');
            this.load.spritesheet('sugar', 'assets/Sprites_sugar_cube.png', {
                frameWidth: 91,
                frameHeight: 91
            });
            this.load.image('fence', 'assets/Sprites_fence.png');
            this.load.image('whiteMushroom', 'assets/Sprites_white-mushroom.png');
            this.load.image('whiteMushroom_smashed', 'assets/Sprites_white-mushroom_2.png');
            this.load.image('appleTree1', 'assets/Sprites_apple_tree_1.png');
            this.load.image('appleTree2', 'assets/Sprites_apple_tree_2.png');
            this.load.image('appleTree3', 'assets/Sprites_apple_tree_3.png');
        }

        else if (this.selectedScene == "OrchardScene") {
            this.load.audio('spider', 'sounds/spider.mp3');
            this.load.spritesheet('spider', 'assets/Sprites_spider.png', {
                frameWidth: 611.87/4,
                frameHeight: 73,
                margin: 2,
                spacing: 6.71
            });
            this.load.image('pumpkin', 'assets/Sprites_pumpkin.png');
            this.load.image('pumpkin_2', 'assets/Sprites_pumpkin_2.png');
            this.load.image('sugar_icon', 'assets/Sprites_sugar_cube_icon.png');
            this.load.spritesheet('sugar', 'assets/Sprites_sugar_cube.png', {
                frameWidth: 91,
                frameHeight: 91
            });
            this.load.image('apple_icon', 'assets/Sprites_apple_icon.png');
            this.load.spritesheet('apple', 'assets/Sprites_apple.png', {
                frameWidth: 91,
                frameHeight: 91
            });
            this.load.image('fence', 'assets/Sprites_fence.png');
            this.load.image('appleTree1', 'assets/Sprites_apple_tree_1.png');
            this.load.image('appleTree2', 'assets/Sprites_apple_tree_2.png');
            this.load.image('appleTree3', 'assets/Sprites_apple_tree_3.png');
        }
    }

    create() {
        this.scale.refresh();
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