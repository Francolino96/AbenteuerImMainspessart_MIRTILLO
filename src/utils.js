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

export function createScores(scene) {
    const fontSize = 40 * scene.personalScale;
    scene.strawberryText = scene.add.text(50 * scene.personalScale + 1.5 * scene.margin, scene.margin + fontSize / 2, '0/' + scene.strawberryNumber, {
        fontFamily: 'PressStart2P',
        fontSize: fontSize,
        fill: '#fff'
    }).setOrigin(0, 0.5).setScrollFactor(0);
    let strawberryIcon = scene.add.image(scene.margin, scene.strawberryText.y + 5 * scene.personalScale, 'strawberry').setOrigin(0, 0.5).setScrollFactor(0).setScale(scene.personalScale * 0.85);
    strawberryIcon.angle = -40;

    scene.sugarText = scene.add.text(50 * scene.personalScale + 1.5 * scene.margin, scene.margin * 1.5 + fontSize * 1.5, '0/' + scene.sugarNumber, {
        fontFamily: 'PressStart2P',
        fontSize: fontSize,
        fill: '#fff'
    }).setOrigin(0, 0.5).setScrollFactor(0);
    let sugarIcon = scene.add.image(scene.margin, scene.sugarText.y, 'sugar').setOrigin(0, 0.5).setScrollFactor(0).setScale(scene.personalScale * 0.85);
    sugarIcon.angle = -10;

    scene.blueberryText = scene.add.text(50 * scene.personalScale + 1.5 * scene.margin, scene.margin * 2 + fontSize * 2.5, '0/' + scene.blueberryNumber, {
        fontFamily: 'PressStart2P',
        fontSize: fontSize,
        fill: '#fff' 
    }).setOrigin(0, 0.5).setScrollFactor(0);
    let blueberryIcon = scene.add.image(scene.margin, scene.blueberryText.y - 5 * scene.personalScale, 'blueberry').setOrigin(0, 0.5).setScrollFactor(0).setScale(scene.personalScale * 0.85);
    blueberryIcon.angle = 10;
}

export function spawnDecor(scene, scale, flip, texture, count, startingPoint, endingPoint, gapPercentages, mapWidth, gapWidth, boxWidth) {
    console.log("texture: ", texture);
    for (let i = 0; i < count; i++) {
        let x;
        do {
            x = Phaser.Math.Between(startingPoint, endingPoint);
        } while (isPositionInGap(scene.personalScale, x + 50 * scene.personalScale, gapPercentages, mapWidth, gapWidth) || isPositionInGap(scene.personalScale, x - 50 * scene.personalScale, gapPercentages, mapWidth, gapWidth));
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
    } while (isPositionInGap(scene.personalScale, x + 100 * scene.personalScale, gapPercentages, scene.mapWidth, gapWidth) || isPositionInGap(scene.personalScale, x - 100 * scene.personalScale, gapPercentages, scene.mapWidth, gapWidth));

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

export function isPositionInGap(personalScale, x, gapPercentages, mapWidth, gapWidth) {
    return gapPercentages.some(gap => {
        let gapStart = mapWidth * gap - gapWidth / 2;
        let gapEnd = mapWidth * gap + gapWidth / 2;
        return x > gapStart && x < gapEnd;
    });
}

export function createIngredients(scene, key, count, setXYConfig, xRange, yRange, scaleMultiplier = 0.95, bounceRange = { min: 0.4, max: 0.8 }) {
    let group = scene.physics.add.group({
        key: key,
        repeat: count - 1,
        setXY: setXYConfig
    });

    group.children.iterate((item) => {
        item.x = Phaser.Math.Between(xRange.min, xRange.max);
        item.y = Phaser.Math.Between(yRange.min, yRange.max);
        item.setBounceY(Phaser.Math.FloatBetween(bounceRange.min, bounceRange.max));
        item.setScale(scene.personalScale * scaleMultiplier).refreshBody();
        item.setSize(item.width * 0.70, item.height * 0.90);
    });
    return group;
}

export function updateIngredients(scene, group, xRange, gravityResetSpeed = 200) {
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
        scene.blueberryCollected >= scene.blueberryNumber) {
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
    scene.physics.add.collider(scene.player, scene.mushroom, (player, enemy) => hitEnemy(scene, player, enemy, 'FirstScene'), null, scene);
}

export function createBoar(scene, boxWidth, xPosition) {
    scene.boarSound = scene.sound.add('boar', { loop: false, volume: 0.5 });
    scene.boar = scene.physics.add.sprite(xPosition, scene.mapHeight - boxWidth, 'boar').setOrigin(0.5, 1);
    scene.boar.setScale(scene.personalScale * 1.2).refreshBody();
    scene.boar.setCollideWorldBounds(false);
    scene.boar.body.setAllowGravity(false);

    scene.anims.create({
        key: 'boarRun',
        frames: scene.anims.generateFrameNumbers('boar', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1
    });

    scene.boar.play('boarRun');
    scene.boar.setVelocityX(300 * scene.personalScale);
    scene.boar.setFlipX(false);
    scene.boarDirection = 1;

    //scene.physics.add.collider(scene.boar, scene.platforms);
    scene.physics.add.overlap(scene.player, scene.boar, (player, enemy) => hitEnemy(scene, player, enemy, 'FirstScene'), null, scene);
}

export function updateBoar(scene, lBound, rBound) {
    if (scene.boar.x >= rBound) {
        scene.boar.setVelocityX(-300 * scene.personalScale);
        scene.boar.setFlipX(true);
    } else if (scene.boar.x <= lBound) {
        scene.boar.setVelocityX(300 * scene.personalScale);
        scene.boar.setFlipX(false);
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
    if (scene.sugarCollected < scene.sugarNumber &&
        scene.strawberryCollected < scene.strawberryNumber &&
        scene.blueberryCollected < scene.blueberryNumber){
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