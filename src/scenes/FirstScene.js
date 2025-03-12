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
        this.strawberries;
        this.sugar;
        this.sugarCollected = 0;
        this.strawberriesCollected = 0;
        this.acorns;
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
        const scene = this;
        this.personalScale = (this.screenHeight + this.screenWidth)/1500;

        this.collectSound = this.sound.add('collect', { loop: false, volume: 0.05 });
        this.gameOverSound = this.sound.add('gameOver');  
        this.jumpSound = this.sound.add('jump');
        this.music = this.sound.add('soundtrack', { loop: true, volume: 0.5 });
        this.music.play();
        
        this.add.image(this.mapWidth / 2, this.mapHeight / 2, 'sky').setDisplaySize(this.mapWidth, this.mapHeight);
        console.log('mapWidth: ' + this.mapWidth);
        console.log('mapHeight: ' + this.mapHeight);

        if (this.screenHeight > this.screenWidth) {
            this.mapHeight = this.mapHeight * 0.75;  // Occupa solo metà schermo in altezza
        }

        this.platforms = this.physics.add.staticGroup();
        let platformWidth = 100;
        
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
   
        this.platforms.create(478, this.mapHeight - 350, 'box');
        this.platforms.create(578, this.mapHeight - 350, 'box');
        this.platforms.create(62, this.mapHeight - 500, 'box');
        this.platforms.create(162, this.mapHeight - 500, 'box');
        this.platforms.create(750, this.mapHeight - 600, 'box');

        this.platforms.create(1500, this.mapHeight - 400, 'box');
        this.platforms.create(1600, this.mapHeight - 400, 'box');
        this.platforms.create(1700, this.mapHeight - 400, 'box');
        this.platforms.create(1800, this.mapHeight - 400, 'box');
        
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

        this.strawberries = this.physics.add.group({
            key: 'strawberry',
            repeat: 9,
            setXY: { x: 12, y: 0, stepX: 200 }
        });
        
        this.strawberries.children.iterate(function (strawberry) {
            strawberry.x = Phaser.Math.Between(100, scene.mapWidth - 100);
            strawberry.y = Phaser.Math.Between(50, 300);
            strawberry.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.sugar = this.physics.add.group({
            key: 'sugar',
            repeat: 4,
            setXY: { x: 150, y: 0, stepX: 250 }
        });
        this.sugar.children.iterate(function (sugar) {
            sugar.x = Phaser.Math.Between(100, scene.mapWidth - 100);
            sugar.y = Phaser.Math.Between(50, 300);
            sugar.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        //fungo
        this.mushroom = this.physics.add.sprite(2300, this.mapHeight*0.75, 'mushroom');
        this.mushroom.setScale(this.personalScale);
        this.mushroom.setGravityY(500);



        // cinghiale 
        this.boar = this.physics.add.sprite(500, this.mapHeight*0.75, 'boar'); // 500 è un'altezza iniziale da regolare
        this.boar.setScale(this.personalScale);
        this.boar.setCollideWorldBounds(false);  // Non vogliamo che si fermi ai limiti del mondo
        this.boar.setGravityY(500);  // Imposta la gravità in modo che cada sul terreno

        // Creazione animazione cinghiale
        this.anims.create({
            key: 'boarRun',
            frames: this.anims.generateFrameNumbers('boar', { start: 0, end: 2 }), // 3 frame
            frameRate: 10,  // Velocità animazione
            repeat: -1 // Loop infinito
        });
        this.boar.play('boarRun');
        this.boar.setVelocityX(400);  
        this.boar.setFlipX(false);  
        this.boarDirection = 1;

        this.acorns = this.physics.add.group();

        for (let i = 0; i < 2; i++){
            var x = Phaser.Math.Between(100, this.mapWidth-100);
            var acorn = this.acorns.create(x, 16, 'acorn');
            acorn.setBounce(1);
            acorn.setCollideWorldBounds(true);
            acorn.setVelocity(Phaser.Math.Between(-200, 200), 20);
            acorn.allowGravity = false;
        }


        console.log("personalScale:");
        console.log(this.personalScale);
        const fontSize = 30 * this.personalScale;

        let strawberryIcon = this.add.image(20, this.screenHeight * 0.1, 'strawberry').setOrigin(0, 0).setScrollFactor(0);
        strawberryIcon.angle = -40;
        this.strText = this.add.text(20*this.personalScale + 120, this.screenHeight * 0.1 -10, '0/10', { 
            fontFamily: 'PressStart2P', 
            fontSize: fontSize, 
            fill: '#fff' 
        }).setOrigin(0, 0).setScrollFactor(0);

        let sugarIcon = this.add.image(40, this.screenHeight * 0.15, 'sugar').setOrigin(0, 0).setScrollFactor(0);
        sugarIcon.angle = -10;
        this.sugText = this.add.text(20*this.personalScale + 120, this.screenHeight * 0.15 -10, '0/10', { 
            fontFamily: 'PressStart2P', 
            fontSize: fontSize, 
            fill: '#fff' 
        }).setOrigin(0, 0).setScrollFactor(0);

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.strawberries, this.platforms);
        this.physics.add.collider(this.sugar, this.platforms);
        this.physics.add.collider(this.acorns, this.platforms);
        this.physics.add.overlap(this.player, this.strawberries, this.collectStrawberries, null, this);
        this.physics.add.overlap(this.player, this.sugar, this.collectSugar, null, this);
        this.physics.add.overlap(this.player, this.acorns, this.takeDamage, null, this);
        this.physics.add.collider(this.boar, this.platforms);
        this.physics.add.overlap(this.player, this.boar, this.hitBoarOrMushroom, null, this);
        this.physics.add.collider(this.mushroom, this.platforms);
        this.physics.add.collider(this.player, this.mushroom, this.hitBoarOrMushroom, null, this); // Non vogliamo che si fermi ai limiti del mondo
        
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.cursors = this.input.keyboard.createCursorKeys();

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
        let heartX = this.screenWidth - 90;
        let heartY = this.screenHeight * 0.14;
        let heartSpacing = 80; // Distanza tra i cuori

        // Crea e memorizza le immagini dei cuori
        for (let i = 0; i < 3; i++) {
            let heart = this.add.image(heartX - i * heartSpacing, heartY, 'heart').setOrigin(1, 0).setScrollFactor(0);
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

        this.volumeButton = this.add.image(this.screenWidth - 30*this.personalScale-80, this.screenHeight * 0.1, this.volumeIcons.mute).setInteractive().setScrollFactor(0);

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

        if (!this.input.activePointer.isDown) {
            this.isMovingLeft = false;
            this.isMovingRight = false;
        }

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


        // cinghiale

        if (this.boar.x >= this.mapWidth-100) {
            this.boar.setVelocityX(-400);  // Inverti direzione a sinistra
            this.boar.setFlipX(true);  // Rovescia immagine orizzontalmente
        } else if (this.boar.x <= 100) {
            this.boar.setVelocityX(400);  // Inverti direzione a destra
            this.boar.setFlipX(false);  // Torna all'orientamento normale
        }
    }

    collectSugar(player, sugar) {
        this.collectSound.play();
        sugar.disableBody(true, true);
        this.sugarCollected += 1;
        this.sugText.setText(this.sugarCollected + '/5');

        if (this.sugarCollected >=5 && this.strawberriesCollected >= 10){
            this.win();
        }
    }

    collectStrawberries(player, strawberries) {
        this.collectSound.play();
        strawberries.disableBody(true, true);
        this.strawberriesCollected += 1;
        this.strText.setText(this.strawberriesCollected + '/10');

        if (this.strawberriesCollected >=10 && this.sugarCollected >=5){
            this.win();
        }
    }  

    hitBoarOrMushroom(player, enemy){
        if (player.body.y + (player.body.height)/2 < enemy.body.y) {
            player.setVelocityY(-1000);
            if (enemy.texture.key === 'mushroom') { 
                enemy.setTexture('mushroom_smashed');
                this.time.delayedCall(100, () => enemy.destroy(), [], this);
            }
        }
        else {
            this.takeDamage(player, enemy);
        }
    }
    takeDamage(player, enemy) {
        if (this.lives > 0 && !this.isInvincible) {
            this.lives--;
            this.hearts[this.lives].setTexture('emptyHeart');
            this.player.setTint(0xffff00);
            this.cameras.main.shake(300, 0.005);
            this.isInvincible = true;

            this.time.delayedCall(1500, () => {
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