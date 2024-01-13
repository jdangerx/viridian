/**
 * To add a new scene:
 *
 * 1. make a new Scene() function (see mooncakes.js). It should have its own
 *    setup and draw methods and live in its own file.
 * 2. Include that file in the <head> tag in index.html.
 * 3. add a line in SCENES so you can switch at leisure.
 */

/*
P5Capture.setDefaultOptions({
    format: "webm",
    framerate: 60,
    disableUi: false,
    duration: 5 * MINUTE,
    autoSaveDuration: 240,
    disablePixelScaling: true
});
*/


let mgr;
const IS_PROD = false;
let LIGHT_TEST = false;
const MINUTE = 60 * 60;

const SCENES = {
    "1": Gradient,
    "2": Screens,
    "3": Solitare,
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

    mgr.showScene(Gradient);
    pop();
}

function preload() {
    PRELOADS = {
        tracer: {
            // load text for paths here...
        }
    }
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
    if (frameCount % 5 == 0) {
        const fps = getFrameRate();
        const sps = 60 / getFrameRate();
        if (document.getElementById("frame-rate")) {
            document.getElementById("frame-rate").innerHTML = `FPS:\t${fps.toFixed(2)}<br>60FPS would be this much faster than what you see:\t${sps.toFixed(2)}`;
        }
    }
    pop();
    if (LIGHT_TEST) {
        utils.lightTest();
    }
}

function keyPressed() {
    if (key === "l") {
        LIGHT_TEST = !LIGHT_TEST;
        document.getElementsByTagName('body')[0].style.background = `white`;
    }
    if (SCENES.hasOwnProperty(key)) {
        console.log(`Switching to ${SCENES[key].name}`);
        mgr.showScene(SCENES[key]);
    } else (
        console.log(`${key} pressed, no corresponding scene.`)
    )
    // ... then dispatch via the SceneManager.
    mgr.handleEvent("keyPressed");
}