class VictoryScene extends Phaser.Scene {
    constructor(){
        super({key: "VictoryScene"});
    }

    create() {
        this.personalScale = (this.scale.height + this.scale.width)/2200;
        this.cameras.main.setBackgroundColor("#000");
        this.cameras.main.fadeIn(800, 0, 0, 0);

        this.add.text(this.scale.width/2, this.scale.height/2 -100*this.personalScale, "Du hast alle\nZutaten gesammelt!", {
            fontFamily: "PressStart2P",
            fontSize: 35*this.personalScale, 
            fill: "#fff",
            align: 'center'
        }).setOrigin(0.5);

        const text_2 = this.add.text(this.scale.width/2, this.scale.height/2, "Jetzt können wir\nEis machen!", {
            fontFamily: "PressStart2P",
            fontSize: 35*this.personalScale, 
            fill: "#fff",
            align: 'center'
        }).setOrigin(0.5);

        let replayButton = this.add.text(this.scale.width / 2, text_2.y + 100*this.personalScale, "WEITER", {
            fontFamily: "PressStart2P",
            fontSize: 30*this.personalScale, 
            fill: "#0f0"
        }).setOrigin(0.5).setInteractive();

        replayButton.on("pointerdown", () => {
            replayButton.disableInteractive();
            this.goToNextScene();
        });

        this.input.keyboard.on('keydown-ENTER', () => {
            this.input.keyboard.removeAllListeners('keydown-ENTER');
            this.goToNextScene();
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