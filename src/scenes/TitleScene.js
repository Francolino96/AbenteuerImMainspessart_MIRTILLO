class TitleScene extends Phaser.Scene {
    constructor(){
        super({key: 'TitleScene'});
    }

    preload () {
        this.load.image('background_image', 'assets/sky.png');
    }

    create(){
        this.personalScale = (this.scale.height + this.scale.width)/2000;
        this.background = this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'background_image');
        this.background.setDisplaySize(this.scale.width, this.scale.height);
        let title = this.add.text(this.scale.width / 2, this.scale.height / 2 - 140, 'Abenteuer', { 
            fontFamily: 'PressStart2P', 
            fontSize: 50*this.personalScale, 
            fill: '#fff',
            align: 'center'
        }).setOrigin(0.5); // Centra il testo rispetto al punto di ancoraggio
        
        let subtitle = this.add.text(this.scale.width / 2, this.scale.height / 2 - 60, 'im Main-Spessart', { 
            fontFamily: 'PressStart2P', 
            fontSize: 28.3*this.personalScale, 
            fill: '#fff',
            align: 'center'
        }).setOrigin(0.5);

        let startButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 90, 'START', { 
            fontFamily: 'PressStart2P', 
            fontSize: 25*this.personalScale, 
            fill: '#0f0' 
        }).setOrigin(0.5).setInteractive();
        startButton.on('pointerdown', () => {
            /*
            this.scale.startFullscreen();
            this.scale.lockOrientation('landscape');*/
            this.scene.start('FirstScene');
        });
        this.scale.on('resize', this.resize, this);
    }

    resize(gameSize) {
        let { width, height } = gameSize;
        this.background.setDisplaySize(width, height);
    }
}

export default TitleScene;