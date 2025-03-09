class VictoryScene extends Phaser.Scene {
    constructor(){
        super({key: "VictoryScene"});
    }

    create() {
        this.personalScale = (this.scale.height + this.scale.width)/2000;
        this.cameras.main.setBackgroundColor("#000");
        this.cameras.main.fadeIn(800, 0, 0, 0);

        this.add.text(this.scale.width/2, this.scale.height/2 -200, "You collected\nall the\ningredients!", {
            fontFamily: "PressStart2P",
            fontSize: 35*this.personalScale, 
            fill: "#fff",
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(this.scale.width/2, this.scale.height/2, "Now we can\nmake gelato!", {
            fontFamily: "PressStart2P",
            fontSize: 35*this.personalScale, 
            fill: "#fff",
            align: 'center'
        }).setOrigin(0.5);

        let replayButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 250, "NEXT", {
            fontFamily: "PressStart2P",
            fontSize: 25*this.personalScale, 
            fill: "#0f0"
        }).setOrigin(0.5).setInteractive();

        replayButton.on("pointerdown", () => {
            this.cameras.main.fadeOut(800, 0, 0, 0);
            this.time.delayedCall(800, () => {
                this.scene.start("AnswerScene"); // Torna alla scena di gioco
            });
        });


    }
}
export default VictoryScene;