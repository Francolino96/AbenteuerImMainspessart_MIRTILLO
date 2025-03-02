class GameOverScene extends Phaser.Scene {
    constructor(){
        super({key: 'GameOverScene'});
    }

    preload () {
    }

    create(){
        this.personalScale = (this.scale.height + this.scale.width)/2000;
        this.cameras.main.setBackgroundColor('#444');

        let title = this.add.text(this.scale.width / 2, this.scale.height / 2 - 140, 'Game Over!', { 
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
            this.scene.start('FirstScene');
        });
    }

}

export default GameOverScene;