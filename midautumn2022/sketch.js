let pattern;
let mask;
function setup() {
    createCanvas(800, 600);
    pattern = createGraphics(100, 100);
    mask = createGraphics(100, 100);
    mask.background('rgba(0, 0, 0, 0)')
    mask.fill('rgba(0, 0, 0, 1)')
    mask.circle(50, 50, 100);
    mask.drawingContext.globalCompositeOperation = 'source-in';
}

function draw() {
    background(0);
    pattern.background(200);
    for (let i = 0; i < 10; i++) {
        x = 10 * (2 * i + 1)
        pattern.line(x, 0, x, 200);
        pattern.line(0, x, 200, x);
    }
    mask.image(pattern, 0, 0);
    image(mask, mouseX - 50, mouseY - 50);
}