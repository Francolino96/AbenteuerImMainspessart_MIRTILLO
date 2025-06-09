class TitleScene extends Phaser.Scene {
    constructor(){
        super({key: 'TitleScene'});
    }

    preload () {
        this.load.image('forest_background', 'assets/forest_background.png');
        this.load.image('water_background', 'assets/water_background.png');
        this.load.image('orchard_background', 'assets/orchard_background.png');
        this.load.image('fields_background', 'assets/fields_background.png');

        let newFont = new FontFace('PressStart2P', 'url(PressStart2P-Regular.ttf)');
        newFont.load().then(function(loadedFont) {
            document.fonts.add(loadedFont);
        });
    }

    create(){
        this.scale.refresh();
        this.personalScale = (this.scale.height + this.scale.width)/2200;

        this.background = this.add.sprite(0, 0, 'forest_background').setOrigin(0.5, 1);
        const aspectRatio = this.background.width / this.background.height;
        let newW, newH;
        if (this.scale.width / this.scale.height > aspectRatio) {
            newW = this.scale.width;
            newH = newW / aspectRatio;
        } else {
            newH = this.scale.height;
            newW = newH * aspectRatio;
        }
        newH *= 1.1;
        newW = newH * aspectRatio;
        this.background.setDisplaySize(newW, newH).setPosition(this.scale.width / 2, this.scale.height + 20 * this.personalScale);

        const title = this.add.text(this.scale.width / 2, this.scale.height * 0.4, 'Abenteuer', { 
            fontFamily: 'PressStart2P', 
            fontSize: 60*this.personalScale, 
            fill: '#1f1f1f',
            align: 'center'
        }).setOrigin(0.5);
        
        const subtitle = this.add.text(this.scale.width / 2, title.y + title.height, 'im Main-Spessart', { 
            fontFamily: 'PressStart2P', 
            fontSize: 34*this.personalScale, 
            fill: '#1f1f1f',
            align: 'center'
        }).setOrigin(0.5);

        let startButton = this.add.text(this.scale.width / 2, subtitle.y + subtitle.height + 100 * this.personalScale, 'START', { 
            fontFamily: 'PressStart2P', 
            fontSize: 35*this.personalScale, 
            fill: '#5a67b0' 
        }).setOrigin(0.5).setInteractive();

        // Controlla il sistema operativo
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const isAndroid = /android/i.test(userAgent);
        const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;

        // Scegli la posizione Y in base al sistema
        const posY = isIOS 
            ? this.scale.height - 170 * this.personalScale   // se è iOS
            : this.scale.height - 20 * this.personalScale;   // se è Android (o altro)

        this.add.text(
            this.scale.width/2, 
            posY, 
            'Copyright © 2025 Zambon Gelato\nAll rights reserved', 
            { 
                fontFamily: 'PressStart2P', 
                fontSize: 15 * this.personalScale, 
                fill: '#fff',
                align: 'center'
            }
        ).setOrigin(0.5, 1);

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