export function initializeScene(scene, sceneName, backgroundType) {
    const cm = scene.physics.world.colliders;
    cm.getActive().slice().forEach(collider => {
      cm.remove(collider);
    });
    scene.finishPoint = 300;
    scene.scale.refresh();
    scene.mapWidth = scene.scale.height * 8;
    scene.mapHeight = scene.scale.height;
    scene.screenHeight = scene.scale.height;
    scene.screenWidth = scene.scale.width;
    scene.isVertical = scene.screenHeight > scene.screenWidth;

    scene.mapHeight *= scene.isVertical ? 0.75 : 0.85;
    
    scene.personalScale = scene.mapHeight / 1200;
    scene.boxWidth = 99 * scene.personalScale;
    scene.margin = scene.personalScale * 70;
    
    scene.physics.world.setBounds(0, 0, scene.mapWidth, scene.screenHeight);
    scene.cameras.main.setBounds(0, 0, scene.mapWidth, scene.mapHeight);
    scene.cameras.main.fadeIn(800, 0, 0, 0);

    scene.lives = 3;
    scene.player = null;
    scene.platforms = null;
    scene.cursors = null;
    scene.isInvincible = false;
    scene.gameOver = false;
    scene.victory = false;
    scene.scoreText = null;
    scene.isMovingLeft = false;
    scene.isMovingRight = false;
    scene.isJumping = false;
    scene.sceneName = sceneName;

    scene.hazelnutCollected = 0;
    scene.milkCollected = 0;
    scene.appleCollected = 0;
    scene.strawberryCollected = 0;
    scene.sugarCollected = 0;
    scene.blueberryCollected = 0;
    
    createSounds(scene);

    const groundHeight = scene.screenHeight - scene.mapHeight + 70 * scene.personalScale;
    if (groundHeight > 0) {
        const groundSource = scene.textures.get('ground_background').getSourceImage();
        const groundScaleFactor = groundHeight / groundSource.height;

        scene.groundBackground = scene.add.tileSprite(
            scene.mapWidth / 2,
            scene.screenHeight,
            scene.mapWidth+5,
            groundHeight,
            'ground_background'
        ).setOrigin(0.5, 1).setScrollFactor(0.2);
        scene.groundBackground.setTileScale(groundScaleFactor, groundScaleFactor);
    }

    const bgSource = scene.textures.get(backgroundType).getSourceImage();
    const desiredHeight = scene.screenHeight + 10;
    const scaleFactor = desiredHeight / bgSource.height;

    scene.background = scene.add.tileSprite(
        scene.mapWidth / 2,
        scene.mapHeight - 40 * scene.personalScale,
        scene.mapWidth,
        desiredHeight,
        backgroundType
    ).setOrigin(0.5, 1).setScrollFactor(0.2);
    
    scene.background.setTileScale(scaleFactor, scaleFactor);
    
    scene.platforms = scene.physics.add.staticGroup();
    scene.platformWidth = 99 * scene.personalScale;
    scene.lev1PlatformHeight = scene.mapHeight - 400 * scene.personalScale;
    scene.lev2PlatformHeight = scene.mapHeight - 600 * scene.personalScale;
    scene.lev3PlatformHeight = scene.mapHeight - 800 * scene.personalScale;

    console.log('screenWidth:', scene.screenWidth);
    console.log('screenHeight:', scene.screenHeight);
    console.log('mapWidth:', scene.mapWidth);
    console.log('mapHeight:', scene.mapHeight);
    console.log("personalScale: ", scene.personalScale);
}

export function initializeSceneInputs(scene, ingredient1, ingredient2){
    createScores(scene, ingredient1, ingredient2);
    scene.spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    scene.cursors = scene.input.keyboard.createCursorKeys();

    createMovementButtons(scene);
    const volumeButton = createVolumeButton(scene);
    createLives(scene, volumeButton.height);
}

export function createPlatforms(scene, numIterations, platformHeight, startX) {
    for (let i = 0; i < numIterations; i++) {
        scene.platforms.create(startX * scene.personalScale + scene.boxWidth * i, platformHeight, 'box')
            .setScale(scene.personalScale)
            .refreshBody();
    }
}

export function createSounds(scene) {
    if (scene.sceneName == 'FieldsScene'){
        scene.flySound = scene.sound.add('fly', { loop: false, volume: 1 });
        scene.spiderSound = scene.sound.add('spider', { loop: false, volume: 0.8 });
    }
    else if (scene.sceneName == 'WaterScene'){
        scene.flySound = scene.sound.add('fly', { loop: false, volume: 1 });
        scene.snakeSound = scene.sound.add('snake', { loop: false, volume: 1 });
    }
    else if (scene.sceneName == 'OrchardScene'){
        scene.spiderSound = scene.sound.add('spider', { loop: false, volume: 0.8 });
    }
    scene.boarSound = scene.sound.add('boar', { loop: false, volume: 0.5 });
    scene.collectSound = scene.sound.add('collect', { loop: false, volume: 0.05 });
    scene.gameOverSound = scene.sound.add('gameOver', { loop: false, volume: 0.3 });
    scene.jumpSound = scene.sound.add('jump', { loop: false, volume: 0.2 });
    scene.jumpOverSound = scene.sound.add('jumpOver', { loop: false, volume: 0.3 });
    scene.popSound = scene.sound.add('pop', { loop: false, volume: 0.5 });
    scene.music = scene.sound.add('soundtrack', { loop: true, volume: 0.5 });
    scene.music.play();
    scene.sound.setVolume(0.1);
    scene.boarSound.play(); scene.boarSound.stop();
    scene.input.once('pointerdown', () => {
        if (scene.sound.context.state === 'suspended') {
            scene.sound.context.resume();
        }
      });
}

