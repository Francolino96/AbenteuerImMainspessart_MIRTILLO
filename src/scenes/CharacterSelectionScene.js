class CharacterSelectionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CharacterSelectionScene' });
    }

    preload() {
        // Carica i personaggi (aggiungi altre immagini se necessario)
        this.load.image('player1', 'assets/Sprites_boar.png');
        this.load.image('player2', 'assets/Sprites_mushroom.png');
    }

    create() {
        this.personalScale = (this.scale.height + this.scale.width)/2000;
        this.selectedCharacter = 'player1'; // Default

        this.add.text(this.scale.width / 2, this.scale.height / 2 - 140, 'Select the player', { 
            fontFamily: 'PressStart2P', 
            fontSize: 30*this.personalScale,
            fill: '#fff' 
        }).setOrigin(0.5);

        
        this.selectionBox = this.add.rectangle(this.scale.width / 2 - 100, this.scale.height / 2 + 50, 120, 120, 0xffff00).setStrokeStyle(2, 0xffff00).setOrigin(0.5);
        // Mostra il primo personaggio
        this.char1 = this.add.image(this.scale.width / 2 - 100, this.scale.height / 2 + 50, 'player1').setInteractive().setOrigin(0.5);
        this.char2 = this.add.image(this.scale.width / 2 + 100, this.scale.height / 2 + 50, 'player2').setInteractive().setOrigin(0.5);

        // Evidenzia il personaggio selezionato

        // Cliccando su un personaggio, lo seleziona
        this.char1.on('pointerdown', () => this.selectCharacter('player1', this.scale.width / 2 - 100));
        this.char2.on('pointerdown', () => this.selectCharacter('player2', this.scale.width / 2 + 100));

        // Pulsante per confermare
        this.startButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 340, 'START', { 
            fontFamily: 'PressStart2P',
            fontSize: 25*this.personalScale, 
            fill: '#fff', 
            backgroundColor: '#000' 
        })
            .setInteractive()
            .setOrigin(0.5);

        this.startButton.on('pointerdown', () => this.startGame());
    }

    selectCharacter(character, x) {
        this.selectedCharacter = character;
        this.selectionBox.setPosition(x, this.scale.height / 2 + 50);
    }

    startGame() {
        this.scene.start('FirstScene', { character: this.selectedCharacter });
    }
}

export default CharacterSelectionScene;
