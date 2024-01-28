let overall = 10;
let prehold = 0.0;
let duration = 0.10;
let hold = 1 - prehold - duration;
let cfg;
let chunks = [];

let MIN_QUAD_CORNER = 10;

let shadowOffset = 3;
let shadowWeight = 10;
let weight = 20;

let loopCounter = 0;
let doCapture = false;

let yellow;
let gold;
let magenta;
let cyan;
let persianBlue;
let rose;
let goldenRod;

const FPS = 60;
const MINUTE = 60 * FPS;
P5Capture.setDefaultOptions({
  format: "webm",
  framerate: 60,
  disableUi: false,
  duration: 5 * MINUTE,
  autoSaveDuration: 240,
  disablePixelScaling: true
});

const grid = 120; //doCapture ? 120 : Math.floor(window.innerWidth / 32);

function setup() {
  createCanvas(grid * 32, grid * 9);

  weight = window.innerWidth / 200;
  shadowWeight = weight;
  shadowOffset = weight * 0.5;

  cfg = {
    color: color(220, 0, 0),
    neg: 0,
    t: 0.5,
    weight: 10,
    offset: 10,
  }

  gold = color(230, 130, 30);
  yellow = color(255, 215, 0);
  magenta = color(255, 75, 255);
  cyan = color(0, 235, 235);
  persianBlue = color(21, 60, 180);
  rose = color(255, 65, 171);
  goldenRod = color(249, 172, 83);
}

function renormalize(t, prehold, duration) {
  // take a time from 0 to 1 and give it hold value on both sides:
  //             _
  // from / to _/

  return min(max(0, (t - prehold) / duration), 1);
}

let timeDone = false;
let timeStart = false;

function draw() {
  //background(0, 255, 255);
  //background(21, 60, 180);
  background(0);

  if (frameCount == 1 && doCapture) {
    const capturer = P5Capture.getInstance();
    capturer.start({ format: "webm", duration: 5 * MINUTE })
  }
  cfg.t = min(max(0.0001, (frameCount % overall - prehold * overall) / (duration * overall)), 1);

  if (frameCount % overall == 0) {
    loopCounter++;
    cfg.t = 0;
  }

  animation1();
  //animation2();
  //animation3();
  //animation4();
}

function animation1() {
  overall = 30 * FPS;
  duration = 1.0;
  // IMPORTANT. Order square points TL, BL, BR, TR (0, 0 is top left)

  weight = width * 0.0025;
  shadowWeight = weight * 1.5;
  shadowOffset = weight * 0.5;

  let cellSize = height / 27;
  const scale = ([x, y]) => [x * cellSize, y * cellSize];

  let outer1 = [
    [0, 0],
    [0, 5],
    [6, 5],
    [6, 0],
  ].map(scale);

  let inner1 = [
    [1, 1],
    [1, 4],
    [5, 4],
    [5, 1],
  ].map(scale);

  let outer2 = [
    [0, 2],
    [0, 13],
    [6, 13],
    [6, 2],
  ].map(scale);

  let inner2 = [
    [1, 3],
    [1, 12],
    [5, 12],
    [5, 3],
  ].map(scale);


  let numIters = 7;
  let xOffset = 0;
  let margin = cellSize * 1.5
  let center = width / 2 + margin / 2;
  for (i = 0; i < numIters; i++) {
    let preholdInterval = 0.05; // 0.25 is max value before the center prehold starts to go above 1
    let topBottomPrehold = preholdInterval;
    let centerPrehold = preholdInterval + topBottomPrehold;
    if (i % 2 == 0) {
      // every other one starts with the top/bottom already going, but the center takes an *extra* long time
      topBottomPrehold = 0;
      centerPrehold = centerPrehold + preholdInterval;
    }
    let xscale = 1.25
      + cos((cfg.t + i) * 10) * 0.2 * widePulse(0.0, 0.7, 0.3, cfg.t)
      + cos((cfg.t + i) * 30) * 0.2 * widePulse(0.0, 0.7, 0.3, cfg.t)
      ;
    let inner1Scaled = inner1.map(([x, y]) => [x * xscale, y]);
    let outer1Scaled = outer1.map(([x, y]) => [x * xscale, y]);

    let inner2Scaled = inner2.map(([x, y]) => [x * xscale, y]);
    let outer2Scaled = outer2.map(([x, y]) => [x * xscale, y]);


    // top
    drawPanel(cfg, inner1Scaled, outer1Scaled, createVector(center + xOffset, 2 * cellSize), topBottomPrehold, preholdInterval);
    // center
    drawPanel(cfg, inner2Scaled, outer2Scaled, createVector(center + xOffset, 6 * cellSize), centerPrehold, preholdInterval);
    // bottom
    drawPanel(cfg, inner1Scaled, outer1Scaled, createVector(center + xOffset, 20 * cellSize), topBottomPrehold, preholdInterval);

    let width = outer1Scaled[3][0];
    xOffset += width + margin;

    // because the xOffset is from the left, when we're doing the left side we need 
    // to take into account both the width of the panel we drew on the last iteration, 
    // and the width of the panel we're about to draw
    // top
    drawPanel(cfg, inner1Scaled, outer1Scaled, createVector(center - xOffset, 2 * cellSize), topBottomPrehold, preholdInterval);
    // center
    drawPanel(cfg, inner2Scaled, outer2Scaled, createVector(center - xOffset, 6 * cellSize), centerPrehold, preholdInterval);
    // bottom
    drawPanel(cfg, inner1Scaled, outer1Scaled, createVector(center - xOffset, 20 * cellSize), topBottomPrehold, preholdInterval);

  }
}