export function createGround(scene, gapPercentages, gapWidth, fillGaps) {
    if (fillGaps) {
        scene.waterGroup = scene.add.group();
    }
    const numPlatforms = Math.ceil(scene.mapWidth / scene.platformWidth);

    // Creazione delle piattaforme "normali"
    for (let i = 0; i < numPlatforms; i++) {
        let platformX = i * scene.platformWidth + scene.platformWidth / 2;
        const inGap = isPositionInGap(platformX, gapPercentages, scene.mapWidth, gapWidth);
        if (!inGap) {
            let ground = scene.platforms.create(platformX, scene.mapHeight - scene.platformWidth / 2, 'ground')
                .setScale(scene.personalScale)
                .refreshBody();
            if (Math.random() < 0.5) {
                ground.setFlipX(true);
            }
        } else if (fillGaps) {
            // Se siamo nei gap e fillGaps è true, crea una piattaforma water
            let water = scene.add.image(platformX, scene.mapHeight - scene.platformWidth / 2 + 40 * scene.personalScale, 'water')
                .setOrigin(0.5)
                .setScale(scene.personalScale);
            if (Math.random() < 0.5) {
                water.setFlipX(true);
            }
            if (Math.random() < 0.5) {
                water.setFlipY(true);
            }
            scene.waterGroup.add(water);
        }
    }

    // Creazione delle piattaforme "deepGrounds"
    scene.deepGrounds = scene.physics.add.staticGroup();
    const numRows = Math.ceil((scene.screenHeight - (scene.mapHeight - scene.platformWidth / 2)) / scene.platformWidth);
    
    for (let row = 1; row <= numRows; row++) {
        for (let i = 0; i < numPlatforms; i++) {
            let platformX = i * scene.platformWidth + scene.platformWidth / 2;
            const inGap = isPositionInGap(platformX, gapPercentages, scene.mapWidth, gapWidth);
            if (!inGap) {
                let deepGround = scene.deepGrounds.create(
                    platformX,
                    scene.mapHeight - scene.platformWidth / 2 + row * scene.platformWidth,
                    'deepGround'
                ).setScale(scene.personalScale).refreshBody();
                
                if (Math.random() < 0.5) {
                    deepGround.setFlipX(true);
                }
                if (Math.random() < 0.5) {
                    deepGround.setFlipY(true);
                }
            } else if (fillGaps) {
                // Riempie anche i gap nelle deepGrounds se fillGaps è true
                let water = scene.add.image(platformX, scene.mapHeight - scene.platformWidth / 2 + row * scene.platformWidth, 'water')
                    .setOrigin(0.5)
                    .setScale(scene.personalScale);
                if (Math.random() < 0.5) {
                    water.setFlipX(true);
                }
                if (Math.random() < 0.5) {
                    water.setFlipY(true);
                }
                scene.waterGroup.add(water);
            }
        }
    }
}

export function updateWater(scene){
    if (scene.waterGroup) {
        scene.time.addEvent({
            delay: 500,
            loop: true,
            callback: () => {
                scene.waterGroup.children.iterate((waterBlock) => {
                    waterBlock.setFlipX(Math.random() < 0.5);
                    waterBlock.setFlipY(Math.random() < 0.5);
                });
            }
        });
    }
}

