class PreloaderScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloaderScene' });
    }

    init(data) {
        this.chosenCharacter = data.chosenCharacter;
    }

    preload() {
        // Imposta lo sfondo nero
        this.cameras.main.setBackgroundColor('#000');
        this.personalScale = (this.scale.height + this.scale.width)/2200;

        // Centro dello schermo
        let centerX = this.scale.width / 2;
        let centerY = this.scale.height / 2;

        // Crea un Graphics object che servirà per disegnare il rettangolo rosso (la "fill bar")
        let progressBar = this.add.graphics();

        // Registra l'evento "progress" per aggiornare il riempimento della barra
        this.load.on('progress', function (value) {
            progressBar.clear();
            progressBar.fillStyle(0xff0000, 1);

            // Calcola le dimensioni e la posizione della "fill bar"
            let fillWidth = 2 * 290 * value * this.personalScale; // 301 è la larghezza totale del frame
            let fillHeight = 90 * this.personalScale;        // Altezza totale
            let frameX = centerX - 290*this.personalScale;
            let frameY = centerY - (90/2)*this.personalScale;
            
            // Disegna il rettangolo rosso all'interno del frame
            progressBar.fillRect(frameX, frameY, fillWidth, fillHeight);
        }, this);

        // Mostra il frame della barra di caricamento
        // Assicurati che l'immagine 'chargingBarFrame' sia già stata caricata (es. in una BootScene)
        this.add.image(centerX, centerY, 'chargingBarFrame').setOrigin(0.5).setScale(this.personalScale);

        this.loadingText = this.add.text(
            this.scale.width / 2 - (10*30*this.personalScale)/2,
            this.scale.height / 2 - 100*this.personalScale,
            'Loading',
            { 
                fontFamily: 'PressStart2P', 
                fontSize: 30 * this.personalScale, 
                fill: '#fff',
                align: 'center'
            }
        ).setOrigin(0,0.5);

        const loadingStates = ['Loading', 'Loading.', 'Loading..', 'Loading...'];
        let currentIndex = 0;

        // Crea un evento ripetuto ogni 500ms per aggiornare il testo
        this.time.addEvent({
            delay: 500,
            loop: true,
            callback: () => {
                currentIndex = (currentIndex + 1) % loadingStates.length;
                this.loadingText.setText(loadingStates[currentIndex]);
            }
        });

        // Carica qui tutti gli asset necessari per il gioco
        if (this.chosenCharacter === 1){
            this.load.spritesheet('player', 'assets/Sprites_player_m.png', { 
                frameWidth: 72.5, 
                frameHeight: 99,
                margin: 1,
                spacing: 0,
            });
        }
        else if (this.chosenCharacter === 2){
            this.load.spritesheet('player', 'assets/Sprites_player_f.png', { 
                frameWidth: 59.86, 
                frameHeight: 92,
                margin: 1,
                spacing: 6.71,
            });
        }
        else console.log("Errore nel caricamento del chosenCharacter"); 
        
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/Sprites_ground.png');
        this.load.image('flower', 'assets/Sprites_flowers.png');
        this.load.image('grass', 'assets/Sprites_grass.png');
        this.load.image('deepGround', 'assets/Sprites_deep-ground.png');
        this.load.image('box', 'assets/Sprites_box.png');
        this.load.spritesheet('boar', 'assets/Sprites_boar.png', {
            frameWidth: 133,  // Larghezza di ogni frame
            frameHeight: 101  // Altezza di ogni frame
        });
        this.load.image('mushroom', 'assets/Sprites_mushroom.png');
        this.load.image('mushroom_smashed', 'assets/Sprites_mushroom_2.png');
        this.load.image('strawberry', 'assets/Sprites_strawberry.png');
        this.load.image('sugar', 'assets/Sprites_sugar_cube.png');
        this.load.image('blueberry', 'assets/Sprites_blueberry.png');
        this.load.image('acorn', 'assets/Sprites_acorn.png');
        
        // bottoni movimento
        this.load.image('buttonRight', 'assets/Sprites_right-arrow-button.png');
        this.load.image('buttonLeft', 'assets/Sprites_left-arrow-button.png');
        this.load.image('buttonUp', 'assets/Sprites_up-arrow-button.png');

        // audio
        this.load.audio('soundtrack', 'sounds/soundtrack.mp3');
        this.load.audio('jump', 'sounds/jump.mp3');
        this.load.audio('collect', 'sounds/coin.mp3');
        this.load.audio('gameStart', 'sounds/gameStart.mp3');
        this.load.audio('gameOver', 'sounds/gameOver.mp3');

        // bottoni volume
        this.load.image('volume_low', 'assets/Sprites_low-volume.png');
        this.load.image('volume_high', 'assets/Sprites_high-volume.png');
        this.load.image('volume_mute', 'assets/Sprites_no-volume.png');

        // vite
        this.load.image('emptyHeart', 'assets/Sprites_empty-heart.png');
        this.load.image('heart', 'assets/Sprites_heart.png');
    }

    create() {
        this.cameras.main.fadeIn(800, 0, 0, 0);
        this.cameras.main.fadeOut(800, 0, 0, 0); // 1000ms (1s) di transizione verso il nero
        this.time.delayedCall(800, () => {
            this.load.on('complete', function () {
                progressBar.destroy();
            });
            this.scene.start('FirstScene');        
        });
    }
}

export default PreloaderScene;
