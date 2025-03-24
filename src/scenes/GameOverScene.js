class GameOverScene extends Phaser.Scene {
    constructor(){
        super({key: 'GameOverScene'});
    }

    init(data) {
        this.callingScene = data.callingScene;
    }
    
    create(){
        this.cameras.main.fadeIn(800, 0, 0, 0);
        this.personalScale = (this.scale.height + this.scale.width)/2200;
        this.cameras.main.setBackgroundColor('#444');

        this.add.text(this.scale.width / 2, this.scale.height * 0.45, 'Spiel vorbei!', { 
            fontFamily: 'PressStart2P', 
            fontSize: 50*this.personalScale, 
            fill: '#f00',
            align: 'center'
        }).setOrigin(0.5);

        let replayButton = this.add.text(this.scale.width / 2, this.scale.height * 0.55, 'NOCHMAL SPIELEN', { 
            fontFamily: 'PressStart2P', 
            fontSize: 30*this.personalScale, 
            fill: '#fff' 
        }).setOrigin(0.5).setInteractive();

        replayButton.on('pointerdown', () => {
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
            this.scene.start(this.callingScene);
        });
    }
}

export default GameOverScene;