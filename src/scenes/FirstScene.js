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

class FirstScene extends Phaser.Scene {

    constructor() {
        super({ key: 'FirstScene' });
    }

    create() {     
        initializeScene(this, 'FirstScene', 'forest_background');
        const gapPercentages = [0.2, 0.5, 0.8];
        const gapWidth = 500 * this.personalScale;
        createGround(this, gapPercentages, gapWidth);

        spawnDecor(this, 1.8, true, 'tree_1', 0.001 * this.mapWidth, this.mapWidth * 0.2, this.mapWidth - 500 * this.personalScale, gapPercentages, this.mapWidth, gapWidth, this.boxWidth);
        spawnDecor(this, 1.8, true, 'tree_2', 0.001 * this.mapWidth, this.mapWidth * 0.2, this.mapWidth - 500 * this.personalScale, gapPercentages, this.mapWidth, gapWidth, this.boxWidth);
        spawnDecor(this, 1.8, true, 'tree_3', 0.001 * this.mapWidth, this.mapWidth * 0.2, this.mapWidth - 500 * this.personalScale, gapPercentages, this.mapWidth, gapWidth, this.boxWidth);
        spawnDecor(this, 1.8, true, 'tree_4', 0.001 * this.mapWidth, this.mapWidth * 0.2, this.mapWidth - 500 * this.personalScale, gapPercentages, this.mapWidth, gapWidth, this.boxWidth);

        createPlatforms(this, 2, this.lev3PlatformHeight, 100);
        createPlatforms(this, 3, this.lev1PlatformHeight, 300);
        createPlatforms(this, 1, this.lev2PlatformHeight, 600);
        createPlatforms(this, 4, this.lev2PlatformHeight, 800);
        createPlatforms(this, 1, this.lev3PlatformHeight, 1300);
        createPlatforms(this, 3, this.lev2PlatformHeight, 1700);
        createPlatforms(this, 3, this.lev1PlatformHeight, 2200);

        spawnDecor(this, 1, true, 'flower', 0.004 * this.mapWidth, 0, this.mapWidth, gapPercentages, this.mapWidth, gapWidth, this.boxWidth);
        spawnDecor(this, 1, true, 'grass', 0.015 * this.mapWidth, 0, this.mapWidth, gapPercentages, this.mapWidth, gapWidth, this.boxWidth);
        spawnDecor(this, 1, true, 'sunflowers', 10 * this.personalScale, this.mapWidth * 0.6, this.mapWidth * 0.7, gapPercentages, this.mapWidth, gapWidth, this.boxWidth);
        spawnDecor(this, 1, false, 'direction_board', 1, this.mapWidth * 0.35, this.mapWidth * 0.65, gapPercentages, this.mapWidth, gapWidth, this.boxWidth);
        spawnDecor(this, 1, false, 'end_board', 1, this.mapWidth - 300*this.personalScale, this.mapWidth - 300*this.personalScale, gapPercentages, this.mapWidth, gapWidth, this.boxWidth);
        spawnSkull(this, 'skull_1', gapPercentages, gapWidth, this.boxWidth);
        spawnSkull(this, 'skull_1', gapPercentages, gapWidth, this.boxWidth);
        spawnSkull(this, 'skull_2', gapPercentages, gapWidth, this.boxWidth);
        spawnSkull(this, 'skull_3', gapPercentages, gapWidth, this.boxWidth);

        createPlayer(this);

        this.blueberryNumber = 5;
        this.blueberries = createIngredients(
            this,
            'blueberry',
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
        spawnDecor(this, 1, true, 'sunflowers', 2 * this.personalScale, this.mapWidth * 0.6, this.mapWidth * 0.7, gapPercentages, gapWidth);       
        createAcorns(this, 4, 'ForestScene');
        createMushroom(this, this.mapWidth * 0.85);
        createEnemy(this, 500 * this.personalScale, 'boar', 300, 3);
        initializeSceneInputs(this, 'blueberry', 'sugar');
    }

    update() {
        if (this.gameOver || this.victory) return;
        updatePlayer(this);
        updateAcorns(this);
        updateIngredients(this, this.sugar, { min: 100 * this.personalScale, max: this.mapWidth - 100 * this.personalScale });
        updateIngredients(this, this.blueberries, { min: 100 * this.personalScale, max: this.mapWidth - 100 * this.personalScale });
        updateEnemy(this, 100 * this.personalScale, this.mapWidth - 100 * this.personalScale);
    }
}

export default FirstScene;