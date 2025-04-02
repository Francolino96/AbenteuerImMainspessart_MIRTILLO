import {
    spawnDecor,
    spawnSkull,
    createIngredients,
    createMushroom,
    createAcorns,
    updateAcorns,
    createEnemy,
    updateEnemy,
    updateIngredients,
    updatePlayer,
    createPlayer,
    createGround,
    createPlatforms,
    initializeScene,
    initializeSceneInputs
} from '../utils.js';

class OrchardScene extends Phaser.Scene {

    constructor() {
        super({ key: 'OrchardScene' });
    }

    create() {     
        initializeScene(this, 'OrchardScene', 'orchard_background');
        const gapPercentages = [0.2, 0.5, 0.8];
        const gapWidth = 500 * this.personalScale;
        createGround(this, gapPercentages, gapWidth);

        spawnDecor(this, 1.2, true, 'appleTree1', 0.001 * this.mapWidth, this.mapWidth * 0.2, this.mapWidth - 500 * this.personalScale, gapPercentages, this.mapWidth, gapWidth, this.boxWidth);
        spawnDecor(this, 1.2, true, 'appleTree2', 0.001 * this.mapWidth, this.mapWidth * 0.2, this.mapWidth - 500 * this.personalScale, gapPercentages, this.mapWidth, gapWidth, this.boxWidth);
        spawnDecor(this, 1.2, true, 'appleTree3', 0.001 * this.mapWidth, this.mapWidth * 0.2, this.mapWidth - 500 * this.personalScale, gapPercentages, this.mapWidth, gapWidth, this.boxWidth);
        
        createPlatforms(this, 2, this.lev3PlatformHeight, 100);
        createPlatforms(this, 3, this.lev1PlatformHeight, 300);
        createPlatforms(this, 1, this.lev2PlatformHeight, 600);
        createPlatforms(this, 4, this.lev2PlatformHeight, 800);
        createPlatforms(this, 1, this.lev3PlatformHeight, 1300);
        createPlatforms(this, 3, this.lev2PlatformHeight, 1700);
        createPlatforms(this, 3, this.lev1PlatformHeight, 2200);

        spawnDecor(this, 1, true, 'flower', 0.004 * this.mapWidth, 0, this.mapWidth, gapPercentages, this.mapWidth, gapWidth, this.boxWidth);
        spawnDecor(this, 1, true, 'grass', 0.015 * this.mapWidth, 0, this.mapWidth, gapPercentages, this.mapWidth, gapWidth, this.boxWidth);
        spawnDecor(this, 1, false, 'direction_board', 1, this.mapWidth * 0.35, this.mapWidth * 0.65, gapPercentages, this.mapWidth, gapWidth, this.boxWidth);
        spawnDecor(this, 1, false, 'end_board', 1, this.mapWidth - 300*this.personalScale, this.mapWidth - 300*this.personalScale, gapPercentages, this.mapWidth, gapWidth, this.boxWidth);
        spawnDecor(this, 1.3, true, 'fence', 6 * this.personalScale, 0, this.mapWidth, gapPercentages, this.mapWidth, gapWidth, this.boxWidth);
        spawnSkull(this, 'skull_1', gapPercentages, gapWidth, this.boxWidth);
        spawnSkull(this, 'skull_1', gapPercentages, gapWidth, this.boxWidth);
        spawnSkull(this, 'skull_2', gapPercentages, gapWidth, this.boxWidth);
        spawnSkull(this, 'skull_3', gapPercentages, gapWidth, this.boxWidth);

        createPlayer(this);

        this.appleNumber = 5;
        this.apples = createIngredients(
            this,
            'apple',
            { x: 12, y: 0, stepX: 200 },
            { min: 100, max: this.mapWidth - 350 * this.personalScale },
            { min: 50, max: 300 }
        );

        this.sugarNumber = 5;
        this.sugar = createIngredients(
            this,
            'sugar',
            { x: 12, y: 0, stepX: 200 },
            { min: 100, max: this.mapWidth - 350 * this.personalScale },
            { min: 50, max: 300 }
        );

        spawnDecor(this, 1, true, 'grass', 0.006 * this.mapWidth, 0, this.mapWidth, gapPercentages, gapWidth);       
        createAcorns(this, 4, 'OrchardScene');
        createEnemy(this, 500 * this.personalScale, 'snake', 800, 3);
        initializeSceneInputs(this, 'apple', 'sugar');
    }

    update() {
        if (this.gameOver || this.victory) return;
        updatePlayer(this);
        updateAcorns(this);
        updateIngredients(this, this.sugar, { min: 100 * this.personalScale, max: this.mapWidth - 100 * this.personalScale });
        updateIngredients(this, this.blueberries, { min: 100 * this.personalScale, max: this.mapWidth - 100 * this.personalScale });
        updateEnemy(this, 100 * this.personalScale, this.mapWidth - 100 * this.personalScale, 800);
    }
}

export default OrchardScene;