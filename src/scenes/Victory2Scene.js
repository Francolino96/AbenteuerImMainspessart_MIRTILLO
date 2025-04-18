class Victory2Scene extends Phaser.Scene {
    constructor(){
        super({key: "Victory2Scene"});
    }

    init(data) {
        this.callingScene = data.callingScene;
    }

    create() {
        this.scale.refresh();
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

        let replayButton = this.add.text(this.scale.width / 2 - 30* this.personalScale * 6, text_2.y + 150*this.personalScale, "NOCHMAL\nSPIELEN", {
            fontFamily: "PressStart2P",
            fontSize: 30*this.personalScale, 
            fill: "#0f0",
            align: 'center'
        }).setOrigin(0.5).setInteractive();

        let newMissionsButton = this.add.text(this.scale.width / 2 + 30* this.personalScale * 6, text_2.y + 150*this.personalScale, "WEITERE\nMISSIONEN", {
            fontFamily: "PressStart2P",
            fontSize: 30*this.personalScale, 
            fill: "#0f0",
            align: 'center'
        }).setOrigin(0.5).setInteractive();

        replayButton.on("pointerdown", () => {
            replayButton.disableInteractive();
            this.goToNextScene(this.callingScene);
        });

        newMissionsButton.on("pointerdown", () => {
            replayButton.disableInteractive();
            this.goToNextScene("MenuScene");
        });

        this.input.keyboard.on('keydown-ENTER', () => {
            this.input.keyboard.removeAllListeners('keydown-ENTER');
            this.goToNextScene();
        });
    }

    goToNextScene(nextMissionName) {
        this.cameras.main.fadeOut(800, 0, 0, 0);
        this.time.delayedCall(800, () => {
            this.scene.start(nextMissionName);
        });
    }
}
export default Victory2Scene;