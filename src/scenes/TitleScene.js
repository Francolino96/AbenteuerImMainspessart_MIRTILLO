class TitleScene extends Phaser.Scene {
    constructor(){
        super({key: 'TitleScene'});
    }

    preload () {
        this.load.image('background_image', 'assets/sky.png');
    }

    create(){
        let background = this.add.sprite(0, 0, 'background_image');
        background.setOrigin(0, 0);

        this.add.text(300, 200, 'Il Mio Gioco', { fontSize: '32px', fill: '#fff' });

        let startButton = this.add.text(350, 300, 'START', { fontSize: '24px', fill: '#0f0' }).setInteractive();
        startButton.on('pointerdown', () => {
            this.scale.startFullscreen();
            this.scale.lockOrientation('landscape');
            this.scene.start('FirstScene');
        });
    }
}

export default TitleScene;