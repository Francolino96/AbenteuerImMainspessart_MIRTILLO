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
        this.personalScale = (this.scale.height + this.scale.width)/2000;
        this.selectedCharacter = 1; // Default

        this.add.text(this.scale.width / 2, this.scale.height / 2 - 350, 'Select the player', { 
            fontFamily: 'PressStart2P', 
            fontSize: 30*this.personalScale,
            fill: '#fff' 
        }).setOrigin(0.5);

        
        this.selectionBox = this.add.rectangle(this.scale.width / 2 - 200, this.scale.height / 2 + 50, 300, 400, 0xffff88).setStrokeStyle(2, 0xffff88).setOrigin(0.5);
        // Mostra il primo personaggio
        this.char1 = this.add.image(this.scale.width / 2 - 200, this.scale.height / 2 + 50, 'player1').setInteractive().setScale(2*this.personalScale).setOrigin(0.5);
        this.char2 = this.add.image(this.scale.width / 2 + 200, this.scale.height / 2 + 50, 'player2').setInteractive().setScale(2*this.personalScale).setOrigin(0.5);

        // Evidenzia il personaggio selezionato

        // Cliccando su un personaggio, lo seleziona
        this.char1.on('pointerdown', () => this.selectCharacter(1, this.scale.width / 2 - 200));
        this.char2.on('pointerdown', () => this.selectCharacter(2, this.scale.width / 2 + 200));

        // Pulsante per confermare
        this.startButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 480, 'START', { 
            fontFamily: 'PressStart2P',
            fontSize: 25*this.personalScale, 
            fill: '#fff', 
            backgroundColor: '#000' 
        })
            .setOrigin(0.5);

        this.startButton.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.startButton.width, this.startButton.height), Phaser.Geom.Rectangle.Contains);

        this.startButton.on('pointerdown', () => this.startGame());
    }

    selectCharacter(character, x) {
        this.selectedCharacter = character;
        this.selectionBox.setPosition(x, this.scale.height / 2 + 50);
    }

    startGame() {
        this.cameras.main.fadeOut(800, 0, 0, 0);

        this.time.delayedCall(800, () => {
            this.scene.start('BootScene', { chosenCharacter: this.selectedCharacter });
        });
    }
}

export default CharacterSelectionScene;
