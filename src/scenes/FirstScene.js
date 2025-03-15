class FirstScene extends Phaser.Scene {

    constructor(){
        super({key: 'FirstScene'});
    }

    create() {
        this.scale.refresh();
        this.mapWidth = this.scale.width * 3;
        this.mapHeight = this.scale.height;
        this.screenHeight = this.scale.height;
        this.screenWidth = this.scale.width;
        if (this.screenHeight > this.screenWidth) {
            this.mapHeight = this.mapHeight * 0.75;
        }
        this.personalScale = this.mapHeight/1100;
        this.scaledWidth = this.mapWidth/6000;
        this.margin = this.personalScale * 70;
        this.physics.world.setBounds(0, 0, this.mapWidth, this.mapHeight); // Espande la larghezza del mondo
        this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
        this.cameras.main.fadeIn(800, 0, 0, 0); // 1000ms di transizione dal nero alla scena
        this.lives = 3;
        this.player;
        this.strawberries;
        this.sugar;
        this.sugarCollected = 0;
        this.strawberriesCollected = 0;
        this.blueberriesCollected = 0;
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

        this.collectSound = this.sound.add('collect', { loop: false, volume: 0.08 });
        this.gameOverSound = this.sound.add('gameOver', { loop: false, volume: 0.3 });  
        this.jumpSound = this.sound.add('jump', { loop: false, volume: 0.3 });
        this.music = this.sound.add('soundtrack', { loop: true, volume: 0.5 });
        this.music.play();
        
        this.add.image(this.mapWidth / 2, this.mapHeight / 2, 'sky').setDisplaySize(this.mapWidth, this.mapHeight);

        console.log('screenWidth: ' + this.screenWidth);
        console.log('screenHeight: ' + this.screenHeight);
        console.log('mapWidth: ' + this.mapWidth);
        console.log('mapHeight: ' + this.mapHeight);

        this.platforms = this.physics.add.staticGroup();
        let platformWidth = 99 * this.personalScale;
        
        let numPlatforms = Math.ceil(this.mapWidth / platformWidth);
        for (let i = 0; i < numPlatforms; i++) {
            this.platforms.create(i * platformWidth + platformWidth / 2, this.mapHeight - platformWidth/2, 'ground').setScale(this.personalScale).refreshBody();
        }

        let numRows = Math.ceil((this.screenHeight - (this.mapHeight - platformWidth / 2)) / platformWidth);
        for (let row = 1; row <= numRows; row++) {
            for (let i = 0; i < numPlatforms; i++) {
                this.add.image(i * platformWidth + platformWidth / 2, this.mapHeight - platformWidth / 2 + row * platformWidth, 'deepGround').setScale(this.personalScale);
            }
        }
        
        const lev1PlatformHeight = this.mapHeight - 400 * this.personalScale;
        const lev2PlatformHeight = this.mapHeight - 600 * this.personalScale;
        const lev3PlatformHeight = this.mapHeight - 800 * this.personalScale;
        const lev4PlatformHeight = this.mapHeight - 1000 * this.personalScale;

        let boxWidth = 100*this.personalScale;

        for (let i = 0; i < 2; i++) {
            this.platforms.create(100*this.personalScale + boxWidth * i, lev3PlatformHeight, 'box')
                .setScale(this.personalScale)
                .refreshBody();
        }

        for (let i = 0; i < 3; i++) {
            this.platforms.create(300*this.personalScale + boxWidth * i, lev1PlatformHeight, 'box')
                .setScale(this.personalScale)
                .refreshBody();
        }

        this.platforms.create(600*this.personalScale, lev2PlatformHeight, 'box').setScale(this.personalScale).refreshBody();

        for (let i = 0; i < 4; i++) {
            this.platforms.create(800*this.personalScale + boxWidth * i, lev2PlatformHeight, 'box')
                .setScale(this.personalScale)
                .refreshBody();
        }

        this.platforms.create(1300*this.personalScale + boxWidth * 0, lev3PlatformHeight, 'box').setScale(this.personalScale).refreshBody();
        this.platforms.create(1300*this.personalScale + boxWidth * 2, lev4PlatformHeight, 'box').setScale(this.personalScale).refreshBody();

        for (let i = 0; i < 3; i++) {
            this.platforms.create(1700*this.personalScale + boxWidth * i, lev2PlatformHeight, 'box')
                .setScale(this.personalScale)
                .refreshBody();
        }

        for (let i = 0; i < 10; i++) {
            this.platforms.create(2200*this.personalScale + boxWidth * i, lev1PlatformHeight, 'box')
                .setScale(this.personalScale)
                .refreshBody();
        }
        
        this.player = this.physics.add.sprite(100, 500, 'player');
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
        this.player.setScale(this.personalScale * 1.3).refreshBody();
        this.player.setSize(this.player.width * 0.75, this.player.height);
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

        this.blueberryNumber = 5;
        this.blueberries = this.physics.add.group({
            key: 'blueberry',
            repeat: (this.blueberryNumber-1),
            setXY: { x: 12, y: 0, stepX: 200 }
        });
        
        this.blueberries.children.iterate((blueberry) => {
            blueberry.x = Phaser.Math.Between(100, this.mapWidth - 100);
            blueberry.y = Phaser.Math.Between(50, 300);
            blueberry.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            blueberry.setScale(this.personalScale*0.95).refreshBody();
        });

        this.strawberryNumber = 5;
        this.strawberries = this.physics.add.group({
            key: 'strawberry',
            repeat: (this.strawberryNumber-1),
            setXY: { x: 12, y: 0, stepX: 200 }
        });
        
        this.strawberries.children.iterate((strawberry) => {
            strawberry.x = Phaser.Math.Between(100, this.mapWidth - 100);
            strawberry.y = Phaser.Math.Between(50, 300);
            strawberry.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            strawberry.setScale(this.personalScale*0.95).refreshBody();
        });

        this.sugarNumber = 5; 
        this.sugar = this.physics.add.group({
            key: 'sugar',
            repeat: (this.sugarNumber-1),
            setXY: { x: 150, y: 0, stepX: 250 }
        });
        this.sugar.children.iterate((sugar) => {
            sugar.x = Phaser.Math.Between(100*this.personalScale, this.mapWidth - 100*this.personalScale);
            sugar.y = Phaser.Math.Between(50*this.personalScale, 300*this.personalScale);
            sugar.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            sugar.setScale(this.personalScale*0.95).refreshBody();
        });

        this.acorns = this.physics.add.group();

        for (let i = 0; i < 2; i++){
            var x = Phaser.Math.Between(100, this.mapWidth-100*this.personalScale);
            var acorn = this.acorns.create(x, 16, 'acorn');
            acorn.setBounce(1);
            acorn.setScale(this.personalScale).refreshBody();
            acorn.setCollideWorldBounds(true);
            acorn.setVelocity(Phaser.Math.Between(-200*this.personalScale, 200*this.personalScale), 20*this.personalScale);
            acorn.allowGravity = false;
        }

        for (let i = 0; i < 10; i++) {
            const x = Phaser.Math.Between(0, this.mapWidth); // Posizione X casuale
            let flower = this.add.image(x, this.mapHeight - boxWidth, 'flower').setOrigin(0.5, 1).setScale(this.personalScale);
            if (Phaser.Math.Between(0, 1) === 0) {
                flower.setScale(-Math.abs(this.personalScale), this.personalScale); // Specchiala orizzontalmente
            }
        }
        
        // Aggiungi 20 erbe in posizioni casuali
        for (let i = 0; i < 40; i++) {
            const x = Phaser.Math.Between(0, this.mapWidth); // Posizione X casuale
            let grass = this.add.image(x, this.mapHeight - boxWidth, 'grass').setOrigin(0.5, 1).setScale(this.personalScale); 
            if (Phaser.Math.Between(0, 1) === 0) {
                grass.setScale(-Math.abs(this.personalScale), this.personalScale); // Specchiala orizzontalmente
            }
        }

        //fungo
        this.mushroom = this.physics.add.sprite(this.mapWidth*0.8, this.mapHeight - boxWidth, 'mushroom').setOrigin(0.5,1);
        this.mushroom.setScale(this.personalScale * 1.2).refreshBody();
        this.mushroom.body.setAllowGravity(false);

        // cinghiale 
        this.boar = this.physics.add.sprite(500*this.personalScale, this.mapHeight - boxWidth-1, 'boar').setOrigin(0.5,1); // 500 è un'altezza iniziale da regolare
        this.boar.setScale(this.personalScale * 1.2).refreshBody();
        this.boar.setCollideWorldBounds(false);  // Non vogliamo che si fermi ai limiti del mondo
        this.boar.body.setAllowGravity(false);

        // Creazione animazione cinghiale
        this.anims.create({
            key: 'boarRun',
            frames: this.anims.generateFrameNumbers('boar', { start: 0, end: 2 }), // 3 frame
            frameRate: 10,  // Velocità animazione
            repeat: -1 // Loop infinito
        });
        this.boar.play('boarRun');
        this.boar.setVelocityX(400 * this.personalScale);  
        this.boar.setFlipX(false);  
        this.boarDirection = 1;

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.strawberries, this.platforms);
        this.physics.add.collider(this.sugar, this.platforms);
        this.physics.add.collider(this.blueberries, this.platforms);
        this.physics.add.collider(this.acorns, this.platforms);
        this.physics.add.overlap(this.player, this.strawberries, this.collectStrawberries, null, this);
        this.physics.add.overlap(this.player, this.sugar, this.collectSugar, null, this);
        this.physics.add.overlap(this.player, this.blueberries, this.collectBlueberries, null, this);
        this.physics.add.overlap(this.player, this.acorns, this.takeDamage, null, this);
        this.physics.add.collider(this.boar, this.platforms);
        this.physics.add.overlap(this.player, this.boar, this.hitBoarOrMushroom, null, this);
        this.physics.add.collider(this.mushroom, this.platforms);
        this.physics.add.collider(this.player, this.mushroom, this.hitBoarOrMushroom, null, this);

        console.log("personalScale: ", this.personalScale);
        console.log("player.displayHeight: ", this.player.displayHeight);
        
        const fontSize = 40 * this.personalScale;
        console.log("fontsize: " , fontSize);

        this.strText = this.add.text(50*this.personalScale + 1.5*this.margin, this.margin + fontSize/2, '0/' + this.strawberryNumber, { 
            fontFamily: 'PressStart2P', 
            fontSize: fontSize, 
            fill: '#fff' 
        }).setOrigin(0, 0.5).setScrollFactor(0);
        let strawberryIcon = this.add.image(this.margin, this.strText.y + 5*this.personalScale, 'strawberry').setOrigin(0, 0.5).setScrollFactor(0).setScale(this.personalScale*0.85);
        strawberryIcon.angle = -40;

        this.sugText = this.add.text(50*this.personalScale + 1.5*this.margin, this.margin*1.5 + fontSize*1.5, '0/' + this.sugarNumber, { 
            fontFamily: 'PressStart2P', 
            fontSize: fontSize, 
            fill: '#fff' 
        }).setOrigin(0, 0.5).setScrollFactor(0);
        let sugarIcon = this.add.image(this.margin, this.sugText.y, 'sugar').setOrigin(0, 0.5).setScrollFactor(0).setScale(this.personalScale*0.85);
        sugarIcon.angle = -10;

        this.bluebText = this.add.text(50*this.personalScale + 1.5*this.margin, this.margin*2 + fontSize*2.5, '0/' + this.blueberryNumber, { 
            fontFamily: 'PressStart2P', 
            fontSize: fontSize, 
            fill: '#fff' 
        }).setOrigin(0, 0.5).setScrollFactor(0);
        let blueberryIcon = this.add.image(this.margin, this.bluebText.y - 5*this.personalScale, 'blueberry').setOrigin(0, 0.5).setScrollFactor(0).setScale(this.personalScale*0.85);
        blueberryIcon.angle = 10;
        
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.cursors = this.input.keyboard.createCursorKeys();
        
        if (this.screenHeight > this.screenWidth){
            const buttonWidth = 101*this.personalScale;
            let buttonSize = this.personalScale;
            let buttonY = this.screenHeight * 0.8;
            let buttonLeft = this.add.image(this.screenWidth - 2.1*buttonWidth, buttonY, 'buttonLeft').setInteractive().setScrollFactor(0);
            buttonLeft.setScale(buttonSize);

            let buttonRight = this.add.image(this.screenWidth - buttonWidth, buttonY, 'buttonRight').setInteractive().setScrollFactor(0);
            buttonRight.setScale(buttonSize);

            let buttonUp = this.add.image(buttonWidth, buttonY, 'buttonUp').setInteractive().setScrollFactor(0);
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

        this.volumeButton = this.add.image(this.screenWidth - this.margin/2, this.margin/2, this.volumeIcons.low).setInteractive().setOrigin(1,0).setScale(this.personalScale).setScrollFactor(0);

        this.sound.setVolume(this.volumeLevels.low);

        this.volumeButton.on('pointerdown', () => {
            this.currentVolumeState = (this.currentVolumeState + 1) % this.volumeStates.length;
            const newState = this.volumeStates[this.currentVolumeState];
            this.volumeButton.setTexture(this.volumeIcons[newState]);
            this.sound.setVolume(this.volumeLevels[newState]);}
        );

        this.hearts = [];
        let heartX = this.screenWidth - this.margin;
        let heartY = this.volumeButton.height * this.personalScale + this.margin;
        let heartSpacing = this.margin + 10 * this.personalScale; // Distanza tra i cuori

        // Crea e memorizza le immagini dei cuori
        for (let i = 0; i < 3; i++) {
            let heart = this.add.image(heartX - i * heartSpacing, heartY, 'heart').setOrigin(1, 0).setScale(this.personalScale).setScrollFactor(0);
            this.hearts.push(heart);
        }
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
            if(this.player.body.touching.down)
                this.player.anims.play('left', true);
            else 
                this.player.anims.play('jump');
        } 
        else if (this.cursors.right.isDown || this.isMovingRight) {
            this.player.setVelocityX(500 * this.personalScale);
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
            this.player.setVelocityY(-1200 * this.personalScale);
            this.jumpSound.play();
            this.player.anims.play('jump');
        }


        // cinghiale
        
        if (this.boar.x >= this.mapWidth-100) {
            this.boar.setVelocityX(-400 * this.personalScale);  // Inverti direzione a sinistra
            this.boar.setFlipX(true);  // Rovescia immagine orizzontalmente
        } else if (this.boar.x <= 100) {
            this.boar.setVelocityX(400 * this.personalScale);  // Inverti direzione a destra
            this.boar.setFlipX(false);  // Torna all'orientamento normale
        }
    }

    collectSugar(player, sugar) {
        this.collectSound.play();
        sugar.disableBody(true, true);
        this.sugarCollected += 1;
        this.sugText.setText(this.sugarCollected + '/' + this.sugarNumber);

        if (this.sugarCollected >= this.sugarNumber && this.strawberriesCollected >= this.strawberryNumber && this.blueberriesCollected >= this.blueberryNumber){
            this.win();
        }
    }

    collectStrawberries(player, strawberries) {
        this.collectSound.play();
        strawberries.disableBody(true, true);
        this.strawberriesCollected += 1;
        this.strText.setText(this.strawberriesCollected + '/' + this.strawberryNumber);

        if (this.strawberriesCollected >= this.strawberryNumber && this.sugarCollected >= this.sugarNumber && this.blueberriesCollected >= this.blueberryNumber){
            this.win();
        }
    }  

    collectBlueberries(player, blueberries) {
        this.collectSound.play();
        blueberries.disableBody(true, true);
        this.blueberriesCollected += 1;
        this.bluebText.setText(this.blueberriesCollected + '/' + this.blueberryNumber);

        if (this.strawberriesCollected >= this.strawberryNumber && this.sugarCollected >= this.sugarNumber && this.blueberriesCollected >= this.blueberryNumber){
            this.win();
        }
    }

    hitBoarOrMushroom(player, enemy){
        if (player.body.y + (player.body.height)/2 < enemy.body.y) {
            player.setVelocityY(-1000 * this.personalScale);
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