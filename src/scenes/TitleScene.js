class TitleScene extends Phaser.Scene {
    constructor(){
        super({key: 'TitleScene'});
    }

    preload () {
        this.load.image('background_image', 'assets/sky.png');
    }

    create(){
        this.background = this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'background_image');
        this.background.setDisplaySize(this.scale.width, this.scale.height);

        this.add.text(this.scale.width / 2 - 80, this.scale.height / 2 - 50, 'Abenteuer im Main-Spessart', { fontSize: '50px', fill: '#fff' });

        let startButton = this.add.text(this.scale.width / 2 - 40, this.scale.height / 2 + 50, 'START', { fontSize: '40px', fill: '#0f0' }).setInteractive();
        startButton.on('pointerdown', () => {
            this.scale.startFullscreen();
            this.scale.lockOrientation('landscape');
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