/**
 * To add a new scene:
 *
 * 1. make a new Scene() function (see mooncakes.js). It should have its own
 *    setup and draw methods and live in its own file.
 * 2. Include that file in the <head> tag in index.html.
 * 3. add a line in SCENES so you can switch at leisure.
 */

let mgr;
const IS_PROD = false;
const MINUTE = 60 * 60;

P5Capture.setDefaultOptions({
    format: "webm",
    framerate: 60,
    disableUi: false,
    duration: 5 * MINUTE,
    autoSaveDuration: 240,
    disablePixelScaling: true
});

const SCENES = {
    "1": WaterBlob,
    "2": WhiteRabbit,
}

function setup() {
    push();
    grid = IS_PROD ? 120 : Math.floor(window.innerWidth / 32);
    createCanvas(grid * 32, grid * 9);
    if (IS_PROD) {
        pixelDensity(1);
    }

    mgr = new SceneManager();
    Object.values(SCENES).forEach(scene => mgr.addScene(scene));

    mgr.showScene(WhiteRabbit);
    pop();
}

function draw() {
    push();
    mgr.draw();
    if (!IS_PROD) {
        const gapWidth = 0.003;
        noStroke();
        fill('rgba(0, 0, 0, 0.4)');
        rect(width * (1 - gapWidth) / 2, 0, width * gapWidth, height);
    }
    pop();

}

function keyPressed() {
    if (SCENES.hasOwnProperty(key)) {
        console.log(`Switching to ${SCENES[key].name}`);
        mgr.showScene(SCENES[key]);
    } else (
        console.log(`${key} pressed, no corresponding scene.`)
    )
    // ... then dispatch via the SceneManager.
    mgr.handleEvent("keyPressed");
}