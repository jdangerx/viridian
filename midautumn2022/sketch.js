let pattern;
let mask;
let scallop;
let patternSize;
let scallopSize;

let t = 0;

function frameToTime(frame) {
    const loopFrames = 300;
    const preHoldRatio = 0.1;
    // we take this total duration, and renormalize each frameCount within it
    // to a range [0, 1] - this converts frame count to 'time', where the unit of
    // time is 'one loop'.
    const durationRatio = 0.8;
    t = addHoldTime(frame % loopFrames / loopFrames, preHoldRatio, durationRatio)
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
    scallopSize = patternSize * 1.5;
    pattern = createGraphics(patternSize, patternSize);
    mask = createGraphics(patternSize, patternSize);
    scallop = createGraphics(scallopSize, scallopSize);
    scallop.noStroke();

    // scallop could be done with p5.polar
    scallop.background('rgba(0, 0, 0, 0)')
    scallop.fill(200);
    const numScallops = 30;
    const stepSize = TAU / numScallops;
    const bigRadius = patternSize / 2 * 1.1;
    for (let i = 0; i < numScallops; i++) {
        x = cos(i * stepSize) * bigRadius;
        y = sin(i * stepSize) * bigRadius;
        const smallDiameter = TAU * bigRadius / numScallops * 1.2;
        scallop.circle(scallopSize / 2 + x, scallopSize / 2 + y, smallDiameter);
    }
    scallop.fill(240);
    scallop.circle(scallopSize / 2, scallopSize / 2, 2 * bigRadius);
    mask.background('rgba(0, 0, 0, 0)')
    mask.fill('rgba(0, 0, 0, 1)')
    mask.circle(patternSize / 2, patternSize / 2, patternSize);
    mask.drawingContext.globalCompositeOperation = 'source-in';
}

function draw() {
    background(0);
    t = frameToTime(frameCount)
    pattern.background(200);
    pattern.stroke(240);
    pattern.strokeWeight(6);
    pattern.strokeCap(SQUARE);
    eased = lerp(0, 200, smoothstep(0.2, 0.8, t));
    for (let i = 0; i < 10; i++) {
        x = 10 * (2 * i + 1)
        pattern.line(x, 0, x, eased);
        pattern.line(0, x, eased, x);
    }
    mask.image(pattern, 0, 0);
    image(scallop, mouseX - scallopSize / 2, mouseY - scallopSize / 2);
    image(mask, mouseX - patternSize / 2, mouseY - patternSize / 2);
}

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
