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

function setup() {
    createCanvas(800, 600, WEBGL);

    mgr = new SceneManager();
    mgr.addScene(Mooncakes);
    mgr.addScene(Gates);
    mgr.addScene(Phases);

    mgr.showNextScene();
}

function draw() {
    mgr.draw();
}

function keyPressed() {
    // You can optionaly handle the key press at global level...
    switch (key) {
        case '1':
            console.log('Switching to Mooncakes.')
            mgr.showScene(Mooncakes);
            break;
        case '2':
            console.log('Switching to Gates.')
            mgr.showScene(Gates);
            break;
        case '3':
            console.log('Switching to Phases.')
            mgr.showScene(Phases);
            break;
    }

    // ... then dispatch via the SceneManager.
    mgr.handleEvent("keyPressed");
}