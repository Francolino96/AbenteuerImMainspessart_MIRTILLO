import {
    spawnDecor,
    spawnSkull,
    createIngredients,
    spawnGapEnemies,
    createWhiteMushroom,
    createFlies,
    updateEnemy,
    updateIngredients,
    updatePlayer,
    createPlayer,
    createGround,
    createPlatforms,
    initializeScene,
    initializeSceneInputs
} from '../utils.js';

class FieldsScene extends Phaser.Scene {

    constructor() {
        super({ key: 'FieldsScene' });
    }

    create() {     
        initializeScene(this, 'FieldsScene', 'fields_background');
        const gapPercentages = [0.2, 0.5, 0.8];
        this.gapWidth = 500 * this.personalScale;
        createGround(this, gapPercentages, this.gapWidth, false);

        spawnDecor(this, 1.6, true, 'appleTree1', 0.0003 * this.mapWidth, this.mapWidth * 0.4, this.mapWidth - 500 * this.personalScale, gapPercentages, this.gapWidth, this.boxWidth);
        spawnDecor(this, 1.6, true, 'appleTree2', 0.0003 * this.mapWidth, this.mapWidth * 0.4, this.mapWidth - 500 * this.personalScale, gapPercentages, this.gapWidth, this.boxWidth);
        spawnDecor(this, 1.6, true, 'appleTree3', 0.0003 * this.mapWidth, this.mapWidth * 0.4, this.mapWidth - 500 * this.personalScale, gapPercentages, this.gapWidth, this.boxWidth);
        
        createPlatforms(this, 3, this.lev3PlatformHeight, 6100);
        createPlatforms(this, 4, this.lev1PlatformHeight, 6420);
        createPlatforms(this, 2, this.lev2PlatformHeight, 6900);
        createPlatforms(this, 2, this.lev1PlatformHeight, 7150);
        createPlatforms(this, 1, this.lev2PlatformHeight, 7400);
        createPlatforms(this, 2, this.lev3PlatformHeight, 7510);
        createPlatforms(this, 3, this.lev3PlatformHeight, 7800);
        createPlatforms(this, 1, this.lev3PlatformHeight, 8260);

        createPlatforms(this, 5, this.lev1PlatformHeight, 2000);
        createPlatforms(this, 1, this.lev1PlatformHeight, 2680);
        createPlatforms(this, 2, this.lev3PlatformHeight, 2820);
        createPlatforms(this, 2, this.lev2PlatformHeight, 3100);
        createPlatforms(this, 1, this.lev1PlatformHeight, 3420);
        createPlatforms(this, 1, this.lev2PlatformHeight, 3590);
        createPlatforms(this, 1, this.lev2PlatformHeight, 3800);

        spawnDecor(this, 1, true, 'flower', 0.004 * this.mapWidth, 0, this.mapWidth, gapPercentages, this.gapWidth, this.boxWidth);
        spawnDecor(this, 1, true, 'grass', 0.015 * this.mapWidth, 0, this.mapWidth, gapPercentages, this.gapWidth, this.boxWidth);
        spawnDecor(this, 1.5, true, 'sunflowers', 0.002 * this.mapWidth, 400 * this.personalScale, this.mapWidth * 0.4, gapPercentages, this.gapWidth, this.boxWidth);
        spawnDecor(this, 1.2, true, 'hay', 2, this.mapWidth * 0.45, this.mapWidth * 0.95, gapPercentages, this.gapWidth, this.boxWidth);
        spawnDecor(this, 1, false, 'direction_board', 1, this.mapWidth * 0.35, this.mapWidth * 0.65, gapPercentages, this.gapWidth, this.boxWidth);
        spawnDecor(this, 1.3, true, 'fence', 6 * this.personalScale, 0, this.mapWidth - this.finishPoint *this.personalScale - 50 * this.personalScale, gapPercentages, this.gapWidth, this.boxWidth);
        spawnDecor(this, 1, false, 'end_board', 1, this.mapWidth - this.finishPoint *this.personalScale, this.mapWidth - this.finishPoint * this.personalScale, gapPercentages, this.gapWidth, this.boxWidth);
        spawnSkull(this, 'skull_1', gapPercentages, this.gapWidth, this.boxWidth);
        spawnSkull(this, 'skull_1', gapPercentages, this.gapWidth, this.boxWidth);
        spawnSkull(this, 'skull_2', gapPercentages, this.gapWidth, this.boxWidth);
        spawnSkull(this, 'skull_3', gapPercentages, this.gapWidth, this.boxWidth);

        createPlayer(this);

        createWhiteMushroom(this, 2200, this.mapHeight - 450 * this.personalScale);
        createWhiteMushroom(this, 6620, this.mapHeight - 450 * this.personalScale);
        createWhiteMushroom(this, 7950, this.mapHeight - 850 * this.personalScale);

        this.strawberryNumber = 5;
        this.strawberries = createIngredients(
            this,
            'strawberry',
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
        
        const excludedGaps = [];
        this.spiders = spawnGapEnemies(this, 'spider', gapPercentages, 250, 4, excludedGaps);
        createFlies(this, 4, 'fly', 2, 150);
        initializeSceneInputs(this, 'strawberry', 'sugar');
    }

    update() {
        if (this.gameOver || this.victory) return;
        updatePlayer(this);
        updateIngredients(this, this.sugar, { min: 100 * this.personalScale, max: this.mapWidth - 100 * this.personalScale - this.finishPoint *this.personalScale });
        updateIngredients(this, this.strawberries, { min: 100 * this.personalScale, max: this.mapWidth - 100 * this.personalScale - this.finishPoint *this.personalScale });
        this.spiders.forEach(({ enemy, bounds }) => {
            updateEnemy(this, enemy, bounds.lBound, bounds.rBound, 250);
        });
    }
}

export default FieldsScene;