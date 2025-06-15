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

        replayButton.on("pointerdown", () => {
            replayButton.disableInteractive();
            this.goToNextScene();
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