let overall = 7000;
let prehold = 0.0;
let duration = 0.85;
let hold = 1 - prehold - duration;
let cfg;
let chunks = [];

let MIN_QUAD_CORNER = 10;

let shadowOffset = 3;
let shadowWeight = 10;
let weight = 15;

let loopCounter = 0;
let capturer = new CCapture({ format: 'webm', framerate: 60, name: "animation3-draw" });
let doCapture = true;

let yellow;
let gold;
let magenta;
let cyan;
let persianBlue;
let rose;
let goldenRod;

function setup() {
  //createCanvas(2640, 450);
  createCanvas(2640, 762);

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
  magenta = color(255, 0, 255);
  cyan = color(0, 255, 255);
  persianBlue = color(21, 60, 180);
  rose = color(246, 46, 151);
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
  background(21, 60, 180);

  if (frameCount == 1 && doCapture) {
    capturer.start();
  }
  cfg.t = min(max(0, (frameCount % overall - prehold * overall) / (duration * overall)), 1);

  if (frameCount % overall == 0) {
    loopCounter++;
    if (loopCounter === 1 && doCapture) {
      capturer.stop()
      capturer.save()
    }
  }

  //animation1();
  //animation2();
  animation3();
  if (loopCounter === 0 && doCapture) {
    capturer.capture(document.getElementById('defaultCanvas0'));
  }
}

function animation1() {
  // IMPORTANT. Order square points BL, TL, TR, BR

  let cellSize = 50;
  const scale = ([x, y]) => [x * cellSize, y * cellSize];

  let outer1 = [
    [1, 1],
    [1, 7],
    [7, 7],
    [7, 1]
  ].map(scale);

  let inner1 = [
    [2, 2],
    [2, 6],
    [6, 6],
    [6, 2],
  ].map(scale);

  let outer2 = [
    [1, 1],
    [1, 7],
    [12, 7],
    [12, 1]
  ].map(scale);

  let inner2 = [
    [2, 2],
    [2, 6],
    [11, 6],
    [11, 2],
  ].map(scale);

  drawPanel(cfg, inner1, outer1, createVector(0, 0), 0.0, 0.4);
  drawPanel(cfg, inner2, outer2, createVector(200, 150), 0.4, 0.6);
  drawPanel(cfg, inner1, outer1, createVector(650, 0), 0.0, 0.4);
}

function animation2() {
  belt(cfg, 40, 93, 1);
  belt(cfg, 240, 93, -1);
}

function belt(cfg, margin, side, direction) {
  cfg.t = max(0.001, cfg.t);
  let third = 1 / 3;
  let height = margin + side * (5 / 3);
  let frameBorderTop = [[0, margin], [width, margin]];
  let frameBorderBot = [[0, height], [width, height]];

  for (i = -3; i < 22; ++i) {
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
      if (direction < 0)
      {
        easedTime = 1-easedTime;
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
  let size = createVector(350, 350);

  let count = 7;
  let margin = createVector(100, 50);
  for (let i=0; i < count; ++i)
  {
    let newSize = createVector(size.x, size.y);// - Math.cos((cfg.t + i * 0.2) * 4) * 150);
    let newMargin = createVector(100, 50);
    drawQuadPattern(createVector(newMargin.x + i * size.x, newMargin.y), i * 1/count, 1/count, newSize, 15);
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

  weight = 0.7 * cellSize;
  shadowWeight = 0.22 * cellSize;
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
  cfg.weight = weight;
  cfg.color = magenta;

  stretchers.forEach(s => snailTrail(cfg, s, false, t));
  snailTrail(cfg, outer, 1, t);
  snailTrail(cfg, inner, 1, t);

  cfg.color = yellow;
  cfg.weight = shadowWeight;
  cfg.offsetx = offset.x;
  cfg.offsety = offset.y;

  stretchers.forEach(s => snailTrail(cfg, s, false, t));
  snailTrail(cfg, outer, 1, t);
  snailTrail(cfg, inner, 1, t);
}

function drawTrail(cfg, points, offset, prehold, duration, loop) {
  let t = min(max(0, (cfg.t - prehold) / duration), 1);

  cfg.offsetx = shadowOffset + offset.x;
  cfg.offsety = shadowOffset + offset.y;
  cfg.weight = weight;
  //cfg.color = color(125, 25, 75);
  cfg.color = rose;

  snailTrail(cfg, points, loop, t);

  //cfg.color = magenta;
  cfg.color = yellow;
  cfg.weight = shadowWeight;
  cfg.offsetx = offset.x;
  cfg.offsety = offset.y;

  snailTrail(cfg, points, loop, t);
}

function drawUnderstaffedTrail(cfg, points, offset, prehold, duration, loop) {
  let t = min(max(0, (cfg.t - prehold) / duration), 1);

  cfg.offsetx = shadowOffset + offset.x;
  cfg.offsety = shadowOffset + offset.y;
  cfg.weight = weight;
  cfg.color = color(0);

  understaffedSnailTrail(cfg, points, loop, t);

  cfg.color = rose;
  //cfg.color = yellow;
  cfg.weight = shadowWeight;
  cfg.offsetx = offset.x;
  cfg.offsety = offset.y;

  understaffedSnailTrail(cfg, points, loop, t);
}

function computeStretchers(inner, outer) {
  let midY = lerp(inner[1][0], inner[1][1], 0.5);
  let midX = lerp(inner[0][0], inner[2][0], 0.5);
  let paddingY = ((outer[2][1] - outer[0][1]) - (inner[2][1] - inner[0][1])) * 0.5
  let paddingX = ((outer[2][1] - outer[0][1]) - (inner[2][1] - inner[0][1])) * 0.5
  let minX = outer[0][0]
  let minY = outer[0][1]
  let maxX = outer[2][0]
  let maxY = outer[2][1]

  stretchers = [
    [[minX, midY], [minX + paddingX, midY]],
    [[midX, maxY], [midX, maxY - paddingY]],
    [[maxX, midY], [maxX - paddingX, midY]],
    [[midX, minY], [midX, minY + paddingY]],
  ]

  //127 height
  //219 accross

  // 52 inches

  return stretchers;
}

/**
 * Given a list of points - start a stroke from each point, and animate towards the next one.
 * @param {*} cfg
 * @param {*} points: list[list[int]] - list of [x, y] - vectorization happens here
 */
function snailTrail(cfg, points, loop, t) {
  if (t === 0) {
    return;
  }
  if (loop) {
    points
      .map(coords => createVector(...coords))
      .forEach((elt, i, arr) => {
        unit(cfg, elt, arr[(i + 1) % arr.length], t);
      });
  } else {
    points
      .map(coords => createVector(...coords))
      .forEach((elt, i, arr) => {
        if (i < arr.length - 1) {
          unit(cfg, elt, arr[i + 1], t);
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

function unit(cfg, p1, p2, t) {
  let time = getGain(t, 0.3);

  let x = lerp(p1.x, p2.x, time);
  let y = lerp(p1.y, p2.y, time);

  strokeCap(ROUND);
  stroke(cfg.color);
  strokeWeight(cfg.weight);

  line(p1.x + cfg.offsetx,
    p1.y + cfg.offsety,
    x + cfg.offsetx,
    y + cfg.offsety);
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