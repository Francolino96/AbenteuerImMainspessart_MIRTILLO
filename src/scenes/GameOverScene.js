class GameOverScene extends Phaser.Scene {
    constructor(){
        super({key: 'GameOverScene'});
    }

    init(data) {
        this.callingScene = data.callingScene;
        this.reason = data.reason;
    }
    
    create(){
        console.log("Sono nella gameOverScene"); 
        this.scale.refresh();
        this.cameras.main.fadeIn(800, 0, 0, 0);
        this.personalScale = (this.scale.height + this.scale.width)/2200;
        this.cameras.main.setBackgroundColor('#444');

        const firstText = this.add.text(this.scale.width / 2, this.scale.height * 0.35, 'Mission\ngescheitert', { 
            fontFamily: 'PressStart2P', 
            fontSize: 60*this.personalScale, 
            fill: '#f00',
            align: 'center'
        }).setOrigin(0.5);
        console.log("reason: ", this.reason)

        this.add.text(this.scale.width / 2, firstText.y + 120 * this.personalScale, 'Wir haben nicht\nalle Zutaten gesammelt', { 
            fontFamily: 'PressStart2P', 
            fontSize: 30*this.personalScale, 
            fill: '#f99',
            align: 'center'
        }).setOrigin(0.5);

        let replayButton;

        if (this.callingScene == 'FirstScene'){
            replayButton = this.add.text(this.scale.width / 2, firstText.y + 250 * this.personalScale, 'NOCHMAL SPIELEN', { 
                fontFamily: 'PressStart2P', 
                fontSize: 30*this.personalScale, 
                fill: '#fff' 
            }).setOrigin(0.5).setInteractive();

            this.input.keyboard.on('keydown-ENTER', () => {
                this.input.keyboard.removeAllListeners('keydown-ENTER');
                this.goToNextScene(this.callingScene);
            });
        }
        else {
            replayButton = this.add.text(this.scale.width / 2 - 30* this.personalScale * 6, firstText.y + 250 * this.personalScale, "NOCHMAL\nSPIELEN", {
                fontFamily: "PressStart2P",
                fontSize: 30*this.personalScale, 
                fill: "#fff",
                align: 'center'
            }).setOrigin(0.5).setInteractive();
    
            let newMissionsButton = this.add.text(this.scale.width / 2 + 30* this.personalScale * 6, firstText.y + 250 * this.personalScale, "WEITERE\nMISSIONEN", {
                fontFamily: "PressStart2P",
                fontSize: 30*this.personalScale, 
                fill: "#fff",
                align: 'center'
            }).setOrigin(0.5).setInteractive();
    
            newMissionsButton.on("pointerdown", () => {
                newMissionsButton.disableInteractive();
                this.goToNextScene("MenuScene");
            });
        }

        replayButton.on("pointerdown", () => {
            replayButton.disableInteractive();
            this.goToNextScene(this.callingScene);
        });
    }

    goToNextScene(nextMissionName) {
        this.cameras.main.fadeOut(800, 0, 0, 0);
        this.time.delayedCall(800, () => {
            this.scene.start(nextMissionName);
        });
    }
}

export default GameOverScene;