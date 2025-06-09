import {
    spawnDecor,
    spawnSkull,
    createIngredients,
    createMushroom,
    createAcorns,
    updateAcorns,
    spawnGapEnemies,
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
        //const gapPercentages = [0.2, 0.5, 0.8];
        const gapPercentages = [];
        this.gapWidth = 500 * this.personalScale;
        createGround(this, gapPercentages, this.gapWidth, false);

        spawnDecor(this, 1.8, true, 'tree_1', 0.001 * this.mapWidth, this.mapWidth * 0.2, this.mapWidth - 500 * this.personalScale, gapPercentages, this.gapWidth, this.boxWidth);
        spawnDecor(this, 1.8, true, 'tree_2', 0.001 * this.mapWidth, this.mapWidth * 0.2, this.mapWidth - 500 * this.personalScale, gapPercentages, this.gapWidth, this.boxWidth);
        spawnDecor(this, 1.8, true, 'tree_3', 0.001 * this.mapWidth, this.mapWidth * 0.2, this.mapWidth - 500 * this.personalScale, gapPercentages, this.gapWidth, this.boxWidth);
        spawnDecor(this, 1.8, true, 'tree_4', 0.001 * this.mapWidth, this.mapWidth * 0.2, this.mapWidth - 500 * this.personalScale, gapPercentages, this.gapWidth, this.boxWidth);

        createPlatforms(this, 2, this.lev3PlatformHeight, 100);
        createPlatforms(this, 3, this.lev1PlatformHeight, 300);
        createPlatforms(this, 1, this.lev2PlatformHeight, 600);
        createPlatforms(this, 4, this.lev2PlatformHeight, 800);
        createPlatforms(this, 1, this.lev3PlatformHeight, 1300);
        createPlatforms(this, 3, this.lev2PlatformHeight, 1700);
        createPlatforms(this, 3, this.lev1PlatformHeight, 2200);

        spawnDecor(this, 1, true, 'flower', 0.004 * this.mapWidth, 0, this.mapWidth, gapPercentages, this.gapWidth, this.boxWidth);
        spawnDecor(this, 1, true, 'grass', 0.015 * this.mapWidth, 0, this.mapWidth, gapPercentages, this.gapWidth, this.boxWidth);
        spawnDecor(this, 1, false, 'direction_board', 1, this.mapWidth * 0.35, this.mapWidth * 0.65, gapPercentages, this.gapWidth, this.boxWidth);
        spawnDecor(this, 1, false, 'end_board', 1, this.mapWidth - this.finishPoint *this.personalScale, this.mapWidth - this.finishPoint *this.personalScale, gapPercentages, this.gapWidth, this.boxWidth);
        spawnSkull(this, 'skull_1', gapPercentages, this.gapWidth, this.boxWidth);
        spawnSkull(this, 'skull_1', gapPercentages, this.gapWidth, this.boxWidth);
        spawnSkull(this, 'skull_2', gapPercentages, this.gapWidth, this.boxWidth);
        spawnSkull(this, 'skull_3', gapPercentages, this.gapWidth, this.boxWidth);

        createPlayer(this);

        this.blueberryNumber = 0;
        this.blueberries = createIngredients(
            this,
            'blueberry',
            { x: 12, y: 0, stepX: 200 },
            { min: 100, max: this.mapWidth - this.finishPoint * this.personalScale - 50 },
            { min: 50, max: 300 }
        );

        this.sugarNumber = 0;
        this.sugar = createIngredients(
            this,
            'sugar',
            { x: 12, y: 0, stepX: 200 },
            { min: 100, max: this.mapWidth - this.finishPoint * this.personalScale - 50 }, 
            { min: 50, max: 300 }
        );

        spawnDecor(this, 1, true, 'grass', 0.006 * this.mapWidth, 0, this.mapWidth, gapPercentages, this.gapWidth, this.boxWidth);
        //createAcorns(this, 4, 'FirstScene');
        //createMushroom(this, this.mapWidth * 0.35);
        //createMushroom(this, this.mapWidth * 0.65);
        //createMushroom(this, this.mapWidth * 0.55);
        //createMushroom(this, this.mapWidth * 0.85);
        const excludedGaps = [];
        //this.boars = spawnGapEnemies(this, 'boar', gapPercentages, 250, 3, excludedGaps);
        initializeSceneInputs(this, 'blueberry', 'sugar');
    }

    update() {
        if (this.gameOver || this.victory) return;
        updatePlayer(this);
        //updateAcorns(this);
        updateIngredients(this, this.sugar, { min: 100 * this.personalScale, max: this.mapWidth - 100 * this.personalScale - this.finishPoint *this.personalScale });
        updateIngredients(this, this.blueberries, { min: 100 * this.personalScale, max: this.mapWidth - 100 * this.personalScale - this.finishPoint *this.personalScale });
        /*this.boars.forEach(({ enemy, bounds }) => {
            updateEnemy(this, enemy, bounds.lBound, bounds.rBound, 250);
        });*/
    }
}

export default FirstScene;