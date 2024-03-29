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
let LIGHT_TEST = false;
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
    "3": Squiggle,
}

function preload() {
    PRELOADS = {
        all: {
            crumpledPaper: loadImage("images/crumpled-paper-texture.jpeg"),
            paper: loadImage("images/paper.jpg"),
            parchment: loadImage("images/parchment.jpg"),
        },
        whiteRabbit: {
            fonts: {
                cn: loadFont("images/仓迹高德国妙黑.ttf"),
                kr: loadFont("images/Gugi-Regular.ttf"),
                vn: loadFont("images/BigShouldersText-SemiBold.ttf")
            },
            rabbit: loadImage("images/big-white-rabbit.png"),
        },
        squiggle: {
            rat: loadImage("images/zodiac/rat.png"),
            ox: loadImage("images/zodiac/cow.png"),
            tiger: loadImage("images/zodiac/tiger.png"),
            rabbit: loadImage("images/zodiac/rabbit.png"),
            dragon: loadImage("images/zodiac/dragon.png"),
            snake: loadImage("images/zodiac/snake.png"),
            horse: loadImage("images/zodiac/horse.png"),
            ram: loadImage("images/zodiac/ram.png"),
            monkey: loadImage("images/zodiac/monkey.png"),
            rooster: loadImage("images/zodiac/rooster.png"),
            dog: loadImage("images/zodiac/dog.png"),
            pig: loadImage("images/zodiac/pig.png"),
        }
    }
}

function setup() {
    push();
    grid = IS_PROD ? 120 : Math.floor(window.innerWidth / 32);
    createCanvas(grid * 32, grid * 9);
    if (IS_PROD) {
        pixelDensity(1);
    }

    mgr = new SceneManager();
    frameRate(60);
    Object.values(SCENES).forEach(scene => mgr.addScene(scene));

    mgr.showScene(Squiggle);
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