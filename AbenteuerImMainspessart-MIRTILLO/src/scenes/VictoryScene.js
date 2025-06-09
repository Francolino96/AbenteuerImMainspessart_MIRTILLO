class VictoryScene extends Phaser.Scene {
    constructor(){
        super({key: "VictoryScene"});
    }

    create() {
        this.scale.refresh();
        this.personalScale = (this.scale.height + this.scale.width)/2200;
        this.cameras.main.setBackgroundColor("#000");
        this.cameras.main.fadeIn(800, 0, 0, 0);

        const text_1 = this.add.text(this.scale.width/2, this.scale.height/2 -140*this.personalScale, "Du hast\nalle Zutaten\ngesammelt!", {
            fontFamily: "PressStart2P",
            fontSize: 50*this.personalScale, 
            fill: "#fff",
            align: 'center'
        }).setOrigin(0.5);

        const text_2 = this.add.text(this.scale.width/2, text_1.y + 200 * this.personalScale, "Jetzt können wir\nEis machen!", {
            fontFamily: "PressStart2P",
            fontSize: 35*this.personalScale, 
            fill: "#fff",
            align: 'center'
        }).setOrigin(0.5);

        let replayButton = this.add.text(this.scale.width / 2, text_2.y + 150*this.personalScale, "WEITER", {
            fontFamily: "PressStart2P",
            fontSize: 35*this.personalScale, 
            fill: "#8896e3"
        }).setOrigin(0.5).setInteractive();

        if (!this.anims.exists('truckIdle')) {
            this.anims.create({
                key: 'truckIdle',
                frames: this.anims.generateFrameNumbers('truck', { start: 0, end: 2 }),
                frameRate: 8,
                repeat: -1
            });
        }
        if (!this.anims.exists('truckMove')) {
            this.anims.create({
                key: 'truckMove',
                frames: this.anims.generateFrameNumbers('truck', { start: 4, end: 6 }),
                frameRate: 8,
                repeat: -1
            });
        }

        const offscreenX = -100 * this.personalScale;
        const centerX    = this.scale.width / 2;
        const truckY     = this.scale.height - 240 * this.personalScale;
        this.truck = this.add.sprite(offscreenX, truckY, 'truck')
            .setOrigin(0.5, 1)
            .setScale(0.60 * this.personalScale);
        this.truck.play('truckMove');

        this.tweens.add({
            targets: this.truck,
            x: centerX,
            ease: 'Power2',
            duration: 2000,
            onComplete: () => {
                this.truck.play('truckIdle');
                replayButton.setInteractive();
            }
        });
        replayButton.disableInteractive();

        replayButton.on("pointerdown", () => {
            replayButton.disableInteractive();
            this.truck.play('truckMove');
            this.tweens.add({
                targets: this.truck,
                x: this.scale.width + 200* this.personalScale,
                ease: 'Power2',
                duration: 2000,
                onComplete: () => {
                    this.goToNextScene();
                }
            });
        });

        this.input.keyboard.on('keydown-ENTER', () => {
            this.input.keyboard.removeAllListeners('keydown-ENTER');
            replayButton.emit('pointerdown');
        });
    }

    goToNextScene() {
        this.cameras.main.fadeOut(800, 0, 0, 0);
        this.time.delayedCall(800, () => {
            this.scene.start("AnswerScene");
        });
    }
}
export default VictoryScene;