class FirstScene extends Phaser.Scene {

    constructor(){
        super({key: 'FirstScene'});
    }

    create() {
        this.scale.refresh();
        this.mapWidth = this.scale.width * 3;
        this.mapHeight = this.scale.height;
        this.physics.world.setBounds(0, 0, this.mapWidth, this.mapHeight); // Espande la larghezza del mondo
        this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
        this.cameras.main.fadeIn(800, 0, 0, 0); // 1000ms di transizione dal nero alla scena
        this.lives = 3;
        this.player;
        this.ingredients;
        this.strawberries = 0;
        this.bombs;
        this.platforms;
        this.cursors;
        this.isInvincible = false;
        this.gameOver = false;
        this.victory = false;
        this.scoreText;
        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.isJumping = false;
        this.screenHeight = this.scale.height;
        this.screenWidth = this.scale.width;
        console.log('screenWidth: ' + this.screenWidth);
        console.log('screenHeight: ' + this.screenHeight);
        this.personalScale = (this.screenHeight + this.screenWidth)/2000;

        this.collectSound = this.sound.add('collect', { loop: false, volume: 0.05 });
        this.gameOverSound = this.sound.add('gameOver');  
        this.jumpSound = this.sound.add('jump');
        this.music = this.sound.add('soundtrack', { loop: true, volume: 0.5 });
        this.music.play();
        
        this.add.image(this.mapWidth / 2, this.mapHeight / 2, 'sky').setDisplaySize(this.mapWidth, this.mapHeight);


        if (this.scale.isPortrait) {
            this.mapHeight = this.mapHeight * 0.75;  // Occupa solo metà schermo in altezza
        }

        console.log('mapWidth: ' + this.mapWidth);
        console.log('mapHeight: ' + this.mapHeight);

        this.platforms = this.physics.add.staticGroup();
        let platformWidth = 101;
        
        let numPlatforms = Math.ceil(this.mapWidth / platformWidth);
        for (let i = 0; i < numPlatforms; i++) {
            this.platforms.create(i * platformWidth + platformWidth / 2, this.mapHeight - platformWidth/2, 'ground');
        }

        let numRows = Math.ceil((this.screenHeight - (this.mapHeight - platformWidth / 2)) / platformWidth);
        for (let row = 1; row <= numRows; row++) {
            for (let i = 0; i < numPlatforms; i++) {
                this.add.image(i * platformWidth + platformWidth / 2, this.mapHeight - platformWidth / 2 + row * platformWidth, 'deepGround');
            }
        }

        this.platforms.create(579, this.mapHeight - 350, 'box');
        this.platforms.create(478, this.mapHeight - 350, 'box');
        this.platforms.create(62, this.mapHeight - 500, 'box');
        this.platforms.create(750, this.mapHeight - 600, 'box');
        this.platforms.create(163, this.mapHeight - 500, 'box');
        
        this.player = this.physics.add.sprite(100, 400, 'player');
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
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

        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.cursors = this.input.keyboard.createCursorKeys();

        this.ingredients = this.physics.add.group({
            key: 'strawberry',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        this.ingredients.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.bombs = this.physics.add.group();
        console.log("personalScale:");
        console.log(this.personalScale);
        const fontSize = 30 * this.personalScale;
        this.scoreText = this.add.text(20*this.personalScale, this.screenHeight * 0.08, 'Score: 0/30', { 
            fontFamily: 'PressStart2P', 
            fontSize: fontSize, 
            fill: '#fff' 
        }).setScrollFactor(0);

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.ingredients, this.platforms);
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.overlap(this.player, this.ingredients, this.collectStrawberry, null, this);
        this.physics.add.overlap(this.player, this.bombs, this.takeDamage, null, this);

        const buttonWidth = 101;
        let buttonSize = this.personalScale;
        let buttonY = this.screenHeight * 0.8;
        let buttonLeft = this.add.image(this.screenWidth - 2.1*this.personalScale*buttonWidth, buttonY, 'buttonLeft').setInteractive().setScrollFactor(0);
        buttonLeft.setScale(buttonSize);

        let buttonRight = this.add.image(this.screenWidth - this.personalScale*buttonWidth, buttonY, 'buttonRight').setInteractive().setScrollFactor(0);
        buttonRight.setScale(buttonSize);

        let buttonUp = this.add.image(this.personalScale*buttonWidth, buttonY, 'buttonUp').setInteractive().setScrollFactor(0);
        buttonUp.setScale(buttonSize);

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
            }
        });

        buttonUp.on('pointerup', () => {
            this.isJumping = false;
        })

        this.hearts = [];
        let heartX = 30;
        let heartY = 80;
        let heartSpacing = 80; // Distanza tra i cuori

        // Crea e memorizza le immagini dei cuori
        for (let i = 0; i < 3; i++) {
            let heart = this.add.image(heartX + i * heartSpacing, heartY, 'heart').setOrigin(0, 0).setScrollFactor(0);
            this.hearts.push(heart);
        }


        //BOTTONE VOLUME
        this.volumeStates = ['mute', 'low', 'high'];
        this.currentVolumeState = 0; // 0 = high, 1 = low, 2 = mute
        this.volumeIcons = {
            high: 'volume_high',
            low: 'volume_low',
            mute: 'volume_mute'
        };
        this.volumeLevels = {
            high: 0.5,
            low: 0.1,
            mute: 0.0
        };

        this.volumeButton = this.add.image(this.screenWidth - 30*this.personalScale-80, this.screenHeight * 0.05, this.volumeIcons.mute).setInteractive().setScrollFactor(0);

        this.sound.setVolume(this.volumeLevels.mute);

        this.volumeButton.on('pointerdown', () => {
            this.currentVolumeState = (this.currentVolumeState + 1) % this.volumeStates.length;
            const newState = this.volumeStates[this.currentVolumeState];
            this.volumeButton.setTexture(this.volumeIcons[newState]);
            this.sound.setVolume(this.volumeLevels[newState]);}
        );
    }

    update() {
        if (this.gameOver || this.victory) return;

        if (this.cursors.left.isDown || this.isMovingLeft) {
            this.player.setVelocityX(-500);
            if(this.player.body.touching.down)
                this.player.anims.play('left', true);
            else 
                this.player.anims.play('jump');
        } 
        else if (this.cursors.right.isDown || this.isMovingRight) {
            this.player.setVelocityX(500);
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

        if ((this.cursors.up.isDown || this.spaceKey.isDown || this.isJumping) && this.player.body.touching.down) {
            this.player.setVelocityY(-1000);
            this.jumpSound.play();
            this.player.anims.play('jump');
        }
    }

    collectStrawberry(player, strawberry) {
        this.collectSound.play();
        strawberry.disableBody(true, true);
        this.strawberries += 1;
        this.scoreText.setText('Score: ' + this.strawberries + '/30');

        if (this.strawberries >=30){
            this.win();
        }

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

    takeDamage(player, bomb) {
        if (this.lives > 0 && !this.isInvincible) {
            this.lives--;
            this.hearts[this.lives].setTexture('emptyHeart');

            this.player.setTint(0xffff00);

            this.cameras.main.shake(300, 0.005);

            this.isInvincible = true;

            this.time.delayedCall(500, () => {
                this.player.clearTint();
                this.isInvincible = false;
            });

            if (this.lives === 0) {
                this.die();
            }
        }
    }
    

    die() { 
        this.gameOver = true;
        this.isInvincible = true;     
        this.input.keyboard.removeAllKeys(true);
        this.player.setVelocityX(0);
        this.player.anims.play('turn');
        this.player.anims.stop();
        this.player.setTintFill(0xff0000);
        if (this.music && this.music.isPlaying) {
            this.music.stop();
        }
        this.gameOverSound.play();

        this.time.delayedCall(1000, () => {
            this.cameras.main.fadeOut(800, 0, 0, 0);
            this.time.delayedCall(800, () => {
                this.scene.start('GameOverScene');
            });
        });
    }

    win() { 
        this.victory = true;
        this.isInvincible = true;     
        this.input.keyboard.removeAllKeys(true);
        this.player.setVelocityX(0);
        this.player.anims.play('turn');
        this.player.anims.stop();
        this.time.delayedCall (1000, () => {
            if (this.music && this.music.isPlaying) {
                this.music.stop();
            }
            //this.gameOverSound.play();

            this.time.delayedCall(1000, () => {
                this.cameras.main.fadeOut(800, 0, 0, 0);
                this.time.delayedCall(800, () => {
                    this.scene.start('VictoryScene');
                });
            });
        })
    }
}

export default FirstScene;