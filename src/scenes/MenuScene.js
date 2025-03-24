class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        this.cameras.main.fadeIn(800, 0, 0, 0);
        this.personalScale = (this.scale.height + this.scale.width) / 2200;
        this.missions = ['Der Zauberwald', 'Die magischen\nGewässer', 'Die goldenen\nFelder', 'Der verzauberte\nObstgarten'];
        this.selectedMission = 0;

        this.title = this.add.text(this.scale.width / 2, this.scale.height * 0.25, 'Wähle eine Mission', { 
            fontFamily: 'PressStart2P',
            fontSize: 35 * this.personalScale, 
            fill: '#fff',
            align: 'center'
        }).setOrigin(0.5);

        this.menuItems = [];
        for (let i = 0; i < this.missions.length; i++) {
            let text = this.add.text(this.scale.width / 2, this.scale.height * 0.25 + 30 * this.personalScale + (i+1) * 80 *this.personalScale, this.missions[i], { 
                fontFamily: 'PressStart2P',
                fontSize: 25 * this.personalScale, 
                fill: '#fff',
                align: 'center',
                padding: { left: 10, right: 10, top: 5, bottom: 5 }
            })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.selectedMission = i;
                this.updateSelection();
            });

            this.menuItems.push(text);
        }

        this.startButton = this.add.text(this.scale.width / 2, this.scale.height * 0.25 + 6 * 80 *this.personalScale, 'START', { 
            fontFamily: 'PressStart2P',
            fontSize: 30 * this.personalScale, 
            fill: '#fff'
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
                item.setStyle({ fill: '#000', backgroundColor: '#ff0' });
            } else {
                item.setStyle({ fill: '#fff', backgroundColor: 'transparent' });
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
