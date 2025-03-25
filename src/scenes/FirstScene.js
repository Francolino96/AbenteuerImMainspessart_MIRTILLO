import {
    spawnDecor,
    spawnSkull,
    isPositionInGap,
    createIngredients,
    collectIngredient,
    createMushroom,
    createAcorns,
    updateAcorns,
    createBoar,
    updateBoar,
    updateIngredients,
    die,
    win,
    createScores,
    createMovementButtons,
    createVolumeButton,
    createLives,
} from '../utils.js';

class FirstScene extends Phaser.Scene {

    constructor() {
        super({ key: 'FirstScene' });
    }

    create() {
        this.scale.refresh();
        this.mapWidth = this.scale.height * 8;
        this.mapHeight = this.scale.height;
        this.screenHeight = this.scale.height;
        this.screenWidth = this.scale.width;
        this.isVertical = this.screenHeight > this.screenWidth;
        if (this.isVertical) {
            this.mapHeight = this.mapHeight * 0.75;
        }
        else {
            this.mapHeight = this.mapHeight * 0.85;
        }
        this.personalScale = this.mapHeight / 1200;
        this.boxWidth = 99 * this.personalScale;
        this.margin = this.personalScale * 70;
        this.physics.world.setBounds(0, 0, this.mapWidth, this.screenHeight);
        this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
        this.cameras.main.fadeIn(800, 0, 0, 0);
        this.lives = 3;
        this.player;
        this.strawberries;
        this.sugar;
        this.sugarCollected = 0;
        this.strawberryCollected = 0;
        this.blueberryCollected = 0;
        this.platforms;
        this.cursors;
        this.isInvincible = false;
        this.gameOver = false;
        this.victory = false;
        this.scoreText;
        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.isJumping = false;

        this.collectSound = this.sound.add('collect', { loop: false, volume: 0.08 });
        this.gameOverSound = this.sound.add('gameOver', { loop: false, volume: 0.3 });
        this.jumpSound = this.sound.add('jump', { loop: false, volume: 0.3 });
        this.jumpOverSound = this.sound.add('jumpOver', { loop: false, volume: 0.3 });
        this.popSound = this.sound.add('pop', { loop: false, volume: 0.5 });
        this.music = this.sound.add('soundtrack', { loop: true, volume: 0.5 });
        this.music.play();
        this.sound.setVolume(0.1);

        //this.add.image(this.mapWidth / 2, this.mapHeight / 2, 'background').setDisplaySize(this.mapWidth, this.screenHeight);
        const bgSource = this.textures.get('forest_background').getSourceImage();
        const desiredHeight = this.screenHeight + 10;

        const scaleFactor = desiredHeight / bgSource.height;
        this.background = this.add.tileSprite(
            this.mapWidth / 2,
            this.mapHeight,
            this.mapWidth,
            desiredHeight,
            'forest_background'
        ).setOrigin(0.5, 1).setScrollFactor(0.2);

        this.background.setTileScale(scaleFactor, scaleFactor);

        console.log('screenWidth: ' + this.screenWidth);
        console.log('screenHeight: ' + this.screenHeight);
        console.log('mapWidth: ' + this.mapWidth);
        console.log('mapHeight: ' + this.mapHeight);

        this.platforms = this.physics.add.staticGroup();
        const platformWidth = 99 * this.personalScale;
        const gapPercentages = [0.2, 0.5, 0.8];
        const gapWidth = 500 * this.personalScale;

        const numPlatforms = Math.ceil(this.mapWidth / platformWidth);
        for (let i = 0; i < numPlatforms; i++) {
            let platformX = i * platformWidth + platformWidth / 2;
            const isInGap = isPositionInGap(this.personalScale, platformX, gapPercentages, this.mapWidth, gapWidth);
            if (!isInGap) {
                let ground = this.platforms.create(platformX, this.mapHeight - platformWidth / 2, 'ground')
                    .setScale(this.personalScale).refreshBody();
                let randomFlipX = Math.random() < 0.5;
                if (randomFlipX) {
                    ground.setFlipX(true);
                }
            }
        }

        this.deepGrounds = this.physics.add.staticGroup();
        const numRows = Math.ceil((this.screenHeight - (this.mapHeight - platformWidth / 2)) / platformWidth);
        for (let row = 1; row <= numRows; row++) {
            for (let i = 0; i < numPlatforms; i++) {
                let platformX = i * platformWidth + platformWidth / 2;
                let isInGap = isPositionInGap(this.personalScale, platformX, gapPercentages, this.mapWidth, gapWidth);
                if (!isInGap) {
                    let deepGround = this.deepGrounds.create(
                        platformX,
                        this.mapHeight - platformWidth / 2 + row * platformWidth,
                        'deepGround'
                    ).setScale(this.personalScale).refreshBody();
                    let randomFlipX = Math.random() < 0.5;
                    let randomFlipY = Math.random() < 0.5;
                    if (randomFlipX) {
                        deepGround.setFlipX(true);
                    }
                    if (randomFlipY) {
                        deepGround.setFlipY(true);
                    }
                }
            }
        }

        spawnDecor(this, 1.8, true, 'tree_1', 0.001 * this.mapWidth, this.mapWidth * 0.2, this.mapWidth - 500 * this.personalScale, gapPercentages, this.mapWidth, gapWidth, this.boxWidth);
        spawnDecor(this, 1.8, true, 'tree_2', 0.001 * this.mapWidth, this.mapWidth * 0.2, this.mapWidth - 500 * this.personalScale, gapPercentages, this.mapWidth, gapWidth, this.boxWidth);
        spawnDecor(this, 1.8, true, 'tree_3', 0.001 * this.mapWidth, this.mapWidth * 0.2, this.mapWidth - 500 * this.personalScale, gapPercentages, this.mapWidth, gapWidth, this.boxWidth);
        spawnDecor(this, 1.8, true, 'tree_4', 0.001 * this.mapWidth, this.mapWidth * 0.2, this.mapWidth - 500 * this.personalScale, gapPercentages, this.mapWidth, gapWidth, this.boxWidth);


        const lev1PlatformHeight = this.mapHeight - 400 * this.personalScale;
        const lev2PlatformHeight = this.mapHeight - 600 * this.personalScale;
        const lev3PlatformHeight = this.mapHeight - 800 * this.personalScale;

        for (let i = 0; i < 2; i++) {
            this.platforms.create(100 * this.personalScale + this.boxWidth * i, lev3PlatformHeight, 'box')
                .setScale(this.personalScale)
                .refreshBody();
        }

        for (let i = 0; i < 3; i++) {
            this.platforms.create(300 * this.personalScale + this.boxWidth * i, lev1PlatformHeight, 'box')
                .setScale(this.personalScale)
                .refreshBody();
        }

        this.platforms.create(600 * this.personalScale, lev2PlatformHeight, 'box').setScale(this.personalScale).refreshBody();

        for (let i = 0; i < 4; i++) {
            this.platforms.create(800 * this.personalScale + this.boxWidth * i, lev2PlatformHeight, 'box')
                .setScale(this.personalScale)
                .refreshBody();
        }

        this.platforms.create(1300 * this.personalScale + this.boxWidth * 0, lev3PlatformHeight, 'box').setScale(this.personalScale).refreshBody();

        for (let i = 0; i < 3; i++) {
            this.platforms.create(1700 * this.personalScale + this.boxWidth * i, lev2PlatformHeight, 'box')
                .setScale(this.personalScale)
                .refreshBody();
        }

        for (let i = 0; i < 3; i++) {
            this.platforms.create(2200 * this.personalScale + this.boxWidth * i, lev1PlatformHeight, 'box')
                .setScale(this.personalScale)
                .refreshBody();
        }

        spawnDecor(this, 1, true, 'flower', 0.004 * this.mapWidth, 0, this.mapWidth, gapPercentages, this.mapWidth, gapWidth, this.boxWidth);
        spawnDecor(this, 1, true, 'grass', 0.015 * this.mapWidth, 0, this.mapWidth, gapPercentages, this.mapWidth, gapWidth, this.boxWidth);
        spawnDecor(this, 1, true, 'sunflowers', 10 * this.personalScale, this.mapWidth * 0.6, this.mapWidth * 0.7, gapPercentages, this.mapWidth, gapWidth, this.boxWidth);
        spawnDecor(this, 1, false, 'direction_board', 1, this.mapWidth * 0.35, this.mapWidth * 0.65, gapPercentages, this.mapWidth, gapWidth, this.boxWidth);
        spawnDecor(this, 1, false, 'end_board', 1, this.mapWidth - 300*this.personalScale, this.mapWidth - 300*this.personalScale, gapPercentages, this.mapWidth, gapWidth, this.boxWidth);
        spawnSkull(this, 'skull_1', gapPercentages, gapWidth, this.boxWidth);
        spawnSkull(this, 'skull_1', gapPercentages, gapWidth, this.boxWidth);
        spawnSkull(this, 'skull_2', gapPercentages, gapWidth, this.boxWidth);
        spawnSkull(this, 'skull_3', gapPercentages, gapWidth, this.boxWidth);

        this.player = this.physics.add.sprite(100, 500, 'player');
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        this.player.setScale(this.personalScale * 1.3).refreshBody();
        this.player.setSize(this.player.width * 0.70, this.player.height);
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'player', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'jump',
            frames: [{ key: 'player', frame: 5 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 6, end: 9 }),
            frameRate: 10,
            repeat: -1
        });

        this.strawberryNumber = 5;
        this.strawberries = createIngredients(
            this,
            'strawberry',
            this.strawberryNumber,
            { x: 12, y: 0, stepX: 200 },
            { min: 100, max: this.mapWidth - 350 * this.personalScale },
            { min: 50, max: 300 }
        );

        this.blueberryNumber = 5;
        this.blueberries = createIngredients(
            this,
            'blueberry',
            this.blueberryNumber,
            { x: 12, y: 0, stepX: 200 },
            { min: 100, max: this.mapWidth - 350 * this.personalScale },
            { min: 50, max: 300 }
        );

        this.sugarNumber = 5;
        this.sugar = createIngredients(
            this,
            'sugar',
            this.sugarNumber,
            { x: 12, y: 0, stepX: 200 },
            { min: 100, max: this.mapWidth - 350 * this.personalScale },
            { min: 50, max: 300 }
        );

        spawnDecor(this, 1, true, 'grass', 0.006 * this.mapWidth, 0, this.mapWidth, gapPercentages, this.mapWidth, gapWidth, this.boxWidth);
        spawnDecor(this, 1, true, 'sunflowers', 2 * this.personalScale, this.mapWidth * 0.6, this.mapWidth * 0.7, gapPercentages, this.mapWidth, gapWidth, this.boxWidth);
        
        createAcorns(this, 4, 'FirstScene');
        createMushroom(this, this.mapWidth * 0.85);
        createBoar(this, this.boxWidth, 500 * this.personalScale);

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.strawberries, this.platforms);
        this.physics.add.collider(this.sugar, this.platforms);
        this.physics.add.collider(this.blueberries, this.platforms);
        this.physics.add.collider(this.player, this.deepGrounds);
        this.physics.add.overlap(this.player, this.strawberries, (player, item) => { collectIngredient(this, player, item, 'strawberry', 'FirstScene'); }, null, this);
        this.physics.add.overlap(this.player, this.sugar, (player, item) => { collectIngredient(this, player, item, 'sugar', 'FirstScene'); }, null, this);
        this.physics.add.overlap(this.player, this.blueberries, (player, item) => { collectIngredient(this, player, item, 'blueberry', 'FirstScene'); }, null, this);

        console.log("personalScale: ", this.personalScale);

        createScores(this);

        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.cursors = this.input.keyboard.createCursorKeys();
  
        createMovementButtons(this);
        const volumeButton = createVolumeButton(this);
        createLives(this, volumeButton.height);
    }

    update() {
        if (this.gameOver || this.victory) return;

        if (!this.input.activePointer.isDown) {
            this.isMovingLeft = false;
            this.isMovingRight = false;
            this.isJumping = false;
        }

        if (this.cursors.left.isDown || this.isMovingLeft) {
            this.player.setVelocityX(-500 * this.personalScale);
            if (this.player.body.touching.down)
                this.player.anims.play('left', true);
            else
                this.player.anims.play('jump');
        }
        else if (this.cursors.right.isDown || this.isMovingRight) {
            this.player.setVelocityX(500 * this.personalScale);
            if (this.player.body.touching.down)
                this.player.anims.play('right', true);
            else
                this.player.anims.play('jump');
        }
        else {
            this.player.setVelocityX(0);
            if (this.player.body.touching.down)
                this.player.anims.play('turn');
            else
                this.player.anims.play('jump');
        }

        if ((this.cursors.up.isDown || this.spaceKey.isDown || this.isJumping) && this.player.body.touching.down) {
            this.player.setVelocityY(-1100 * this.personalScale);
            this.jumpSound.play();
            this.player.anims.play('jump');
        }

        //burroni 
        if (this.player.y > this.screenHeight - this.player.displayHeight) {
            die(this, 'FirstScene');
            this.hearts.forEach((heart) => {
                heart.setTexture('emptyHeart');
            }); 
        }

        if (this.player.x > this.mapWidth - 300 * this.personalScale){
            this.gameOver = true;
            this.isInvincible = true;
            this.input.keyboard.removeAllKeys(true);
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
            this.player.anims.stop();
            if (this.music && this.music.isPlaying) {
                this.music.stop();
            }
            if (this.sugarCollected < this.sugarNumber ||
                this.strawberryCollected < this.strawberryNumber ||
                this.blueberryCollected < this.blueberryNumber){
                this.time.delayedCall(1000, () => {
                    this.cameras.main.fadeOut(800, 0, 0, 0);
                    this.time.delayedCall(800, () => {
                        this.scene.start('GameOverScene', { callingScene: "FirstScene", reason: "failed" });
                    });
                });
            }
            else {
                win(this, "FirstScene");
            }
        }

        updateAcorns(this);
        updateIngredients(this, this.strawberries, { min: 100 * this.personalScale, max: this.mapWidth - 100 * this.personalScale });
        updateIngredients(this, this.sugar, { min: 100 * this.personalScale, max: this.mapWidth - 100 * this.personalScale });
        updateIngredients(this, this.blueberries, { min: 100 * this.personalScale, max: this.mapWidth - 100 * this.personalScale });
        updateBoar(this, 100 * this.personalScale, this.mapWidth - 100 * this.personalScale);
    }
}

export default FirstScene;