function animation2() {
  overall = 900;
  duration = 0.2;
  weight = width * 0.0035;
  shadowWeight = weight * 1.5;
  shadowOffset = weight * 0.5;

  const squareSize = 1.8 * grid;
  belt(cfg, grid, squareSize, 1);
  belt(cfg, 5 * grid, squareSize, -1);
}

function belt(cfg, margin, side, direction) {
  cfg.t = max(0.001, cfg.t);
  let third = 1 / 3;
  const fullPatternSize = side * 5 / 3;
  let height = margin + fullPatternSize;
  let frameBorderTop = [[0, margin], [width, margin]];
  let frameBorderBot = [[0, height], [width, height]];

  for (i = -3; i < width / fullPatternSize + 3; ++i) {
    let offset = (side * third) * (i + 1) + side * i;
    let topSquare = [[frameBorderTop[0][0] + offset, frameBorderTop[0][1]],
    [frameBorderTop[0][0] + offset, frameBorderTop[0][1] + side * 2 * third],
    [frameBorderTop[0][0] + offset + side, frameBorderTop[0][1] + side * 2 * third],
    [frameBorderTop[0][0] + offset + side, frameBorderTop[0][1]]];

    let offsetMid = offset - 2 * side / 3; // (side*third) * (i-4) + side * (i + 1); 
    // 
    let square = [[frameBorderTop[0][0] + offsetMid, frameBorderTop[0][1] + side * third],
    [frameBorderTop[0][0] + offsetMid, frameBorderTop[0][1] + side * third + side],
    [frameBorderTop[0][0] + offsetMid + side, frameBorderTop[0][1] + side * third + side],
    [frameBorderTop[0][0] + offsetMid + side, frameBorderTop[0][1] + side * third]];

    let botSquare = [[frameBorderBot[0][0] + offset, frameBorderBot[0][1]],
    [frameBorderBot[0][0] + offset, frameBorderBot[0][1] - side * 2 * third],
    [frameBorderBot[0][0] + offset + side, frameBorderBot[0][1] - side * 2 * third],
    [frameBorderBot[0][0] + offset + side, frameBorderBot[0][1]]];

    if (loopCounter == 0) {
      drawTrail(cfg, square, createVector(0, 0), 0.6, 0.4, 1);
      drawTrail(cfg, topSquare, createVector(0, 0), 0.2, 0.4, 0);
      drawTrail(cfg, botSquare, createVector(0, 0), 0.2, 0.4, 0);
    }
    else {
      let easedTime = getGain(cfg.t, 0.02);
      if (direction < 0) {
        easedTime = 1 - easedTime;
        if (cfg.t >= 0.5) {
          drawTrail(cfg, square, createVector(lerp(0, side * (1 + third), easedTime), 0), 0.0, 0.0, 1);
        }
        drawTrail(cfg, topSquare, createVector(0, 0), 0.0, 0, 0);
        drawTrail(cfg, botSquare, createVector(0, 0), 0., 0, 0);
        if (cfg.t < 0.5) {
          drawTrail(cfg, square, createVector(lerp(0, side * (1 + third), easedTime), 0), 0.0, 0.0, 1);
        }
      } else {
        if (cfg.t < 0.5) {
          drawTrail(cfg, square, createVector(lerp(0, side * (1 + third), easedTime), 0), 0.0, 0.0, 1);
        }
        drawTrail(cfg, topSquare, createVector(0, 0), 0.0, 0, 0);
        drawTrail(cfg, botSquare, createVector(0, 0), 0., 0, 0);
        if (cfg.t >= 0.5) {
          drawTrail(cfg, square, createVector(lerp(0, side * (1 + third), easedTime), 0), 0.0, 0.0, 1);
        }
      }
    }
  }

  if (loopCounter == 0) {
    drawTrail(cfg, frameBorderTop, createVector(0, 0), 0, 0.2, 0);
    drawTrail(cfg, frameBorderBot, createVector(0, 0), 0, 0.2, 0);
  }
  else {
    drawTrail(cfg, frameBorderTop, createVector(0, 0), 0, 0, 0);
    drawTrail(cfg, frameBorderBot, createVector(0, 0), 0, 0, 0);
  }
}

