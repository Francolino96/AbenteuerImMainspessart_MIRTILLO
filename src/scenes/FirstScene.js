class FirstScene extends Phaser.Scene {

    constructor(){
        super({key: 'FirstScene'});
    }

    create() {
        this.scale.refresh();
        this.mapWidth = this.scale.height * 8;
        this.mapHeight = this.scale.height;
        this.screenHeight = this.scale.height;
        this.screenWidth = this.scale.width;
        if (this.screenHeight > this.screenWidth) {
            this.mapHeight = this.mapHeight * 0.75;
        }
        else {
            this.mapHeight = this.mapHeight * 0.85;
        }
        this.personalScale = this.mapHeight/1100;
        this.margin = this.personalScale * 70;
        this.physics.world.setBounds(0, 0, this.mapWidth, this.screenHeight); // Espande la larghezza del mondo
        this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
        this.cameras.main.fadeIn(800, 0, 0, 0); // 1000ms di transizione dal nero alla scena
        this.lives = 3;
        this.player;
        this.strawberries;
        this.sugar;
        this.sugarCollected = 0;
        this.strawberryCollected = 0;
        this.blueberryCollected = 0;
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
        this.jumpOverSound = this.sound.add('jumpOver', { loop: false, volume: 0.3 });
        this.popSound = this.sound.add('pop', {loop: false, volume: 0.5});
        this.boarSound = this.sound.add('boar', {loop: false, volume: 0.5});
        this.music = this.sound.add('soundtrack', { loop: true, volume: 0.1 });
        this.music.play();
        
        //this.add.image(this.mapWidth / 2, this.mapHeight / 2, 'sky').setDisplaySize(this.mapWidth, this.screenHeight);
        let bgSource = this.textures.get('sky').getSourceImage();
        let originalWidth = bgSource.width;
        let originalHeight = bgSource.height;

        // Imposta l'altezza desiderata (screenHeight + 10)
        let desiredHeight = this.screenHeight + 10;

        // Calcola il fattore di scala per mantenere le proporzioni
        let scaleFactor = desiredHeight / originalHeight;

        // La larghezza di una singola tile dopo la scala
        let tileWidth = originalWidth * scaleFactor;

        // Crea un tileSprite che copre l'intera larghezza della mappa e ha l'altezza desiderata
        this.sky = this.add.tileSprite(
            this.mapWidth / 2,       // posizione x: centro della mappa
            this.screenHeight / 2,   // posizione y: centro dello schermo
            this.mapWidth,           // larghezza del tileSprite = mapWidth (l'immagine verrà ripetuta orizzontalmente)
            desiredHeight,           // altezza fissata a screenHeight+10
            'sky'
        );

        // Imposta il tileScale in modo che la texture abbia le dimensioni corrette
        this.sky.setTileScale(scaleFactor, scaleFactor);

        console.log('screenWidth: ' + this.screenWidth);
        console.log('screenHeight: ' + this.screenHeight);
        console.log('mapWidth: ' + this.mapWidth);
        console.log('mapHeight: ' + this.mapHeight);

        this.platforms = this.physics.add.staticGroup();
        const platformWidth = 99 * this.personalScale;
        const gapPercentages = [0.2, 0.5, 0.8];
        const gapWidth = 500*this.personalScale;
        
        const numPlatforms = Math.ceil(this.mapWidth / platformWidth);
        for (let i = 0; i < numPlatforms; i++) {
            let platformX = i * platformWidth + platformWidth / 2;
            let isInGap = this.isPositionInGap(platformX, gapPercentages, this.mapWidth, gapWidth);
            if (!isInGap) {
                this.platforms.create(platformX, this.mapHeight - platformWidth / 2, 'ground')
                    .setScale(this.personalScale).refreshBody();
            }
        }

        this.deepGrounds = this.physics.add.staticGroup();
        const numRows = Math.ceil((this.screenHeight - (this.mapHeight - platformWidth / 2)) / platformWidth);
        for (let row = 1; row <= numRows; row++) {
            for (let i = 0; i < numPlatforms; i++) {
                let platformX = i * platformWidth + platformWidth / 2;
                let isInGap = this.isPositionInGap(platformX, gapPercentages, this.mapWidth, gapWidth);
                if (!isInGap) {
                    this.deepGrounds.create(
                        platformX,
                        this.mapHeight - platformWidth / 2 + row * platformWidth,
                        'deepGround'
                    ).setScale(this.personalScale).refreshBody();
                }
            }
        }
        
        const lev1PlatformHeight = this.mapHeight - 400 * this.personalScale;
        const lev2PlatformHeight = this.mapHeight - 600 * this.personalScale;
        const lev3PlatformHeight = this.mapHeight - 800 * this.personalScale;
        const lev4PlatformHeight = this.mapHeight - 1000 * this.personalScale;

        const boxWidth = 99*this.personalScale;

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

        for (let i = 0; i < 3; i++) {
            this.platforms.create(2200*this.personalScale + boxWidth * i, lev1PlatformHeight, 'box')
                .setScale(this.personalScale)
                .refreshBody();
        }

        this.spawnDecor('flower', 0.004 * this.mapWidth, 0, this.mapWidth, gapPercentages, this.mapWidth, gapWidth, boxWidth);
        this.spawnDecor('grass', 0.015 * this.mapWidth, 0, this.mapWidth, gapPercentages, this.mapWidth, gapWidth, boxWidth);
        this.spawnDecor('direction_board', 1, this.mapWidth/2, this.mapWidt - 100*this.personalScale, gapPercentages, this.mapWidth, gapWidth, boxWidth);
        this.spawnDecor('sunflowers', 10*this.personalScale, this.mapWidth*0.6, this.mapWidth*0.7, gapPercentages, this.mapWidth, gapWidth, boxWidth);
        this.spawnSkull('skull_1', gapPercentages, gapWidth, boxWidth);
        this.spawnSkull('skull_1', gapPercentages, gapWidth, boxWidth);
        this.spawnSkull('skull_2', gapPercentages, gapWidth, boxWidth);
        this.spawnSkull('skull_3', gapPercentages, gapWidth, boxWidth);

        this.player = this.physics.add.sprite(100, 500, 'player');
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
        this.player.setScale(this.personalScale * 1.3).refreshBody();
        this.player.setSize(this.player.width * 0.70, this.player.height);
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'explode',
            frames: [
                { key: 'acorn_expl_1' },
                { key: 'acorn_expl_2' }
            ],
            frameRate: 20,
            hideOnComplete: true
        });

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
        
        this.strawberryNumber = 5;
        this.strawberries = this.createIngredients(
            'strawberry',           // key: nome della texture
            this.strawberryNumber,  // numero totale di fragole
            { x: 12, y: 0, stepX: 200 },  // setXY di default (può essere usato per posizionamenti iniziali se serve)
            { min: 100, max: this.mapWidth - 100 },  // Intervallo casuale per x
            { min: 50,  max: 300 }                     // Intervallo casuale per y
        );

        this.blueberryNumber = 5;
        this.blueberries = this.createIngredients(
            'blueberry',           // key: nome della texture
            this.blueberryNumber,  // numero totale di fragole
            { x: 12, y: 0, stepX: 200 },  // setXY di default (può essere usato per posizionamenti iniziali se serve)
            { min: 100, max: this.mapWidth - 100 },  // Intervallo casuale per x
            { min: 50,  max: 300 }                     // Intervallo casuale per y
        );

        this.sugarNumber = 5;
        this.sugar = this.createIngredients(
            'sugar',           // key: nome della texture
            this.sugarNumber,  // numero totale di fragole
            { x: 12, y: 0, stepX: 200 },  // setXY di default (può essere usato per posizionamenti iniziali se serve)
            { min: 100, max: this.mapWidth - 100 },  // Intervallo casuale per x
            { min: 50,  max: 300 }               // Intervallo casuale per y
        );


        this.acorns = this.physics.add.group();
        for (let i = 0; i < 4; i++){
            var x = Phaser.Math.Between(100, this.mapWidth-100*this.personalScale);
            var acorn = this.acorns.create(x, 16, 'acorn');
            acorn.setBounce(1);
            acorn.setScale(this.personalScale).refreshBody();
            acorn.setCollideWorldBounds(true);
            acorn.allowGravity = false;
            acorn.setSize(acorn.width * 0.70, acorn.height * 0.7 );

            let velocityX;
            do {
                velocityX = Phaser.Math.Between(-200 * this.personalScale, 200 * this.personalScale);
            } while (Math.abs(velocityX) <= 20); 

            acorn.setVelocity(velocityX, 20 * this.personalScale);

            acorn.setAngularVelocity(velocityX / 10); // Modifica il divisore per regolare la rotazione

            // Eventuale modifica della rotazione in base alla collisione con altri oggetti
            acorn.body.onWorldBounds = true;
            acorn.body.world.on('worldbounds', (body) => {
                if (body.gameObject === acorn) {
                    acorn.setAngularVelocity(Phaser.Math.Between(-200, 200)); // Imposta una velocità angolare casuale al momento della collisione
                }
            });
        }
        
        this.spawnDecor('grass', 0.006 * this.mapWidth, 0, this.mapWidth, gapPercentages, this.mapWidth, gapWidth, boxWidth);
        this.spawnDecor('sunflowers', 2*this.personalScale, this.mapWidth*0.6, this.mapWidth*0.7, gapPercentages, this.mapWidth, gapWidth, boxWidth);
        //fungo
        this.mushroom = this.physics.add.sprite(this.mapWidth*0.85, this.mapHeight - boxWidth, 'mushroom').setOrigin(0.5,1);
        this.mushroom.setScale(this.personalScale * 1.2).refreshBody();
        this.mushroom.body.setAllowGravity(false);
        this.mushroom.body.setImmovable(true);

        // cinghiale 
        this.boar = this.physics.add.sprite(500*this.personalScale, this.mapHeight - boxWidth-5, 'boar').setOrigin(0.5,1); // 500 è un'altezza iniziale da regolare
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
        this.physics.add.collider(this.acorns, this.deepGrounds);
        this.physics.add.collider(this.player, this.deepGrounds);
        this.physics.add.overlap(this.player, this.strawberries, (player, item) => {this.collectIngredient(player, item, 'strawberry');}, null, this);
        this.physics.add.overlap(this.player, this.sugar, (player, item) => {this.collectIngredient(player, item, 'sugar');}, null, this);
        this.physics.add.overlap(this.player, this.blueberries, (player, item) => {this.collectIngredient(player, item, 'blueberry');}, null, this);
        this.physics.add.overlap(this.player, this.acorns, this.hitEnemy, null, this);
        this.physics.add.collider(this.boar, this.platforms);
        this.physics.add.overlap(this.player, this.boar, this.hitEnemy, null, this);
        this.physics.add.collider(this.mushroom, this.platforms);
        this.physics.add.collider(this.player, this.mushroom, this.hitEnemy, null, this);

        console.log("personalScale: ", this.personalScale);
        console.log("player.displayHeight: ", this.player.displayHeight);
        
        const fontSize = 40 * this.personalScale;
        console.log("fontsize: " , fontSize);

        this.strawberryText = this.add.text(50*this.personalScale + 1.5*this.margin, this.margin + fontSize/2, '0/' + this.strawberryNumber, { 
            fontFamily: 'PressStart2P', 
            fontSize: fontSize, 
            fill: '#fff' 
        }).setOrigin(0, 0.5).setScrollFactor(0);
        let strawberryIcon = this.add.image(this.margin, this.strawberryText.y + 5*this.personalScale, 'strawberry').setOrigin(0, 0.5).setScrollFactor(0).setScale(this.personalScale*0.85);
        strawberryIcon.angle = -40;

        this.sugarText = this.add.text(50*this.personalScale + 1.5*this.margin, this.margin*1.5 + fontSize*1.5, '0/' + this.sugarNumber, { 
            fontFamily: 'PressStart2P', 
            fontSize: fontSize, 
            fill: '#fff' 
        }).setOrigin(0, 0.5).setScrollFactor(0);
        let sugarIcon = this.add.image(this.margin, this.sugarText.y, 'sugar').setOrigin(0, 0.5).setScrollFactor(0).setScale(this.personalScale*0.85);
        sugarIcon.angle = -10;

        this.blueberryText = this.add.text(50*this.personalScale + 1.5*this.margin, this.margin*2 + fontSize*2.5, '0/' + this.blueberryNumber, { 
            fontFamily: 'PressStart2P', 
            fontSize: fontSize, 
            fill: '#fff' 
        }).setOrigin(0, 0.5).setScrollFactor(0);
        let blueberryIcon = this.add.image(this.margin, this.blueberryText.y - 5*this.personalScale, 'blueberry').setOrigin(0, 0.5).setScrollFactor(0).setScale(this.personalScale*0.85);
        blueberryIcon.angle = 10;
        
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.cursors = this.input.keyboard.createCursorKeys();
        
        const buttonWidth = 1.3*101*this.personalScale;
        let buttonSize = 1.3*this.personalScale;
        let buttonY = this.screenHeight > this.screenWidth ? this.screenHeight * 0.8 : this.screenHeight * 0.85;
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

        //BOTTONE VOLUME
        this.volumeStates = ['mute', 'low', 'high'];
        this.currentVolumeState = 0; // 0 = high, 1 = low, 2 = mute
        this.volumeIcons = {
            high: 'volume_high',
            low: 'volume_low',
            mute: 'volume_mute'
        };
        this.volumeLevels = {
            high: 0.4,
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
            this.player.setVelocityY(-1100 * this.personalScale);
            this.jumpSound.play();
            this.player.anims.play('jump');
        }

        //burroni 
        if (this.player.y > this.screenHeight - this.player.displayHeight) { // Se il giocatore cade sotto il livello della mappa
            this.die();
        }

        this.acorns.children.iterate((acorn) => {
            // Se l'acorn ha superato il bordo inferiore (considerando anche la sua dimensione visibile)
            if (acorn.y + acorn.displayHeight/2 >= this.screenHeight-5) {
                // Riposiziona l'acorn appena sopra lo schermo
                acorn.y = -acorn.displayHeight;
                // Scegli una nuova posizione x casuale (puoi adattare i limiti se necessario)
                acorn.x = Phaser.Math.Between(100, this.mapWidth - 100 * this.personalScale);

                let newVelocityX;
                do {
                    newVelocityX = Phaser.Math.Between(-200 * this.personalScale, 200 * this.personalScale);
                } while (Math.abs(newVelocityX) <= 20);

                // Imposta la nuova velocità: orizzontale e verticale costante
                acorn.setVelocity(newVelocityX, 20 * this.personalScale);
                // Imposta la velocità angolare in base alla nuova velocità orizzontale
                acorn.setAngularVelocity(newVelocityX / 10);
            }
        });

        this.updateIngredients(this.strawberries, { min: 100 * this.personalScale, max: this.mapWidth - 100 * this.personalScale });
        this.updateIngredients(this.sugar, { min: 100 * this.personalScale, max: this.mapWidth - 100 * this.personalScale });
        this.updateIngredients(this.blueberries, { min: 100 * this.personalScale, max: this.mapWidth - 100 * this.personalScale });

        // cinghiale
        if (this.boar.x >= this.mapWidth-100) {
            this.boar.setVelocityX(-400 * this.personalScale);  // Inverti direzione a sinistra
            this.boar.setFlipX(true);  // Rovescia immagine orizzontalmente
        } else if (this.boar.x <= 100) {
            this.boar.setVelocityX(400 * this.personalScale);  // Inverti direzione a destra
            this.boar.setFlipX(false);  // Torna all'orientamento normale
        }
    }

    spawnDecor(texture, count, startingPoint, endingPoint, gapPercentages, mapWidth, gapWidth, boxWidth) {
        console.log("texture: ", texture);
        for (let i = 0; i < count; i++) {
            let x;
            do {
                x = Phaser.Math.Between(startingPoint, endingPoint);
            } while (this.isPositionInGap(x, gapPercentages, mapWidth, gapWidth) || this.isPositionInGap(x + 34*this.personalScale, gapPercentages, mapWidth, gapWidth) || this.isPositionInGap(x - 34*this.personalScale, gapPercentages, mapWidth, gapWidth));
            
            if(texture === "sunflowers"){
                console.log("x: ", x);
            }
            let decor = this.add.image(x, this.mapHeight - boxWidth, texture)
                .setOrigin(0.5, 1)
                .setScale(this.personalScale);
    
            if (Phaser.Math.Between(0, 1) === 0) {
                decor.setScale(-Math.abs(this.personalScale), this.personalScale); // Specchia orizzontalmente
            }
        }
    }

    spawnSkull(texture, gapPercentages, gapWidth, boxWidth) {
        let x, y;
        let skull; // dichiarazione dell'immagine
        do {
            x = Phaser.Math.Between(0, this.mapWidth);
        } while (this.isPositionInGap(x, gapPercentages, this.mapWidth, gapWidth) || this.isPositionInGap(x + 50*this.personalScale, gapPercentages, this.mapWidth, gapWidth) || this.isPositionInGap(x - 50*this.personalScale, gapPercentages, this.mapWidth, gapWidth));
       
        if(this.screenHeight>this.screenWidth){
            y = Phaser.Math.Between(this.mapHeight + boxWidth, this.screenHeight*0.90);
        }
        else{
            y = Phaser.Math.Between(this.mapHeight + boxWidth, this.screenHeight);
        }
        skull = this.add.image(x, y, texture)
            .setOrigin(0.5, 1)
            .setScale(this.personalScale);
        if (Phaser.Math.Between(0, 1) === 0) {
            skull.setScale(-Math.abs(this.personalScale), this.personalScale);
        }
    }

    isPositionInGap(x, gapPercentages, mapWidth, gapWidth) {
        return gapPercentages.some(gap => {
            let gapStart = mapWidth * gap - gapWidth / 2 - 20*this.personalScale;
            let gapEnd = mapWidth * gap + gapWidth / 2 + 20*this.personalScale;
            return x > gapStart && x < gapEnd;
        });
    }

    createIngredients(key, count, setXYConfig, xRange, yRange, scaleMultiplier = 0.95, bounceRange = { min: 0.4, max: 0.8 }) {
        let group = this.physics.add.group({
            key: key,
            repeat: count - 1,
            setXY: setXYConfig
        });
        
        group.children.iterate((item) => {
            item.x = Phaser.Math.Between(xRange.min, xRange.max);
            item.y = Phaser.Math.Between(yRange.min, yRange.max);
            item.setBounceY(Phaser.Math.FloatBetween(bounceRange.min, bounceRange.max));
            item.setScale(this.personalScale * scaleMultiplier).refreshBody();
        });
        
        return group;
    }

    updateIngredients(group, xRange) {
        group.children.iterate((item) => {
            // Se l'ingrediente ha superato il bordo inferiore dello schermo...
            if (item.y - item.displayHeight/2 > this.screenHeight) {
                // Riposiziona l'ingrediente appena sopra lo schermo...
                item.y = -item.displayHeight;
                // ... e scegli una nuova posizione x casuale nell'intervallo specificato
                item.x = Phaser.Math.Between(xRange.min, xRange.max);
            }
        });
    }

    collectIngredient(player, ingredient, type) {
        this.collectSound.play();
        ingredient.disableBody(true, true);

        this[type + "Collected"]++;  // Incrementa il contatore, ad es. this["sugarCollected"]++
        this[type + "Text"].setText(this[type + "Collected"] + '/' + this[type + "Number"]);

        if (this.sugarCollected >= this.sugarNumber && 
            this.strawberryCollected >= this.strawberryNumber && 
            this.blueberryCollected >= this.blueberryNumber) {
            this.win();
        }
    }
    
    hitEnemy(player, enemy){
        if (enemy.texture.key === 'acorn') { 
            this.popSound.play();
            this.explode(enemy);
        }
        if (enemy.texture.key != 'acorn' && player.body.y + 10*this.personalScale + (player.body.height)/2 < enemy.body.y) {
            player.setVelocityY(-800 * this.personalScale);
            this.jumpOverSound.play();
            if (enemy.texture.key === 'mushroom') { 
                enemy.setTexture('mushroom_smashed');
                this.time.delayedCall(100, () => enemy.destroy(), [], this);
            }
        }
        else {
            if (enemy.texture.key === 'boar'){
                this.boarSound.play();
            }
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

    explode(acorn) {
        let explosion = this.add.sprite(acorn.x, acorn.y, 'explosion1');
        explosion.setScale(this.personalScale);
        explosion.play('explode');
    
        explosion.rotation = acorn.rotation;
        acorn.destroy();
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