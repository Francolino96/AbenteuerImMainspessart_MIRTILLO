class CharacterSelectionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CharacterSelectionScene' });
    }

    preload() {
        // Carica i personaggi (aggiungi altre immagini se necessario)
        this.load.image('player1', 'assets/Sprites_static_player_m.png');
        this.load.image('player2', 'assets/Sprites_static_player_f.png');
    }

    create() {
        this.cameras.main.fadeIn(800, 0, 0, 0);
        this.personalScale = (this.scale.height + this.scale.width)/2200;
        this.selectedCharacter = 1; // Default

        this.selectionBox = this.add.rectangle(this.scale.width / 2 - 150*this.personalScale, this.scale.height / 2, 200*this.personalScale, 250*this.personalScale, 0xffff88).setStrokeStyle(2, 0xffff88).setOrigin(0.5);
        this.char1 = this.add.image(this.scale.width / 2 - 150*this.personalScale, this.scale.height / 2, 'player1').setInteractive().setScale(1.8*this.personalScale).setOrigin(0.5);
        this.char2 = this.add.image(this.scale.width / 2 + 150*this.personalScale, this.scale.height / 2, 'player2').setInteractive().setScale(1.8*this.personalScale).setOrigin(0.5);

        // Cliccando su un personaggio, lo seleziona
        this.char1.on('pointerdown', () => this.selectCharacter(1, this.scale.width / 2 - 150*this.personalScale));
        this.char2.on('pointerdown', () => this.selectCharacter(2, this.scale.width / 2 + 150*this.personalScale));
        this.input.keyboard.on('keydown-LEFT', () => this.changeCharacter(-1));
        this.input.keyboard.on('keydown-RIGHT', () => this.changeCharacter(1));

        this.add.text(this.scale.width / 2, this.selectionBox.y - this.selectionBox.height/2 - 100*this.personalScale, 'Wähle einen Spieler', { 
            fontFamily: 'PressStart2P', 
            fontSize: 35*this.personalScale,
            fill: '#fff' 
        }).setOrigin(0.5);

        // Pulsante per confermare
        this.startButton = this.add.text(this.scale.width / 2, this.selectionBox.y + this.selectionBox.height/2 + 100*this.personalScale, 'START', { 
            fontFamily: 'PressStart2P',
            fontSize: 30*this.personalScale, 
            fill: '#fff', 
            backgroundColor: '#000' 
        }).setOrigin(0.5);

        this.startButton.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.startButton.width, this.startButton.height), Phaser.Geom.Rectangle.Contains);

        this.startButton.on('pointerdown', () => {
            this.startButton.disableInteractive();
            this.goToNextScene();
        });
        this.input.keyboard.on('keydown-ENTER', () => {
            this.input.keyboard.removeAllListeners('keydown-ENTER');
            this.goToNextScene();
        });
    }

    changeCharacter(direction) {
        if (direction === -1) {
            // Se si preme sinistra, seleziona il primo personaggio
            this.selectCharacter(1, this.scale.width / 2 - 150*this.personalScale);
        } else if (direction === 1) {
            // Se si preme destra, seleziona il secondo personaggio
            this.selectCharacter(2, this.scale.width / 2 + 150*this.personalScale);
        }
    }

    selectCharacter(character, x) {
        this.selectedCharacter = character;
        this.selectionBox.setPosition(x, this.scale.height / 2);
    }

    goToNextScene() {
        this.cameras.main.fadeOut(800, 0, 0, 0);
        this.time.delayedCall(800, () => {
            this.scene.start('BootScene', { chosenCharacter: this.selectedCharacter });
        });
    }
}

export default CharacterSelectionScene;