function animation3() {
  let size = createVector(350, 450);

  weight = window.innerWidth / 200;
  shadowWeight = weight;
  shadowOffset = weight * 0.5;

  let count = 7;
  let margin = createVector(100, 50);
  for (let i = 0; i < count; ++i) {
    let newSize = createVector(size.x, size.y);// - Math.cos((cfg.t + i * 0.2) * 4) * 150);
    let newMargin = createVector(100, 50);
    drawQuadPattern(createVector(newMargin.x + i * size.x, newMargin.y), i * 1 / count, 1 / count, newSize, 17);
  }
}

// be nice with divisibility of cell size
function drawQuadPattern(offset, prehold, duration, size, cellSize) {
  let oldWeight = weight;
  let oldShadowWeight = shadowWeight;
  let oldShadowOffset = shadowOffset;

  let cellsX = size.x / cellSize * 0.5;
  let cellsY = size.y / cellSize * 0.5;

  let fillNumX = cellsX - MIN_QUAD_CORNER;
  let fillNumY = cellsY - MIN_QUAD_CORNER;

  // These alternate weights look good in black and rose on a non-black background
  //shadowWeight = 0.7 * cellSize;
  //weight = 0.22 * cellSize;

  shadowWeight = 0.6 * cellSize;
  weight = 0.35 * cellSize;

  shadowOffset = 0.125 * cellSize;

  const scale = ([x, y]) => [x * cellSize, y * cellSize];

  let inner = [
    [-9, 4],
    [-7, 4],
    [-7, 9],
    [-10, 9],
    [-10, 10],
    [-9, 10],
    [-9, 7],
    [-4, 7],
    [-4, 9],
  ].map(([x, y]) => [x - fillNumX, y + fillNumY])
    .map(scale);

  let innerQuad = quadReflect(inner);
  let outer = [
    [10, 8],
    [5, 8],
    [5, 9],
    [6, 9],
    [6, 6],
    [9, 6],
    [9, 5],
    [8, 5],
    [8, 10],
  ].map(([x, y]) => [x + fillNumX, y + fillNumY])
    .map(scale);

  let outerQuad = quadReflect(outer);
  drawUnderstaffedTrail(cfg, innerQuad, offset, prehold, duration, true);
  drawUnderstaffedTrail(cfg, outerQuad.reverse(), offset, prehold, duration, true);

  weight = oldWeight;
  shadowWeight = oldShadowWeight;
  shadowOffset = oldShadowOffset;
}

