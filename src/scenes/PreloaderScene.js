class PreloaderScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloaderScene' });
    }

    init(data) {
        this.chosenCharacter = data.chosenCharacter;
    }

    preload() {
        this.loadStartTime = this.time.now;
        this.cameras.main.fadeIn(800, 0, 0, 0);
        this.personalScale = (this.scale.height + this.scale.width) / 2200;

        this.background = this.add.sprite(0, 0, 'fields_background').setOrigin(0.5, 1);
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

        const progressBar = this.add.graphics();
        const chargingBar = this.add.image(this.scale.width / 2, this.scale.height / 2 + 90 * this.personalScale * 0.8 + 40*this.personalScale, 'chargingBarFrame').setOrigin(0.5).setScale(this.personalScale * 0.8);
        this.load.on('progress', function (value) {
            progressBar.clear();
            progressBar.fillStyle(0x5a67b0, 1);

            let fillWidth = 2 * 290 * value * this.personalScale * 0.8;
            let fillHeight = 90 * this.personalScale * 0.8;
            let frameX = this.scale.width / 2 - 290 * this.personalScale * 0.8;
            let frameY = this.scale.height / 2 + (90 / 2) * this.personalScale * 0.8 + 40*this.personalScale;

            progressBar.fillRect(frameX, frameY, fillWidth, fillHeight);
        }, this);


        let fontSize;
        let text;
        if (this.scale.height > this.scale.width){
            fontSize = 35 * this.personalScale;
            text = 'Hilf uns, die\nZutaten für das Eis\nzu sammeln, um die\nAntwort auf das\nQuiz zu erhalten.'
        }
        else {
            fontSize = 28 * this.personalScale;
            text = 'Hilf uns, die Zutaten\nfür das Eis zu sammeln,\num die Antwort auf\ndas Quiz zu erhalten.'
        }
        this.add.text(this.scale.width / 2, chargingBar.y - 250 * this.personalScale, text, { 
            fontFamily: 'PressStart2P', 
            fontSize: fontSize, 
            fill: '#1f1f1f',
            align: 'center'
        }).setOrigin(0.5);

        this.loadingText = this.add.text(
            this.scale.width / 2 - (6 * 30 * this.personalScale) / 2,
            this.scale.height / 2 + 20 * this.personalScale,
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

        // Crea un evento ripetuto ogni 500ms per aggiornare il testo
        this.time.addEvent({
            delay: 500,
            loop: true,
            callback: () => {
                currentIndex = (currentIndex + 1) % loadingStates.length;
                this.loadingText.setText(loadingStates[currentIndex]);
            }
        });

        // Carica qui tutti gli asset necessari per il gioco
        if (this.chosenCharacter === 1) {
            this.load.spritesheet('player', 'assets/Sprites_player_m.png', {
                frameWidth: 72.5,
                frameHeight: 99,
                margin: 1,
                spacing: 0,
            });
        }
        else if (this.chosenCharacter === 2) {
            this.load.spritesheet('player', 'assets/Sprites_player_f.png', {
                frameWidth: 59.86,
                frameHeight: 92,
                margin: 1,
                spacing: 6.71,
            });
        }
        else console.log("Errore nel caricamento del chosenCharacter");
        this.load.image('ground_background', 'assets/underground_background.jpg');

        this.load.image('ground', 'assets/Sprites_ground.png');
        this.load.image('flower', 'assets/Sprites_flowers.png');
        this.load.image('grass', 'assets/Sprites_grass.png');
        this.load.image('deepGround', 'assets/Sprites_deep-ground.png');
        this.load.image('box', 'assets/Sprites_box.png');
        this.load.image('skull_1', 'assets/Sprites_skeleton_1.png');
        this.load.image('skull_2', 'assets/Sprites_skeleton_2.png');
        this.load.image('skull_3', 'assets/Sprites_skeleton_3.png');
        this.load.image('direction_board', 'assets/Sprites_direction_board.png');
        this.load.image('end_board', 'assets/Sprites_end_board.png');
        
        this.load.image('sunflowers', 'assets/Sprites_sunflowers.png');
        this.load.image('hay', 'assets/Sprites_hay.png');
        this.load.spritesheet('spider', 'assets/Sprites_spider.png', {
            frameWidth: 611.87/4,
            frameHeight: 73,
            margin: 2,
            spacing: 6.71
        });
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

        // bottoni movimento
        this.load.image('buttonRight', 'assets/Sprites_right-arrow-button.png');
        this.load.image('buttonLeft', 'assets/Sprites_left-arrow-button.png');
        this.load.image('buttonUp', 'assets/Sprites_up-arrow-button.png');

        // audio
        this.load.audio('soundtrack', 'sounds/soundtrack.mp3');
        this.load.audio('jump', 'sounds/jump.mp3');
        this.load.audio('collect', 'sounds/coin.mp3');
        this.load.audio('spider', 'sounds/spider.mp3');
        this.load.audio('fly', 'sounds/fly.mp3');
        this.load.audio('pop', 'sounds/pop.mp3');
        this.load.audio('jumpOver', 'sounds/jumpOver.mp3');
        this.load.audio('gameOver', 'sounds/gameOver.mp3');

        // bottoni volume
        this.load.image('volume_low', 'assets/Sprites_low-volume.png');
        this.load.image('volume_high', 'assets/Sprites_high-volume.png');
        this.load.image('volume_mute', 'assets/Sprites_no-volume.png');

        // vite
        this.load.image('emptyHeart', 'assets/Sprites_empty-heart.png');
        this.load.image('heart', 'assets/Sprites_heart.png');
    }

    create() {
        this.scale.refresh();
        console.log("Sono nella PreloaderScene");
        const elapsed = this.time.now - this.loadStartTime;
        console.log("elapsed: " + elapsed);
        const remaining = Math.max(0, 16000 - elapsed);
        console.log("remaining: " + remaining);
        if (this.progressBar) this.progressBar.destroy();

        this.time.delayedCall(remaining, () => {
            this.cameras.main.fadeOut(800, 0, 0, 0);
            this.time.delayedCall(800, () => {
              this.scene.start('FirstScene');
            });
        });
    }
}

export default PreloaderScene;