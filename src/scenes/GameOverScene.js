class GameOverScene extends Phaser.Scene {
    constructor(){
        super({key: 'GameOverScene'});
    }

    preload () {
    }

    create(){
        this.cameras.main.fadeIn(800, 0, 0, 0);
        this.personalScale = (this.scale.height + this.scale.width)/2000;
        this.cameras.main.setBackgroundColor('#444');

        this.add.text(this.scale.width / 2, this.scale.height / 2 - 140, 'Game Over!', { 
            fontFamily: 'PressStart2P', 
            fontSize: 50*this.personalScale, 
            fill: '#f00',
            align: 'center'
        }).setOrigin(0.5);

        let startButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 90, 'RETRY', { 
            fontFamily: 'PressStart2P', 
            fontSize: 25*this.personalScale, 
            fill: '#fff' 
        }).setOrigin(0.5).setInteractive();

        startButton.on('pointerdown', () => {
            this.cameras.main.fadeOut(800, 0, 0, 0);
            this.time.delayedCall(800, () => {
                this.scene.start('FirstScene');
            });
        });
    }

}

export default GameOverScene;