function drawPanel(cfg, inner, outer, offset, prehold, duration) {

  let t = renormalize(cfg.t, prehold, duration);

  let stretchers = computeStretchers(inner, outer);

  cfg.offsetx = shadowOffset + offset.x;
  cfg.offsety = shadowOffset + offset.y;
  cfg.weight = shadowWeight;
  cfg.color = cyan;

  stretchers.forEach(s => snailTrail(cfg, s, false, t));
  snailTrail(cfg, outer, 1, t, true);
  snailTrail(cfg, inner, 1, t, true);

  cfg.color = magenta;
  cfg.weight = weight;
  cfg.offsetx = offset.x;
  cfg.offsety = offset.y;

  stretchers.forEach(s => snailTrail(cfg, s, false, t, true));
  snailTrail(cfg, outer, 1, t, true);
  snailTrail(cfg, inner, 1, t, true);
}

function drawTrail(cfg, points, offset, prehold, duration, loop, fadeIn) {
  let t = min(max(0, (cfg.t - prehold) / duration), 1);

  cfg.offsetx = shadowOffset + offset.x;
  cfg.offsety = shadowOffset + offset.y;
  cfg.weight = shadowWeight;
  //cfg.color = color(125, 25, 75);
  cfg.color = magenta;

  snailTrail(cfg, points, loop, t, fadeIn);

  //cfg.color = magenta;
  cfg.color = yellow;
  cfg.weight = weight;
  cfg.offsetx = offset.x;
  cfg.offsety = offset.y;

  snailTrail(cfg, points, loop, t, fadeIn);
}

function drawUnderstaffedTrail(cfg, points, offset, prehold, duration, loop) {
  let t = min(max(0, (cfg.t - prehold) / duration), 1);

  cfg.offsetx = shadowOffset + offset.x;
  cfg.offsety = shadowOffset + offset.y;
  cfg.weight = shadowWeight;
  cfg.color = goldenRod;

  understaffedSnailTrail(cfg, points, loop, t);

  cfg.color = color(255, 0, 30);
  cfg.weight = weight;
  cfg.offsetx = offset.x;
  cfg.offsety = offset.y;

  understaffedSnailTrail(cfg, points, loop, t);
}

function computeStretchers(inner, outer) {
  // TL BL BR TR
  // 0  3
  // 1  2
  let t = 0.5;
  let midY1 = lerp(inner[0][1], inner[1][1], t);
  let midY2 = lerp(inner[1][1], inner[0][1], t);
  let midX1 = lerp(inner[0][0], inner[2][0], t);
  let midX2 = lerp(inner[2][0], inner[0][0], t);
  let paddingY = outer[2][1] - inner[2][1];
  let paddingX = outer[2][0] - inner[2][0];
  let minX = outer[0][0];
  let minY = outer[0][1];
  let maxX = outer[2][0];
  let maxY = outer[2][1];

  stretchers = [
    [[minX, midY1], [minX + paddingX, midY1]],
    [[midX1, maxY], [midX1, maxY - paddingY]],
    [[maxX, midY2], [maxX - paddingX, midY2]],
    [[midX2, minY], [midX2, minY + paddingY]],
  ]

  //127 height
  //219 accross

  // 52 inches

  return stretchers;
}

function animation4() {
  let size = createVector(300, 400);

  weight = window.innerWidth / 200;
  shadowWeight = weight;
  shadowOffset = weight * 0.5;

  let count = 4;
  let margin = createVector(0, 70);
  let accumulatedWidth = 0;
  for (let i = 0; i < count; ++i) {
    let newMargin = createVector(margin.x, margin.y);
    let center = 1320 + newMargin.x / 2;

    let newX = size.x + Math.cos((cfg.t + i * 0.3) * 4) * 50;
    let newY = size.y + Math.cos((cfg.t + (i * 0.1)) * 15) * 75;
    let newSize = createVector(newX, newY);

    let offsetLeft = center + accumulatedWidth;
    if (offsetLeft + newSize.x > 2640) {
      newSize.x = 2640 - (center + accumulatedWidth);
    }
    let offsetRight = center - (accumulatedWidth + newSize.x);
    newMargin.y = newMargin.y + (size.y - newSize.y) * 0.5;
    drawQuadPattern(createVector(offsetLeft, newMargin.y), i * 0.5 / count, 0.5 / count, newSize, 17);
    drawQuadPattern(createVector(offsetRight, newMargin.y), i * 0.5 / count, 0.5 / count, newSize, 17);

    accumulatedWidth += newSize.x;
  }
}

