export function initializeScene(scene, sceneName, backgroundType) {
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
    scene.appleCollected = 0;
    scene.strawberryCollected = 0;
    scene.sugarCollected = 0;
    scene.blueberryCollected = 0;
    
    createSounds(scene);

    const bgSource = scene.textures.get(backgroundType).getSourceImage();
    const desiredHeight = scene.screenHeight + 10;
    const scaleFactor = desiredHeight / bgSource.height;
    
    scene.background = scene.add.tileSprite(
        scene.mapWidth / 2,
        scene.mapHeight,
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
    scene.boarSound = scene.sound.add('boar', { loop: false, volume: 0.5 });
    scene.collectSound = scene.sound.add('collect', { loop: false, volume: 0.08 });
    scene.gameOverSound = scene.sound.add('gameOver', { loop: false, volume: 0.3 });
    scene.jumpSound = scene.sound.add('jump', { loop: false, volume: 0.3 });
    scene.jumpOverSound = scene.sound.add('jumpOver', { loop: false, volume: 0.3 });
    scene.popSound = scene.sound.add('pop', { loop: false, volume: 0.5 });
    scene.music = scene.sound.add('soundtrack', { loop: true, volume: 0.5 });
    scene.music.play();
    scene.sound.setVolume(0.1);
}

export function createGround(scene, gapPercentages, gapWidth) {
    const numPlatforms = Math.ceil(scene.mapWidth / scene.platformWidth);

    for (let i = 0; i < numPlatforms; i++) {
        let platformX = i * scene.platformWidth + scene.platformWidth / 2;
        const isInGap = isPositionInGap(platformX, gapPercentages, scene.mapWidth, gapWidth);
        if (!isInGap) {
            let ground = scene.platforms.create(platformX, scene.mapHeight - scene.platformWidth / 2, 'ground')
                .setScale(scene.personalScale)
                .refreshBody();
            if (Math.random() < 0.5) {
                ground.setFlipX(true);
            }
        }
    }

    scene.deepGrounds = scene.physics.add.staticGroup();
    const numRows = Math.ceil((scene.screenHeight - (scene.mapHeight - scene.platformWidth / 2)) / scene.platformWidth);
    
    for (let row = 1; row <= numRows; row++) {
        for (let i = 0; i < numPlatforms; i++) {
            let platformX = i * scene.platformWidth + scene.platformWidth / 2;
            let isInGap = isPositionInGap(platformX, gapPercentages, scene.mapWidth, gapWidth);
            if (!isInGap) {
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
            }
        }
    }
}

export function createPlayer(scene) {
    scene.player = scene.physics.add.sprite(100, 500, 'player');
    scene.cameras.main.startFollow(scene.player, true, 0.08, 0.08);
    scene.player.setScale(scene.personalScale * 1.3).refreshBody();
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
        die(scene, scene.sceneName);
        scene.hearts.forEach((heart) => {
            heart.setTexture('emptyHeart');
        }); 
    }

    // Controllo fine livello
    if (scene.player.x > scene.mapWidth - 300 * scene.personalScale) {
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
            scene.appleCollected < scene.appleNumber ) {
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
        high: 0.4,
        low: 0.1,
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
        ingredient1
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
        ingredient2
    ).setOrigin(0, 0.5).setScrollFactor(0).setScale(scene.personalScale * 0.85);
    scene[ingredient2 + "Icon"].angle = getIconAngle(ingredient2);
}

export function spawnDecor(scene, scale, flip, texture, count, startingPoint, endingPoint, gapPercentages, mapWidth, gapWidth, boxWidth) {
    console.log("texture: ", texture);
    for (let i = 0; i < count; i++) {
        let x;
        do {
            x = Phaser.Math.Between(startingPoint, endingPoint);
        } while (isPositionInGap(x + 50 * scene.personalScale, gapPercentages, mapWidth, gapWidth) || isPositionInGap(x - 50 * scene.personalScale, gapPercentages, mapWidth, gapWidth));
        const decor = scene.add.image(x, scene.mapHeight - boxWidth + 1, texture)
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
    } while (isPositionInGap(x + 100 * scene.personalScale, gapPercentages, scene.mapWidth, gapWidth) || isPositionInGap(x - 100 * scene.personalScale, gapPercentages, scene.mapWidth, gapWidth));

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
        item.setSize(item.width * 0.70, item.height * 0.90);
    });
    scene.physics.add.collider(group, scene.platforms);
    scene.physics.add.overlap(scene.player, group, (player, item) => { collectIngredient(scene, player, item, key, scene.sceneName); }, null, scene);
    return group;
}

export function updateIngredients(scene, group, xRange, gravityResetSpeed = 200) {
    if (!group) return;
    group.children.iterate((item) => {
        if (item.y - item.displayHeight / 2 > scene.screenHeight) {
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

    if (scene.sugarCollected >= scene.sugarNumber &&
        scene.strawberryCollected >= scene.strawberryNumber &&
        scene.blueberryCollected >= scene.blueberryNumber &&
        scene.appleCollected >= scene.appleNumber ) {
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
        acorn.setSize(acorn.width * 0.70, acorn.height * 0.7);

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

export function createEnemy(scene, xPosition, enemy, velocity, numberOfSprites) {
    scene.enemy = scene.physics.add.sprite(xPosition, scene.mapHeight - scene.boxWidth, enemy).setOrigin(0.5, 1);
    scene.enemy.setScale(scene.personalScale * 1.2).refreshBody();
    scene.enemy.setCollideWorldBounds(false);
    scene.enemy.body.setAllowGravity(false);

    scene.anims.create({
        key: enemy + 'Run',
        frames: scene.anims.generateFrameNumbers(enemy, { start: 0, end: numberOfSprites-1 }),
        frameRate: 10,
        repeat: -1
    });

    scene.enemy.play(enemy + 'Run');
    scene.enemy.setVelocityX(velocity * scene.personalScale);
    scene.enemy.setFlipX(false);
    scene.enemyDirection = 1;

    //scene.physics.add.collider(scene.enemy, scene.platforms);
    scene.physics.add.overlap(scene.player, scene.enemy, (player, enemy) => hitEnemy(scene, player, enemy, scene.sceneName), null, scene);
}

export function updateEnemy(scene, lBound, rBound, velocity) {
    if (scene.enemy.x >= rBound) {
        scene.enemy.setVelocityX(-velocity * scene.personalScale);
        scene.enemy.setFlipX(true);
    } else if (scene.enemy.x <= lBound) {
        scene.enemy.setVelocityX(velocity * scene.personalScale);
        scene.enemy.setFlipX(false);
    }
}

function hitEnemy(scene, player, enemy, sceneName) {
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
        if (enemy.texture.key === 'boar') {
            scene.boarSound.play();
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
        scene.appleCollected >= scene.appleNumber ){
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