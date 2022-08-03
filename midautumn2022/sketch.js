let pattern;
let mask;
let scallop;
let patternSize;
let scallopSize;
let DOUGH_RGB;
let HIGHLIGHT_RGB;
let SHADOW_RGB;
let scribble;
let t = 0;

function frameToTime(frame, loopFrames, prehold, duration) {
    // we take this total duration, and renormalize each frameCount within it
    // to a range [0, 1] - this converts frame count to 'time', where the unit of
    // time is 'one loop'.
    t = addHoldTime(frame % loopFrames / loopFrames, prehold, duration)
    return t;
}

function addHoldTime(t, prehold, duration) {
    // take a time from 0 to 1 and give it hold value on both sides:
    //             _
    // from / to _/

    // for smooth looping we may need to apply almostIdentity here from IQ's functions page
    return min(max(0, (t - prehold) / duration), 1);
}

function setup() {
    createCanvas(800, 600);
    patternSize = 200;

    DOUGH_RGB = color(210, 140, 50);
    HIGHLIGHT_RGB = color(250, 180, 80);
    SHADOW_RGB = color(150, 100, 30);
    scallopSize = patternSize * 1.5;
    pattern = createGraphics(patternSize, patternSize);
    pattern.frameRate(10);
    scribble = new Scribble(pattern);
    scribble.bowing = 0.2;
    scribble.roughness = 0.4;
    mask = createGraphics(patternSize * 1.2, patternSize * 1.2);
    scallop = createGraphics(scallopSize, scallopSize);
    makeScallops();
    mask.background('rgba(0, 0, 0, 0)')
    mask.fill('rgba(0, 0, 0, 1)')
    mask.circle(patternSize / 2, patternSize / 2, patternSize);
    mask.drawingContext.globalCompositeOperation = 'source-in';
}

function makeScallops() {
    // scallop could be done with gyrate
    // should we pass in the graphics element, instead of mutating global state?
    scallop.noStroke();
    scallop.background('rgba(0, 0, 0, 0)')
    const numScallops = 30;
    const stepSize = TAU / numScallops;
    const ringRadius = patternSize / 2;
    scallop.fill(SHADOW_RGB);
    for (let i = 0; i < numScallops; i++) {
        const diameter = TAU * ringRadius / numScallops * 1.5;
        x = cos(i * stepSize) * (ringRadius - 2 * diameter / numScallops);
        y = sin(i * stepSize) * (ringRadius - 2 * diameter / numScallops);
        scallop.circle(scallopSize / 2 + x, scallopSize / 2 + y, diameter * 1.2);
    }
    scallop.push();
    scallop.fill(DOUGH_RGB);
    for (let i = 0; i < numScallops; i++) {
        const diameter = TAU * ringRadius / numScallops * 1.5;
        x = cos(i * stepSize) * (ringRadius - 2 * diameter / numScallops);
        y = sin(i * stepSize) * (ringRadius - 2 * diameter / numScallops);
        scallop.circle(scallopSize / 2 + x, scallopSize / 2 + y, diameter);
    }
    scallop.pop();
    scallop.circle(scallopSize / 2 + 3, scallopSize / 2 + 3, patternSize);
}


function waffle() {
    t = frameToTime(frameCount, 300, 0.1, 0.8);
    eased = lerp(0, patternSize, widePulse(0.2, 0.8, 0.2, t));
    pattern.circle(patternSize / 2, patternSize / 2, patternSize - 5);
    for (let i = 0; i < 10; i++) {
        x = 10 * (2 * i + 1)
        pattern.line(x, 0, x, eased);
        pattern.line(0, x, eased, x);
    }
}

function gyrate(ctx, unitFunc, args, center, iterations, stepSize, callback) {
    // ctx: a graphics context from createGraphics
    // unitFunc: the func that draws something you want gyrated
    // args: list of any additional args you want to pass to unitFunc
    // center: vector representing where the center of the gyration should be
    // iterations: num iterations
    // stepSize (radians): how big the step size is
    // callback: any post-processing you need to do to args? (TODO: add 
    //   iterations + stepSize to the args before hitting callback)
    ctx.push()
    ctx.translate(center);
    for (let i = 0; i < iterations; i++) {
        ctx.rotate(stepSize);
        if (callback) {
            args = callback(args);
        }
        unitFunc.apply(null, args);
    }
    ctx.pop()
}

function flower(ctx) {
    t = frameToTime(frameCount, 300, 0, 1);
    ctx.push();
    eased = lerp(20, 40, 0.5 + 0.5 * sin(2 * TAU * t));
    ctx.strokeWeight(4);

    scribble.scribbleEllipse(100, 100, 80, 80);
    scribble.scribbleEllipse(100, 100, 60, 60);
    scribble.scribbleEllipse(100, 100, 40, 40);

    unit = () => {
        scribble.scribbleEllipse(0, 75, eased, 50);
    };
    num = 32;
    gyrate(ctx, unit, [], createVector(100, 100), num, TAU / num);
    ctx.pop();
}


function draw() {
    background(200, 200, 240);

    pattern.background(DOUGH_RGB);
    pattern.strokeWeight(6);
    pattern.strokeCap(SQUARE);
    pattern.fill('rgba(0, 0, 0, 0)');

    pattern.push();
    pattern.translate(3, 3);
    pattern.stroke(SHADOW_RGB);
    flower(pattern)
    pattern.pop();

    pattern.stroke(HIGHLIGHT_RGB);
    pattern.circle(patternSize / 2, patternSize / 2, patternSize - 5);
    flower(pattern)

    mask.image(pattern, 0, 0);
    image(scallop, mouseX - scallopSize / 2, mouseY - scallopSize / 2);
    image(mask, mouseX - patternSize / 2, mouseY - patternSize / 2);


    pattern.background(DOUGH_RGB);
    pattern.strokeWeight(6);
    pattern.strokeCap(SQUARE);
    pattern.fill('rgba(0, 0, 0, 0)');

    pattern.push();
    pattern.translate(3, 3);
    pattern.stroke(SHADOW_RGB);
    waffle();
    pattern.pop();

    pattern.stroke(HIGHLIGHT_RGB);
    pattern.circle(patternSize / 2, patternSize / 2, patternSize - 5);
    waffle();

    mask.image(pattern, 0, 0);
    image(scallop, mouseX - scallopSize / 2 - 250, mouseY - scallopSize / 2);
    image(mask, mouseX - patternSize / 2 - 250, mouseY - patternSize / 2);
}


// probably we should move these util functions into our own little lib
// rachel found these easing functions somewhere, I forget where. Perlin?
function getBias(time, bias) {
    return (time / ((((1.0 / bias) - 2.0) * (1.0 - time)) + 1.0));
}

function getGain(time, gain) {
    if (time < 0.5)
        return getBias(time * 2.0, gain) / 2.0;
    else
        return getBias(time * 2.0 - 1.0, 1.0 - gain) / 2.0 + 0.5;
}

function smoothstep(min, max, value) {
    var x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
};

// https://www.iquilezles.org/www/articles/functions/functions.htm
function cubicPulse(center, width, x) {
    x = abs(x - center);
    if (x > width) {
        return 0.0;
    }
    x /= width;
    return 1.0 - x * x * (3.0 - 2.0 * x);
}

// like cubicpulse but we can set there to be a plateau at the top
function widePulse(start, end, transition, x) {
    return smoothstep(start, start + transition, x) - smoothstep(end, end + transition, x);
}
