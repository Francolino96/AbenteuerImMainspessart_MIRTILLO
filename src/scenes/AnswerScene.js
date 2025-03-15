class AnswerScene extends Phaser.Scene {
    constructor(){
        super({key: "AnswerScene"});
    }

    create() {
        this.personalScale = (this.scale.height + this.scale.width)/2200;
        this.cameras.main.setBackgroundColor("#000");
        this.cameras.main.fadeIn(800, 0, 0, 0);

        this.add.text(this.scale.width/2, this.scale.height/2 -100*this.personalScale, "How many\nstrawberries\nare there in a\n gelato scoup?", {
            fontFamily: "PressStart2P",
            fontSize: 35*this.personalScale, 
            fill: "#fff",
            align: 'center'
        }).setOrigin(0.5);

        const text_2 = this.add.text(this.scale.width/2, this.scale.height/2, "5 strawberries", {
            fontFamily: "PressStart2P",
            fontSize: 35*this.personalScale, 
            fill: "#99f",
            align: 'center'
        }).setOrigin(0.5);

        let replayButton = this.add.text(this.scale.width / 2, text_2.y + 100*this.personalScale, "PLAY AGAIN", {
            fontFamily: "PressStart2P",
            fontSize: 25*this.personalScale, 
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
            this.scene.start("FirstScene");
        });
    }
}
export default AnswerScene;