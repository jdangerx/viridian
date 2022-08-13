/**
 * To add a new scene:
 * 
 * 1. make a new Scene() function (see mooncakes.js). It should have its own
 *    setup and draw methods and live in its own file.
 * 2. Include that file in the <head> tag in index.html.
 * 3. Call mgr.addScene(YourScene) to the setup in this file.
 * 4. add a case in keyPressed so you can switch at leisure.
 */
let mgr;
P5Capture.setDefaultOptions({
    format: "webm",
    framerate: 60,
    width: 400,
});

function setup() {
    push();
    const IS_PROD = false;
    grid = IS_PROD ? 120 : Math.floor(window.innerWidth / 32);
    createCanvas(grid * 32, grid * 9);

    mgr = new SceneManager();
    mgr.addScene(Mooncakes);
    mgr.addScene(MatterTest);
    mgr.addScene(Phases);
    mgr.addScene(RisoTest);
    mgr.addScene(RisoTestJohn);
    mgr.addScene(MaskTest);
    mgr.addScene(GlowTest);

    mgr.showScene(Phases);
    pop();
}

function draw() {
    push();
    mgr.draw();
    pop();
}

function keyPressed() {
    switch (key) {
        case '1':
            console.log('Switching to Mooncakes.')
            mgr.showScene(Mooncakes);
            break;
        case '2':
            console.log('Switching to Matter Test.')
            mgr.showScene(MatterTest);
            break;
        case '3':
            console.log('Switching to Phases.')
            mgr.showScene(Phases);
            break;
        case '4':
            console.log('Switching to Riso.')
            mgr.showScene(RisoTest);
            break;
        case '5':
            console.log('Switching to Riso John.')
            mgr.showScene(RisoTestJohn);
            break;
        case '6':
            console.log('Switching to Mask Test.')
            mgr.showScene(MaskTest);
            break;
        case '7':
            console.log('Switching to Glow Test.')
            mgr.showScene(GlowTest);
            break;

    }

    // ... then dispatch via the SceneManager.
    mgr.handleEvent("keyPressed");
}