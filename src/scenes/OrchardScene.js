import {
    spawnDecor,
    spawnSkull,
    createIngredients,
    createAcorns,
    createBomb,
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

class OrchardScene extends Phaser.Scene {

    constructor() {
        super({ key: 'OrchardScene' });
    }

    create() {     
        initializeScene(this, 'OrchardScene', 'orchard_background');
        const gapPercentages = [0.2, 0.7];
        this.gapWidth = 500 * this.personalScale;
        createGround(this, gapPercentages, this.gapWidth, false);

        spawnDecor(this, 1.6, true, 'appleTree1', 0.0005 * this.mapWidth, this.mapWidth * 0.1, this.mapWidth - 500 * this.personalScale, gapPercentages, this.gapWidth, this.boxWidth);
        spawnDecor(this, 1.6, true, 'appleTree2', 0.0005 * this.mapWidth, this.mapWidth * 0.1, this.mapWidth - 500 * this.personalScale, gapPercentages, this.gapWidth, this.boxWidth);
        spawnDecor(this, 1.6, true, 'appleTree3', 0.0005 * this.mapWidth, this.mapWidth * 0.1, this.mapWidth - 500 * this.personalScale, gapPercentages, this.gapWidth, this.boxWidth);
        
        createPlatforms(this, 3, this.lev1PlatformHeight, 400);
        createPlatforms(this, 2, this.lev3PlatformHeight, 850);
        createPlatforms(this, 1, this.lev3PlatformHeight, 1150);
        createPlatforms(this, 2, this.lev3PlatformHeight, 1350);
        createPlatforms(this, 1, this.lev1PlatformHeight, 4000);
        createPlatforms(this, 2, this.lev2PlatformHeight, 4200);
        createPlatforms(this, 4, this.lev3PlatformHeight, 4600);
        createPlatforms(this, 1, this.lev1PlatformHeight, 5100);
        createPlatforms(this, 1, this.lev1PlatformHeight, 5300);
        createPlatforms(this, 1, this.lev2PlatformHeight, 5500);
        createPlatforms(this, 1, this.lev3PlatformHeight, 5700);
        createPlatforms(this, 1, this.lev1PlatformHeight, 7250);
        createPlatforms(this, 3, this.lev2PlatformHeight, 7500);
        createPlatforms(this, 1, this.lev1PlatformHeight, 7900);

        spawnDecor(this, 1, true, 'flower', 0.004 * this.mapWidth, 0, this.mapWidth, gapPercentages, this.gapWidth, this.boxWidth);
        spawnDecor(this, 1, true, 'grass', 0.015 * this.mapWidth, 0, this.mapWidth, gapPercentages, this.gapWidth, this.boxWidth);
        spawnDecor(this, 1, false, 'direction_board', 1, this.mapWidth * 0.35, this.mapWidth * 0.65, gapPercentages, this.gapWidth, this.boxWidth);
        spawnDecor(this, 1.3, true, 'fence', 6 * this.personalScale, 0, this.mapWidth - this.finishPoint *this.personalScale - 50 * this.personalScale, gapPercentages, this.gapWidth, this.boxWidth);
        spawnDecor(this, 1, false, 'end_board', 1, this.mapWidth - this.finishPoint *this.personalScale, this.mapWidth - this.finishPoint * this.personalScale, gapPercentages, this.gapWidth, this.boxWidth);
        spawnSkull(this, 'skull_1', gapPercentages, this.gapWidth, this.boxWidth);
        spawnSkull(this, 'skull_1', gapPercentages, this.gapWidth, this.boxWidth);
        spawnSkull(this, 'skull_2', gapPercentages, this.gapWidth, this.boxWidth);
        spawnSkull(this, 'skull_3', gapPercentages, this.gapWidth, this.boxWidth);

        createPlayer(this);
        createBomb(this, 1150, this.mapHeight - 830 * this.personalScale);
        createBomb(this, 4800, this.mapHeight - 830 * this.personalScale);
        createBomb(this, 7600, this.mapHeight - 630 * this.personalScale);
        createBomb(this, 9600, this.mapHeight - this.boxWidth + 20 * this.personalScale);

        this.appleNumber = 5;
        this.apples = createIngredients(
            this,
            'apple',
            { x: 12, y: 0, stepX: 200 },
            { min: 100, max: this.mapWidth - this.finishPoint * this.personalScale -50},
            { min: 50, max: 300 }
        );

        this.sugarNumber = 5;
        this.sugar = createIngredients(
            this,
            'sugar',
            { x: 12, y: 0, stepX: 200 },
            { min: 100, max: this.mapWidth - this.finishPoint * this.personalScale -50},
            { min: 50, max: 300 }
        );
        spawnDecor(this, 1, true, 'grass', 0.006 * this.mapWidth, 0, this.mapWidth, gapPercentages, this.gapWidth, this.boxWidth);       
        createAcorns(this, 4, 'OrchardScene');
        const excludedGaps = [];
        this.spiders = spawnGapEnemies(this, 'spider', gapPercentages, 250, 4, excludedGaps);
        initializeSceneInputs(this, 'apple', 'sugar');
    }

    update() {
        if (this.gameOver || this.victory) return;
        updatePlayer(this);
        updateAcorns(this);
        updateIngredients(this, this.sugar, { min: 100 * this.personalScale, max: this.mapWidth - 100 * this.personalScale - this.finishPoint *this.personalScale });
        updateIngredients(this, this.apples, { min: 100 * this.personalScale, max: this.mapWidth - 100 * this.personalScale - this.finishPoint *this.personalScale });
        this.spiders.forEach(({ enemy, bounds }) => {
            updateEnemy(this, enemy, bounds.lBound, bounds.rBound, 250);
        });
    }
}

export default OrchardScene;