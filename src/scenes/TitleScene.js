class TitleScene extends Phaser.Scene {
    constructor(){
        super({key: 'TitleScene'});
    }

    preload () {
        this.load.image('forest_background', 'assets/forest_background.jpg');
        let newFont = new FontFace('PressStart2P', 'url(PressStart2P-Regular.ttf)');
        newFont.load().then(function(loadedFont) {
            document.fonts.add(loadedFont);
        });
    }

    create(){
        this.personalScale = (this.scale.height + this.scale.width)/2200;
        this.background = this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'forest_background');
        const aspectRatio = this.background.width / this.background.height;
        let newBackgroundWidth, newBackgroundHeight;
        if (this.scale.width / this.scale.height > aspectRatio) {
            newBackgroundWidth = this.scale.width;
            newBackgroundHeight = newBackgroundWidth / aspectRatio;
        } else {
            newBackgroundHeight = this.scale.height;
            newBackgroundWidth = newBackgroundHeight * aspectRatio;
        }
        this.background.setDisplaySize(newBackgroundWidth, newBackgroundHeight);
        const title = this.add.text(this.scale.width / 2, this.scale.height * 0.4, 'Abenteuer', { 
            fontFamily: 'PressStart2P', 
            fontSize: 60*this.personalScale, 
            fill: '#fff',
            align: 'center'
        }).setOrigin(0.5);
        
        this.add.text(this.scale.width / 2, title.y + title.height, 'im Main-Spessart', { 
            fontFamily: 'PressStart2P', 
            fontSize: 34*this.personalScale, 
            fill: '#fff',
            align: 'center'
        }).setOrigin(0.5);

        let startButton = this.add.text(this.scale.width / 2, this.scale.height * 0.55, 'START', { 
            fontFamily: 'PressStart2P', 
            fontSize: 30*this.personalScale, 
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