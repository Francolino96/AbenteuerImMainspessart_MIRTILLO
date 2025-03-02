class FirstScene extends Phaser.Scene {

    constructor(){
        super({key: 'FirstScene'});
    }

    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/Sprites_ground.png');
        this.load.image('box', 'assets/Sprites_box.png');
        this.load.image('star', 'assets/Sprites_strawberry.png');
        this.load.image('bomb', 'assets/Sprites_acorn.png');
        this.load.spritesheet('player', 'assets/Sprites_player_m.png', { frameWidth: 66.7, frameHeight: 101 });

        // bottoni touch
        this.load.image('buttonRight', 'assets/Sprites_arrow-button.png');
        this.load.image('buttonLeft', 'assets/Sprites_arrow-button.png');
        this.load.image('buttonUp', 'assets/Sprites_arrow-button.png');
        this.load.image('fullscreenIcon', 'assets/Sprites_boar.png');

        // audio
        this.load.audio('soundtrack', 'sounds/soundtrack.mp3');
        this.load.audio('jump', 'sounds/jump.mp3');
        this.load.audio('collect', 'sounds/coin.mp3');
        this.load.audio('gameOver', 'sounds/gameOver.mp3');
        this.load.audio('gameStart', 'sounds/gameStart.mp3');
    }

    create() {
        this.player;
        this.ingredients;
        this.bombs;
        this.platforms;
        this.score = 0;
        this.cursors;
        this.gameOver = false;
        this.scoreText;
        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.isJumping = false;
        this.personalScale = (this.scale.height + this.scale.width)/2000;
        
        let music = this.sound.add('soundtrack', { loop: true, volume: 0.5 });
        music.play();
        let jumpSound = this.sound.add('jump');
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'sky').setDisplaySize(this.scale.width, this.scale.height);

        this.platforms = this.physics.add.staticGroup();
        let platformWidth = 101;
        let numPlatforms = Math.ceil(this.scale.width / platformWidth);

        for (let i = 0; i < numPlatforms; i++) {
            this.platforms.create(i * platformWidth + platformWidth / 2, this.scale.height-platformWidth/2, 'ground');
        }

        this.platforms.create(600, 400, 'box');
        this.platforms.create(478, 400, 'box');
        this.platforms.create(62, 250, 'box');
        this.platforms.create(750, 220, 'box');
        this.platforms.create(184, 250, 'box');
        
        this.player = this.physics.add.sprite(100, 450, 'player');
        this.player.setScale(this.personalScale);
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
            frames: [ { key: 'player', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'jump',
            frames: [ { key: 'player', frame: 5 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 6, end: 9 }),
            frameRate: 10,
            repeat: -1
        });

        this.cursors = this.input.keyboard.createCursorKeys();

        this.ingredients = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        this.ingredients.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.bombs = this.physics.add.group();
        const fontSize = 32 * this.personalScale;
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: fontSize, fill: '#000' });

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.ingredients, this.platforms);
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.overlap(this.player, this.ingredients, this.collectStar, null, this);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

        let buttonSize = this.personalScale;
        console.log(this.scale.width);
        console.log(this.scale.height);
        let buttonLeft = this.add.image(this.scale.width - 2*this.personalScale*101, this.scale.height - this.personalScale*101, 'buttonLeft').setInteractive();
        buttonLeft.setScale(buttonSize);
        buttonLeft.setFlipX(true); // Specchia l'immagine

        let buttonRight = this.add.image(this.scale.width - this.personalScale*101, this.scale.height - this.personalScale*101, 'buttonRight').setInteractive();
        buttonRight.setScale(buttonSize);

        let buttonUp = this.add.image(this.personalScale*101, this.scale.height - this.personalScale*101, 'buttonUp').setInteractive();
        buttonUp.setScale(buttonSize);
        buttonUp.angle = -90;

        buttonLeft.on('pointerdown', () => {
            console.log("sono nel bottonLeft.on(pointerdown)")
            this.isMovingLeft = true;
        });

        buttonRight.on('pointerdown', () => {
            console.log("sono nel bottonRight.on(pointerdown)")
            this.isMovingRight = true;
        });

        buttonLeft.on('pointerup', () => {
            console.log("sono nel bottonLeft.on(pointerup)")
            this.isMovingLeft = false;
        });

        buttonRight.on('pointerup', () => {
            console.log("sono nel bottonRight.on(pointerup)")
            this.isMovingRight = false;
        });

        buttonUp.on('pointerdown', () => {
            if (this.player.body.touching.down) {
                this.isJumping = true;
                this.player.setVelocityY(-600);
                jumpSound.play();
            }
        });

        buttonUp.on('pointerup', () => {
            this.isJumping = false;
        })
    }

    update() {
        if (this.gameOver) return;

        if (this.cursors.left.isDown || this.isMovingLeft) {
            this.player.setVelocityX(-300);
            if(this.player.body.touching.down)
                this.player.anims.play('left', true);
            else 
                this.player.anims.play('jump');
        } 
        else if (this.cursors.right.isDown || this.isMovingRight) {
            this.player.setVelocityX(300);
            if(this.player.body.touching.down)
                this.player.anims.play('right', true);
            else 
                this.player.anims.play('jump');
        } 
        else {
            this.player.setVelocityX(0);
            if(this.player.body.touching.down)
                this.player.anims.play('turn');
            else 
                this.player.anims.play('jump');
        }

        if ((this.cursors.up.isDown || this.isJumping) && this.player.body.touching.down) {
            this.player.setVelocityY(-600);
            this.player.anims.play('jump');
        }
    }

    collectStar(player, star) {
        star.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        if (this.ingredients.countActive(true) === 0) {
            this.ingredients.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });

            var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            var bomb = this.bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            bomb.allowGravity = false;
        }
    }

    hitBomb(player, bomb) {
        this.physics.pause();
        this.player.setTint(0xff0000);
        this.player.anims.play('turn');
        this.gameOver = true;
    }
}

export default FirstScene;