export function createPlayer(scene) {
    scene.player = scene.physics.add.sprite(100 * scene.personalScale, 400 * scene.personalScale, 'player');
    scene.cameras.main.startFollow(scene.player, true, 0.25, 0.25);
    scene.player.setScale(scene.personalScale * 1.35).refreshBody();
    scene.player.setSize(scene.player.width * 0.70, scene.player.height);
    scene.player.setBounce(0.1);
    scene.player.setCollideWorldBounds(true);

    scene.anims.create({
        key: 'left',
        frames: scene.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    scene.anims.create({
        key: 'turn',
        frames: [{ key: 'player', frame: 4 }],
        frameRate: 20
    });

    scene.anims.create({
        key: 'jump',
        frames: [{ key: 'player', frame: 5 }],
        frameRate: 20
    });

    scene.anims.create({
        key: 'right',
        frames: scene.anims.generateFrameNumbers('player', { start: 6, end: 9 }),
        frameRate: 10,
        repeat: -1
    });

    scene.physics.add.collider(scene.player, scene.deepGrounds);
    scene.physics.add.collider(scene.player, scene.platforms);
}

export function updatePlayer(scene) {
    if (!scene.input.activePointer.isDown) {
        scene.isMovingLeft = false;
        scene.isMovingRight = false;
        scene.isJumping = false;
    }

    if (scene.cursors.left.isDown || scene.isMovingLeft) {
        scene.player.setVelocityX(-500 * scene.personalScale);
        if (scene.player.body.touching.down)
            scene.player.anims.play('left', true);
        else
            scene.player.anims.play('jump');
    } 
    else if (scene.cursors.right.isDown || scene.isMovingRight) {
        scene.player.setVelocityX(500 * scene.personalScale);
        if (scene.player.body.touching.down)
            scene.player.anims.play('right', true);
        else
            scene.player.anims.play('jump');
    } 
    else {
        scene.player.setVelocityX(0);
        if (scene.player.body.touching.down)
            scene.player.anims.play('turn');
        else
            scene.player.anims.play('jump');
    }

    if ((scene.cursors.up.isDown || scene.spaceKey.isDown || scene.isJumping) && scene.player.body.touching.down) {
        scene.player.setVelocityY(-1100 * scene.personalScale);
        scene.jumpSound.play();
        scene.player.anims.play('jump');
    }

    // Controllo caduta nel vuoto
    if (scene.player.y > scene.screenHeight - scene.player.displayHeight) {
        console.log("scene.player.y: " + scene.player.y);
        console.log("scene.screenHeight: " + scene.screenHeight);
        console.log("scene.player.displayHeight: " + scene.player.displayHeight);
        console.log("Sono nell'if dell'updateplayer")
        die(scene, scene.sceneName);
        scene.hearts.forEach((heart) => {
            heart.setTexture('emptyHeart');
        }); 
    }

    // Controllo fine livello
    if (scene.player.x > scene.mapWidth - scene.finishPoint * scene.personalScale) {
        console.log("Sono nel controllo");
        scene.gameOver = true;
        scene.isInvincible = true;
        scene.input.keyboard.removeAllKeys(true);
        scene.player.setVelocityX(0);
        scene.player.anims.play('turn');
        scene.player.anims.stop();

        if (scene.music && scene.music.isPlaying) {
            scene.music.stop();
        }

        if (scene.sugarCollected < scene.sugarNumber ||
            scene.strawberryCollected < scene.strawberryNumber ||
            scene.blueberryCollected < scene.blueberryNumber ||
            scene.appleCollected < scene.appleNumber ||
            scene.milkCollected < scene.milkNumber ||
            scene.hazelnutCollected < scene.hazelnutNumber
        ) {
            scene.time.delayedCall(1000, () => {
                scene.cameras.main.fadeOut(800, 0, 0, 0);
                scene.time.delayedCall(800, () => {
                    scene.scene.start('GameOverScene', { callingScene: scene.sceneName, reason: "failed" });
                });
            });
        } else {
            win(scene, scene.sceneName);
        }
    }
}

export function createMovementButtons(scene) {
    const buttonWidth = 1.3 * 101 * scene.personalScale;
    let buttonSize = 1.3 * scene.personalScale;
    let buttonY = scene.isVertical ? scene.screenHeight * 0.8 : scene.screenHeight * 0.85;

    let buttonLeft = scene.add.image(scene.screenWidth - 2.1 * buttonWidth, buttonY, 'buttonLeft')
        .setInteractive()
        .setScrollFactor(0)
        .setScale(buttonSize);

    let buttonRight = scene.add.image(scene.screenWidth - buttonWidth, buttonY, 'buttonRight')
        .setInteractive()
        .setScrollFactor(0)
        .setScale(buttonSize);

    let buttonUp = scene.add.image(buttonWidth, buttonY, 'buttonUp')
        .setInteractive()
        .setScrollFactor(0)
        .setScale(buttonSize);

    buttonLeft.on('pointerdown', () => {
        console.log("sono nel bottonLeft.on(pointerdown)");
        scene.isMovingLeft = true;
    });

    buttonLeft.on('pointerup', () => {
        console.log("sono nel bottonLeft.on(pointerup)");
        scene.isMovingLeft = false;
    });

    buttonRight.on('pointerdown', () => {
        console.log("sono nel bottonRight.on(pointerdown)");
        scene.isMovingRight = true;
    });

    buttonRight.on('pointerup', () => {
        console.log("sono nel bottonRight.on(pointerup)");
        scene.isMovingRight = false;
    });

    buttonUp.on('pointerdown', () => {
        if (scene.player.body.touching.down) {
            scene.isJumping = true;
        }
    });

    buttonUp.on('pointerup', () => {
        scene.isJumping = false;
    });
}

export function createVolumeButton(scene) {
    scene.volumeStates = ['mute', 'low', 'high'];
    scene.currentVolumeState = 0; // 0 = high, 1 = low, 2 = mute
    scene.volumeIcons = {
        high: 'volume_high',
        low: 'volume_low',
        mute: 'volume_mute'
    };
    scene.volumeLevels = {
        high: 0.5,
        low: 0.15,
        mute: 0.0
    };
    scene.volumeButton = scene.add.image(scene.screenWidth - scene.margin / 2, scene.margin / 2, scene.volumeIcons.low).setInteractive().setOrigin(1, 0).setScale(scene.personalScale).setScrollFactor(0);
    scene.sound.setVolume(scene.volumeLevels.low);
    scene.volumeButton.on('pointerdown', () => {
        scene.currentVolumeState = (scene.currentVolumeState + 1) % scene.volumeStates.length;
        const newState = scene.volumeStates[scene.currentVolumeState];
        scene.volumeButton.setTexture(scene.volumeIcons[newState]);
        scene.sound.setVolume(scene.volumeLevels[newState]);
    }
    );
    return scene.volumeButton;
}

export function createLives(scene, volumeButtonHeight) {
    scene.hearts = [];
    const heartX = scene.screenWidth - scene.margin;
    const heartY = volumeButtonHeight * scene.personalScale + scene.margin;
    const heartSpacing = scene.margin + 10 * scene.personalScale;
    for (let i = 0; i < 3; i++) {
        const heart = scene.add.image(heartX - i * heartSpacing, heartY, 'heart').setOrigin(1, 0).setScale(scene.personalScale).setScrollFactor(0);
        scene.hearts.push(heart);
    }
}

function getIconAngle(ingredient) {
    switch (ingredient) {
        case 'strawberry': 
            return -40;
        case 'sugar': 
            return -10;
        case 'blueberry': 
            return 10;
        default:
            return 0;
    }
}

function getIconOffsetY(ingredient, scene) {
    switch (ingredient) {
        case 'strawberry': 
            return 5 * scene.personalScale;
        case 'sugar': 
            return 0;
        case 'blueberry': 
            return -5 * scene.personalScale;
        default:
            return 0;
    }
}

function createScores(scene, ingredient1, ingredient2) {
    const fontSize = 40 * scene.personalScale;
    const firstY = scene.margin + fontSize / 2;
    scene[ingredient1 + "Text"] = scene.add.text(
        50 * scene.personalScale + 1.5 * scene.margin,
        firstY,
        '0/' + scene[ingredient1 + "Number"],
        { 
            fontFamily: 'PressStart2P', 
            fontSize: fontSize, 
            fill: '#fff' 
        }
    ).setOrigin(0, 0.5).setScrollFactor(0);
    
    scene[ingredient1 + "Icon"] = scene.add.image(
        scene.margin,
        scene[ingredient1 + "Text"].y + getIconOffsetY(ingredient1, scene),
        ingredient1 + "_icon"
    ).setOrigin(0, 0.5).setScrollFactor(0).setScale(scene.personalScale * 0.85);
    scene[ingredient1 + "Icon"].angle = getIconAngle(ingredient1);
    
    const secondY = scene.margin * 1.5 + fontSize * 1.5;
    scene[ingredient2 + "Text"] = scene.add.text(
        50 * scene.personalScale + 1.5 * scene.margin,
        secondY,
        '0/' + scene[ingredient2 + "Number"],
        { 
            fontFamily: 'PressStart2P', 
            fontSize: fontSize, 
            fill: '#fff' 
        }
    ).setOrigin(0, 0.5).setScrollFactor(0);
    
    scene[ingredient2 + "Icon"] = scene.add.image(
        scene.margin,
        scene[ingredient2 + "Text"].y + getIconOffsetY(ingredient2, scene),
        ingredient2 + "_icon"
    ).setOrigin(0, 0.5).setScrollFactor(0).setScale(scene.personalScale * 0.85);
    scene[ingredient2 + "Icon"].angle = getIconAngle(ingredient2);
}

export function spawnDecor(scene, scale, flip, texture, count, startingPoint, endingPoint, gapPercentages, gapWidth, boxWidth) {
    console.log("texture: ", texture);
    for (let i = 0; i < count; i++) {
        let x;
        do {
            x = Phaser.Math.Between(startingPoint, endingPoint);
        } while (isPositionInGap(x + 150 * scene.personalScale, gapPercentages, scene.mapWidth, gapWidth) || isPositionInGap(x - 150 * scene.personalScale, gapPercentages, scene.mapWidth, gapWidth));
        const decor = scene.add.image(x, scene.mapHeight - boxWidth + 2, texture)
            .setOrigin(0.5, 1)
            .setScale(scale * scene.personalScale);

        if (flip && Phaser.Math.Between(0, 1) === 0) {
            decor.setScale(-Math.abs(scale * scene.personalScale), scale * scene.personalScale);
        }
    }
}

export function spawnSkull(scene, texture, gapPercentages, gapWidth, boxWidth) {
    let x, y;
    let skull;
    do {
        x = Phaser.Math.Between(0, scene.mapWidth);
    } while (isPositionInGap(x + 120 * scene.personalScale, gapPercentages, scene.mapWidth, gapWidth) || isPositionInGap(x - 120 * scene.personalScale, gapPercentages, scene.mapWidth, gapWidth));

    if (scene.isVertical) {
        y = Phaser.Math.Between(scene.mapHeight + boxWidth, scene.screenHeight * 0.90);
    }
    else {
        y = Phaser.Math.Between(scene.mapHeight + boxWidth, scene.screenHeight);
    }
    skull = scene.add.image(x, y, texture)
        .setOrigin(0.5, 1)
        .setScale(scene.personalScale);
    if (Phaser.Math.Between(0, 1) === 0) {
        skull.setScale(-Math.abs(scene.personalScale), scene.personalScale);
    }
}

export function isPositionInGap(x, gapPercentages, mapWidth, gapWidth) {
    return gapPercentages.some(gap => {
        let gapStart = mapWidth * gap - gapWidth / 2;
        let gapEnd = mapWidth * gap + gapWidth / 2;
        return x > gapStart && x < gapEnd;
    });
}

export function createIngredients(scene, key, setXYConfig, xRange, yRange, scaleMultiplier = 0.95, bounceRange = { min: 0.4, max: 0.8 }) {

    if (!scene.anims.exists(key + '_anim')) {
        scene.anims.create({
            key: key + '_anim',
            frames: scene.anims.generateFrameNumbers(key, { start: 0, end: 2 }),
            frameRate: 8,
            repeat: -1
        });
    }

    let group = scene.physics.add.group({
        key: key,
        repeat: scene[key + "Number"] - 1,
        setXY: setXYConfig
    });

    group.children.iterate((item) => {
        item.x = Phaser.Math.Between(xRange.min, xRange.max);
        item.y = Phaser.Math.Between(yRange.min, yRange.max);
        item.setBounceY(Phaser.Math.FloatBetween(bounceRange.min, bounceRange.max));
        item.setScale(scene.personalScale * scaleMultiplier).refreshBody();
        item.setSize(item.width * 0.30, item.height * 1.1);

        item.anims.play(key + '_anim'); // Avvia animazione
    });

    scene.physics.add.collider(group, scene.platforms);
    scene.physics.add.overlap(scene.player, group, (player, item) => {
        collectIngredient(scene, player, item, key, scene.sceneName);
    }, null, scene);

    return group;
}

export function updateIngredients(scene, group, xRange, gravityResetSpeed = 200) {
    if (!group) return;
    group.children.iterate((item) => {
        if (item.y - item.displayHeight / 2 > scene.mapHeight) {
            item.y = -item.displayHeight;
            item.x = Phaser.Math.Between(xRange.min, xRange.max);
            item.setVelocityY(gravityResetSpeed * scene.personalScale);
        }
    });
}

export function collectIngredient(scene, player, ingredient, type, sceneName) {
    scene.collectSound.play();
    ingredient.disableBody(true, true);

    scene[type + "Collected"]++;
    scene[type + "Text"].setText(scene[type + "Collected"] + '/' + scene[type + "Number"]);

    const icon = scene[type + "Icon"];
    const originalScale = scene.personalScale * 0.85;
    scene.tweens.add({
        targets: icon,
        scale: originalScale * 1.3,  // Ingrandisce leggermente
        duration: 150,
        yoyo: true,                  // Torna alla scala originale
        ease: 'Power1',
        onComplete: () => {
            icon.setScale(originalScale); // Assicura ritorno preciso alla scala originale
        }
    });

    if (scene.sugarCollected >= scene.sugarNumber &&
        scene.strawberryCollected >= scene.strawberryNumber &&
        scene.blueberryCollected >= scene.blueberryNumber &&
        scene.appleCollected >= scene.appleNumber &&
        scene.hazelnutCollected >= scene.hazelnutNumber &&
        scene.milkCollected >= scene.milkNumber ) {
        win(scene, sceneName);
    }
}

export function createAcorns(scene, num, sceneName) {
    scene.acorns = scene.physics.add.group();

    scene.anims.create({
        key: 'explode',
        frames: [
            { key: 'acorn_expl_1' },
            { key: 'acorn_expl_2' }
        ],
        frameRate: 20,
        hideOnComplete: true
    });

    for (let i = 0; i < num; i++) {
        var x = Phaser.Math.Between(100, scene.mapWidth - 100 * scene.personalScale);
        var acorn = scene.acorns.create(x, 16, 'acorn');
        acorn.setBounce(1);
        acorn.setScale(scene.personalScale).refreshBody();
        acorn.setCollideWorldBounds(true);
        acorn.allowGravity = false;
        acorn.setSize(acorn.width * 0.8, acorn.height * 0.8);

        let velocityX;
        do {
            velocityX = Phaser.Math.Between(-200 * scene.personalScale, 200 * scene.personalScale);
        } while (Math.abs(velocityX) <= 20);

        acorn.setVelocity(velocityX, 20 * scene.personalScale);
        acorn.setAngularVelocity(velocityX / 10);

        acorn.body.onWorldBounds = true;
        acorn.body.world.on('worldbounds', (body) => {
            if (body.gameObject === acorn) {
                acorn.setAngularVelocity(Phaser.Math.Between(-200, 200));
            }
        });
    }
    scene.physics.add.collider(scene.acorns, scene.platforms);
    scene.physics.add.collider(scene.acorns, scene.deepGrounds);
    scene.physics.add.overlap(scene.player, scene.acorns, (player, enemy) => hitEnemy(scene, player, enemy, sceneName), null, scene);
}

export function updateAcorns(scene) {
    scene.acorns.children.iterate((acorn) => {
        if (acorn.y + acorn.displayHeight / 2 >= scene.screenHeight - 5) {
            acorn.y = -acorn.displayHeight;
            acorn.x = Phaser.Math.Between(100, scene.mapWidth - 100 * scene.personalScale);

            let newVelocityX;
            do {
                newVelocityX = Phaser.Math.Between(-200 * scene.personalScale, 200 * scene.personalScale);
            } while (Math.abs(newVelocityX) <= 20);

            acorn.setVelocity(newVelocityX, 20 * scene.personalScale);
            acorn.setAngularVelocity(newVelocityX / 10);
        }
    });
}

export function createMushroom(scene, xPosition) {
    scene.mushroom = scene.physics.add.sprite(xPosition, scene.mapHeight - scene.boxWidth, 'mushroom').setOrigin(0.5, 1);
    scene.mushroom.setScale(scene.personalScale * 1.2).refreshBody();
    scene.mushroom.body.setAllowGravity(false);
    scene.mushroom.body.setImmovable(true);
    scene.physics.add.collider(scene.mushroom, scene.platforms);
    scene.physics.add.collider(scene.player, scene.mushroom, (player, enemy) => hitEnemy(scene, player, enemy, scene.sceneName), null, scene);
}

export function createFish(scene, gapPercentages, gapWidth) {
    // Crea animazione una sola volta
    if (!scene.anims.exists('fishSwim')) {
        scene.anims.create({
            key: 'fishSwim',
            frames: scene.anims.generateFrameNumbers('fish', { start: 0, end: 1 }),
            frameRate: 6,
            repeat: -1
        });
    }

    gapPercentages.forEach(gap => {
        const gapStart = scene.mapWidth * gap - gapWidth / 2 + 140 * scene.personalScale;
        const gapEnd = scene.mapWidth * gap + gapWidth / 2 - 140 * scene.personalScale;

        // Random y tra 60 e 120 (relativa alla mappa)
        const yPos = Phaser.Math.Between(
            scene.mapHeight + 60 * scene.personalScale,
            scene.mapHeight + 120 * scene.personalScale
        );

        // Random scale tra 0.7 e 1.1 (moltiplicata per personalScale)
        const scale = Phaser.Math.FloatBetween(0.7, 1.1) * scene.personalScale;

        const fish = scene.add.sprite(gapStart, yPos, 'fish')
            .setOrigin(0.5, 1)
            .setScale(scale);

        fish.play('fishSwim');

        scene.tweens.add({
            targets: fish,
            x: gapEnd,
            ease: 'Linear',
            duration: 6000,
            yoyo: true,
            repeat: -1,
            onYoyo: (tween, target) => target.setFlipX(!target.flipX),
            onRepeat: (tween, target) => target.setFlipX(!target.flipX)
        });
    });
}

export function createRafts(scene, gapPercentages, gapWidth, velocity) {
    scene.rafts = []; // Lista delle zattere
    scene.player.isOnRaft = false;

    gapPercentages.forEach((gapPerc, index) => {
        const gapCenter = gapPerc * scene.mapWidth;
        const leftBound = gapCenter - gapWidth / 2 + scene.boxWidth + 100 * scene.personalScale;
        const rightBound = gapCenter + gapWidth / 2 - scene.boxWidth - 100 * scene.personalScale;
        const raftX = (leftBound + rightBound) / 2;

        const raft = scene.physics.add.sprite(raftX, scene.mapHeight - 50 * scene.personalScale, 'raft')
            .setOrigin(0.5, 1)
            .setScale(scene.personalScale * 1.3)
            .refreshBody();

        raft.body.setAllowGravity(false);
        raft.setImmovable(true);

        // Alterna direzione iniziale (optional, rimuovi se non vuoi)
        const dir = index % 2 === 0 ? 1 : -1;
        raft.setVelocityX(dir * velocity * scene.personalScale);

        // Salva i limiti per questo raft
        raft.movementBounds = { left: leftBound, right: rightBound };
        scene.rafts.push(raft);

        // Collider con il player
        scene.physics.add.collider(scene.player, raft, (player, raft) => {
            const playerBottom = player.y + player.body.height / 2;
            const raftTop = raft.y - raft.body.height / 2;

            if (playerBottom <= raftTop + 10) {
                player.isOnRaft = true;
                player.body.velocity.x += raft.body.velocity.x;
            }
        }, null, scene);
    });
}

export function updateRafts(scene, velocity) {
    scene.rafts.forEach(raft => {
        const { left, right } = raft.movementBounds;

        if (raft.x >= right) {
            raft.setVelocityX(-velocity * scene.personalScale);
        } else if (raft.x <= left) {
            raft.setVelocityX(velocity * scene.personalScale);
        } 

        const touching = scene.physics.world.overlap(scene.player, raft);
        if (!touching && scene.player.isOnRaft) {
            scene.player.isOnRaft = false;
        }
    });
}

export function createFlies(scene, n, enemyKey, numberOfSprites, speed) {
    const flies    = [];
    const margin   = 50;
    const minY     = 0.6 * scene.mapHeight;
    const maxY     = scene.mapHeight - 90 * scene.personalScale;

    for (let i = 0; i < n; i++) {
        // spawn X casuale nella metà destra [mapWidth/2, mapWidth]
        const xStart = Phaser.Math.Between(scene.mapWidth / 2, scene.mapWidth);
        const yStart = Phaser.Math.Between(minY, maxY);
        const direction = Phaser.Math.Between(0, 1) === 0 ? -1 : 1;
        const fly = scene.physics.add.sprite(xStart, yStart, enemyKey)
            .setOrigin(0.5, 1)
            .setScale(scene.personalScale)
            .setCollideWorldBounds(false);

        fly.body.setAllowGravity(false);
        fly.setVelocityX(direction * speed * scene.personalScale);
        fly.setFlipX(direction < 0);
        // Animazione di volo
        if (!scene.anims.exists(enemyKey + 'Fly')) {
            scene.anims.create({
                key: enemyKey + 'Fly',
                frames: scene.anims.generateFrameNumbers(enemyKey, { start: 0, end: numberOfSprites - 1 }),
                frameRate: 8,
                repeat: -1
            });
        }
        fly.play(enemyKey + 'Fly');

        // Zig‑zag: cambia velocità Y ogni 1.2 s
        scene.time.addEvent({
            delay: 800,
            loop: true,
            callback: () => {
                fly.setVelocityY(Phaser.Math.Between(-100, 100));
            }
        });

        // overlap con il player
        scene.physics.add.overlap(
            scene.player,
            fly,
            (player, enemy) => hitEnemy(scene, player, enemy, scene.sceneName),
            null,
            scene
        );

        flies.push(fly);
    }

    // wrap orizzontale + “rimbalzo” verticale ai limiti in ogni frame
    scene.events.on('update', () => {
        flies.forEach(fly => {
            // quando esce a sinistra rientra a destra
            if (fly.x < -margin) {
                fly.x = scene.mapWidth + margin;
            }
            // e viceversa
            else if (fly.x > scene.mapWidth + margin) {
                fly.x = -margin;
            }

            // bounce Y entro [minY, maxY]
            if (fly.y < minY) {
                fly.y = minY;
                fly.setVelocityY(Math.abs(fly.body.velocity.y));
            } else if (fly.y > maxY) {
                fly.y = maxY;
                fly.setVelocityY(-Math.abs(fly.body.velocity.y));
            }
        });
    });

    return flies;
}

export function createEnemy(scene, xPosition, enemy, velocity, numberOfSprites) {
    scene.enemy = scene.physics.add.sprite(xPosition, scene.mapHeight - scene.boxWidth, enemy).setOrigin(0.5, 1);
    scene.enemy.setScale(scene.personalScale * 1.2).refreshBody();
    scene.enemy.setCollideWorldBounds(false);
    scene.enemy.body.setAllowGravity(false);

    scene.anims.create({
        key: enemy + 'Run',
        frames: scene.anims.generateFrameNumbers(enemy, { start: 0, end: numberOfSprites-1 }),
        frameRate: 8,
        repeat: -1
    });

    scene.enemy.play(enemy + 'Run');
    scene.enemy.setVelocityX(velocity * scene.personalScale);
    scene.enemy.setFlipX(false);
    scene.enemyDirection = 1;

    //scene.physics.add.collider(scene.enemy, scene.platforms);
    scene.physics.add.overlap(scene.player, scene.enemy, (player, enemy) => hitEnemy(scene, player, enemy, scene.sceneName), null, scene);
}

export function spawnGapEnemies(scene, key, gaps, speed, frameCount, excludedGaps) {
    const gapPos = gaps.map(p => p * scene.mapWidth);
    gapPos.unshift( - 300 * scene.personalScale);
    gapPos.push(scene.mapWidth + 300 * scene.personalScale);

    const result = [];

    for (let i = 0; i < gapPos.length - 1; i++) {
        if (excludedGaps.length == 0 || (excludedGaps.length > 0 && excludedGaps.indexOf(i) === -1)) {
            let lBound;
            let rBound;
            if (key == "snake"){
                lBound = gapPos[i] + scene.gapWidth/2 + 300 * scene.personalScale;
                rBound = gapPos[i+1] - scene.gapWidth/2 - 300 * scene.personalScale;
            }
            else{
                lBound = gapPos[i] + scene.gapWidth/2 + 100 * scene.personalScale;
                rBound = gapPos[i+1] - scene.gapWidth/2 - 100 * scene.personalScale;
            }
            const spawnX = (lBound + rBound) / 2;

            const e = scene.physics.add.sprite(spawnX, scene.mapHeight - scene.boxWidth, key).setOrigin(0.5, 1).setScale(scene.personalScale * 1.2).refreshBody();
            e.body.setAllowGravity(false);
            e.body.setCollideWorldBounds(false);
            e.setVelocityX(speed * scene.personalScale);

            const animKey = `${key}Run_${i}`;
            if (!scene.anims.exists(animKey)) {
            scene.anims.create({
                key: animKey,
                frames: scene.anims.generateFrameNumbers(key, { start: 0, end: frameCount - 1 }),
                frameRate: 8,
                repeat: -1
            });
            }
            e.play(animKey);

            scene.physics.add.overlap(scene.player, e,
            (player, enemyObj) => hitEnemy(scene, player, enemyObj, scene.sceneName),
            null, scene);

            result.push({ enemy: e, bounds: { lBound, rBound } });
        }
    }

    return result;
}

export function updateEnemy(scene, enemy, lBound, rBound, velocity) {
    if (enemy.x >= rBound && enemy.body.velocity.x > 0) {
        enemy.setVelocityX(-velocity * scene.personalScale);
        enemy.setFlipX(true);
    }
    else if (enemy.x <= lBound && enemy.body.velocity.x < 0) {
        enemy.setVelocityX(velocity * scene.personalScale);
        enemy.setFlipX(false);
    }
}

function hitEnemy(scene, player, enemy, sceneName) {
    console.log("Sono entrato nell'hitEnemy");
    if (enemy.texture.key === 'acorn') {
        scene.popSound.play();
        explode(scene, enemy);
    }
    if (enemy.texture.key != 'acorn' && player.body.y + 10 * scene.personalScale + (player.body.height) / 2 < enemy.body.y) {
        player.setVelocityY(-800 * scene.personalScale);
        scene.jumpOverSound.play();
        if (enemy.texture.key === 'mushroom') {
            enemy.setTexture('mushroom_smashed');
            scene.time.delayedCall(100, () => enemy.destroy(), [], scene);
        }
    }
    else {
        if (enemy.texture.key == 'boar') {
            scene.boarSound.play();
        }
        else if (enemy.texture.key == 'fly'){
            scene.flySound.play();
        }
        else if (enemy.texture.key == 'snake'){
            scene.snakeSound.play();
        }
        else if (enemy.texture.key == 'spider'){
            scene.spiderSound.play();
        }
        takeDamage(scene, player, enemy, sceneName);
    }
}

function takeDamage(scene, player, enemy, sceneName) {
    if (scene.lives > 0 && !scene.isInvincible) {
        scene.lives--;
        scene.hearts[scene.lives].setTexture('emptyHeart');
        scene.player.setTint(0xffff00);
        scene.cameras.main.shake(300, 0.005);
        scene.isInvincible = true;

        scene.time.delayedCall(1500, () => {
            scene.player.clearTint();
            scene.isInvincible = false;
        });

        if (scene.lives === 0) {
            console.log("Sono nella takeDamage");
            die(scene, sceneName);
        }
    }
}

function explode(scene, acorn) {
    let explosion = scene.add.sprite(acorn.x, acorn.y, 'explosion1');
    explosion.setScale(scene.personalScale);
    explosion.play('explode');

    explosion.rotation = acorn.rotation;
    acorn.destroy();
}

export function die(scene, sceneName) {
    console.log("Sono nella funzione die");
    scene.gameOver = true;
    scene.isInvincible = true;
    scene.input.keyboard.removeAllKeys(true);
    scene.player.setVelocityX(0);
    scene.player.anims.play('turn');
    scene.player.anims.stop();
    scene.player.setTintFill(0xff0000);
    if (scene.music && scene.music.isPlaying) {
        scene.music.stop();
    }
    scene.gameOverSound.play();
    let reason = "died";
    if (scene.sugarCollected >= scene.sugarNumber &&
        scene.strawberryCollected >= scene.strawberryNumber &&
        scene.blueberryCollected >= scene.blueberryNumber &&
        scene.appleCollected >= scene.appleNumber &&
        scene.hazelnutCollected >= scene.hazelnutNumber &&
        scene.milkCollected >= scene.milkNumber){
        reason = "failed";
    }        
    scene.time.delayedCall(1000, () => {
        scene.cameras.main.fadeOut(800, 0, 0, 0);
        scene.time.delayedCall(800, () => {
            scene.scene.start('GameOverScene', { callingScene: sceneName, reason: reason });
        });
    });
}

export function win(scene, sceneName) {
    scene.victory = true;
    scene.isInvincible = true;
    scene.input.keyboard.removeAllKeys(true);
    scene.player.setVelocityX(0);
    scene.player.anims.play('turn');
    scene.player.anims.stop();
    scene.time.delayedCall(1000, () => {
        if (scene.music && scene.music.isPlaying) {
            scene.music.stop();
        }
        //scene.gameOverSound.play();

        scene.time.delayedCall(1000, () => {
            scene.cameras.main.fadeOut(800, 0, 0, 0);
            scene.time.delayedCall(800, () => {
                if (sceneName === 'FirstScene'){
                    scene.scene.start('VictoryScene');
                }
                else {
                    scene.scene.start('Victory2Scene', { callingScene: sceneName });
                }
            });
        });
    })
}