function animation5() {
  overall = 200;
  noFill();
  let position = createVector(200, 200);
  let size = createVector(100, 100);
  arcUnit(cfg, position, size, 0, 2 * PI, cfg.t);
}

/**
 * Given a list of points - start a stroke from each point, and animate towards the next one.
 * @param {*} cfg
 * @param {*} points: list[list[int]] - list of [x, y] - vectorization happens here
 */
function snailTrail(cfg, points, loop, t, fadeIn) {
  if (t === 0) {
    return;
  }
  if (loop) {
    points
      .map(coords => createVector(...coords))
      .forEach((elt, i, arr) => {
        unit(cfg, elt, arr[(i + 1) % arr.length], t, fadeIn);
      });
  } else {
    points
      .map(coords => createVector(...coords))
      .forEach((elt, i, arr) => {
        if (i < arr.length - 1) {
          unit(cfg, elt, arr[i + 1], t, fadeIn);
        }
      });
  }
}

function understaffedSnailTrail(cfg, points, loop, t) {
  if (t === 0) {
    return;
  }
  let edges = points
    .map(coords => createVector(...coords))
    .map((elt, i, arr) => [elt, arr[(i + 1) % arr.length]]);

  if (!loop) {
    edges.pop();
  }

  let lengths = edges.map(([start, end]) => dist(start.x, start.y, end.x, end.y));
  let totalLength = lengths.reduce((acc, cur) => cur + acc);

  let walked = 0;
  for (i = 0; i < edges.length; i++) {
    let edge = edges[i];
    let prehold = walked / totalLength;
    let duration = lengths[i] / totalLength;
    let t_i = renormalize(t, prehold, duration);
    if (t_i !== 0) {
      unit(cfg, edge[0], edge[1], t_i);
    }
    walked += lengths[i];
  }
}

function unit(cfg, p1, p2, t, fadeIn) {
  let time = getGain(t, 0.3);

  let x = lerp(p1.x, p2.x, time);
  let y = lerp(p1.y, p2.y, time);

  let a = 255;
  if (fadeIn && t <= 0.1) {
    a = lerp(0, 255, t * 10);
  }


  let c = cfg.color;
  c.setAlpha(a);

  strokeCap(ROUND);
  stroke(c);
  strokeWeight(cfg.weight);

  line(p1.x + cfg.offsetx,
    p1.y + cfg.offsety,
    x + cfg.offsetx,
    y + cfg.offsety);
}

function arcUnit(cfg, position, size, angleStart, angleStop, t) {
  let time = getGain(t, 0.3);

  let x = lerp(angleStart, angleStop, time);

  strokeCap(ROUND);
  stroke(cfg.color);
  strokeWeight(cfg.weight);

  arc(position.x, position.y, size.x, size.y, angleStart, x, OPEN);
}

/*

Some possible enter/exit animations, to be potentially combined with render styles
* a gate with this pattern swings shut
* dropping in from the top of the screen
* screen wipe from top to bottom

Line render styles
* drop shadow rotates
* some sort of pulse/bulge moves along the path, like a snake digesting food
* from very blurry to in-focus
* lines starting to snail trail at different times, from outside in or inside out
*/

/**
path: list[list[int]] - a list of [x, y] coordinates to flip
axis: "LR" or "UD" - 
*/
function reflect(path, axis) {
  if (axis.toUpperCase() === "LR") {
    return path.concat(path.map(([x, y]) => [-x, y]).reverse());
  } else if (axis.toUpperCase() === "UD") {
    return path.concat(path.map(([x, y]) => [x, -y]).reverse());
  }
  throw "Axis was neither LR or UD, dingus!"
}


/**
* Reflect LR, then reflect that UD, then offset so that all the numbers are positive.
*/
function quadReflect(path) {
  let lr = reflect(path, "LR");
  let quad = reflect(lr, "UD");
  let minX = Math.min(...quad.map(([x, y]) => x))
  let minY = Math.min(...quad.map(([x, y]) => y))
  return quad.map(([x, y]) => [x - minX, y - minY]);
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