class TitleScene extends Phaser.Scene {
    constructor(){
        super({key: 'TitleScene'});
    }

    preload () {
        this.load.image('background_image', 'assets/sky.png');
        let newFont = new FontFace('PressStart2P', 'url(PressStart2P-Regular.ttf)');
        newFont.load().then(function(loadedFont) {
            document.fonts.add(loadedFont);
        });

    }

    create(){
        this.personalScale = (this.scale.height + this.scale.width)/2200;
        this.background = this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'background_image');
        this.background.setDisplaySize(this.scale.width, this.scale.height);
        const title = this.add.text(this.scale.width / 2, this.scale.height * 0.4, 'Abenteuer', { 
            fontFamily: 'PressStart2P', 
            fontSize: 50*this.personalScale, 
            fill: '#fff',
            align: 'center'
        }).setOrigin(0.5);
        
        this.add.text(this.scale.width / 2, title.y + title.height, 'im Main-Spessart', { 
            fontFamily: 'PressStart2P', 
            fontSize: 28.3*this.personalScale, 
            fill: '#fff',
            align: 'center'
        }).setOrigin(0.5);

        let startButton = this.add.text(this.scale.width / 2, this.scale.height * 0.55, 'START', { 
            fontFamily: 'PressStart2P', 
            fontSize: 25*this.personalScale, 
            fill: '#0f0' 
        }).setOrigin(0.5).setInteractive();

        startButton.on('pointerdown', () => {
            startButton.disableInteractive();
            this.goToNextScene();
        });

        this.input.keyboard.on('keydown-ENTER', () => {
            this.input.keyboard.removeAllListeners('keydown-ENTER');
            this.goToNextScene();
        });

        this.scale.on('resize', this.resize, this);
    }

    goToNextScene() {
        this.cameras.main.fadeOut(800, 0, 0, 0);
        this.time.delayedCall(800, () => {
            this.scene.start("CharacterSelectionScene");
        });
    }

    resize(gameSize) {
        let { width, height } = gameSize;
        this.background.setDisplaySize(width, height);
    }
}

export default TitleScene;