class AnswerScene extends Phaser.Scene {
    constructor(){
        super({key: "AnswerScene"});
    }

    create() {
        this.personalScale = (this.scale.height + this.scale.width)/2000;
        this.cameras.main.setBackgroundColor("#000");
        this.cameras.main.fadeIn(800, 0, 0, 0);

        this.add.text(this.scale.width/2, this.scale.height/2 -300, "How many strawberries\nare there in a\n gelato scoup?", {
            fontFamily: "PressStart2P",
            fontSize: 35*this.personalScale, 
            fill: "#fff",
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(this.scale.width/2, this.scale.height/2 +40, "5 strawberries", {
            fontFamily: "PressStart2P",
            fontSize: 35*this.personalScale, 
            fill: "#00f",
            align: 'center'
        }).setOrigin(0.5);

        let replayButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 350, "PLAY AGAIN", {
            fontFamily: "PressStart2P",
            fontSize: 25*this.personalScale, 
            fill: "#0f0"
        }).setOrigin(0.5).setInteractive();

        replayButton.on("pointerdown", () => {
            this.cameras.main.fadeOut(800, 0, 0, 0);
            this.time.delayedCall(800, () => {
                this.scene.start("FirstScene"); // Torna alla scena di gioco
            });
        });


    }
}
export default AnswerScene;