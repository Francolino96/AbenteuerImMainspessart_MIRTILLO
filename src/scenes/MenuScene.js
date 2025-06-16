class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        this.scale.refresh();
        this.cameras.main.fadeIn(800, 0, 0, 0);
        this.personalScale = (this.scale.height + this.scale.width) / 2200;

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

        this.missions = ['Der Zauberwald', 'Die magischen\nGewässer', 'Die goldenen\nFelder', 'Der verzauberte\nObstgarten'];
        this.selectedMission = 0;

        this.title = this.add.text(this.scale.width / 2, this.scale.height * 0.20, 'Wähle eine\nMission', { 
            fontFamily: 'PressStart2P',
            fontSize: 50 * this.personalScale, 
            fill: '#000',
            align: 'center'
        }).setOrigin(0.5);

        this.menuItems = [];
        let fontSize;
        let spacing;
        if (this.scale.height > this.scale.width){
            fontSize = 35 * this.personalScale;
            spacing = 1.2 * this.personalScale;
        }
        else {
            fontSize = 25 * this.personalScale;
            spacing = 0.8 * this.personalScale;
        }
        for (let i = 0; i < this.missions.length; i++) {
            let text = this.add.text(this.scale.width / 2, this.scale.height * 0.25 + 10 * this.personalScale + (i+1) * spacing * 80 *this.personalScale, this.missions[i], { 
                fontFamily: 'PressStart2P',
                fontSize: fontSize, 
                fill: '#000',
                align: 'center',
                padding: { left: 10, right: 10, top: 5, bottom: 5 }
            }).setOrigin(0.5).setInteractive().on('pointerdown', () => {
                this.selectedMission = i;
                this.updateSelection();
            });
            this.menuItems.push(text);
        }

        this.startButton = this.add.text(this.scale.width / 2, this.scale.height * 0.25 + 6 * spacing * 75 *this.personalScale, 'START', { 
            fontFamily: 'PressStart2P',
            fontSize: 35 * this.personalScale, 
            fill: '#5a67b0'
        }).setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => this.startMission());

        // Mappa delle scene definita come variabile membro della classe
        this.scenes = new Map([
            [0, "ForestScene"],
            [1, "WaterScene"],
            [2, "FieldsScene"],
            [3, "OrchardScene"]
        ]);

        this.input.keyboard.on('keydown-UP', () => this.changeSelection(-1));
        this.input.keyboard.on('keydown-DOWN', () => this.changeSelection(1));
        this.input.keyboard.on('keydown-ENTER', () => {this.input.keyboard.removeAllListeners('keydown-ENTER'); this.startMission()}); // Non passiamo più `scenes` come parametro

        this.updateSelection();
    }

    changeSelection(direction) {
        this.selectedMission = (this.selectedMission + direction + this.missions.length) % this.missions.length;
        this.updateSelection();
    }

    updateSelection() {
        this.menuItems.forEach((item, index) => {
            if (index === this.selectedMission) {
                item.setStyle({ fill: '#fff', backgroundColor: '#a9b6f5' });
            } else {
                item.setStyle({ fill: '#000', backgroundColor: 'transparent' });
            }
        });
    }

    startMission() {
        this.cameras.main.fadeOut(800, 0, 0, 0);
        const selectedScene = this.scenes.get(this.selectedMission);
        this.time.delayedCall(800, () => {
            this.scene.start("Boot2Scene", { selectedScene: selectedScene});
        });
    }
}

export default MenuScene;