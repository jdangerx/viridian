let overall = 400;
let prehold = 0.0;
let duration = 1.0;
let hold = 1 - prehold - duration;
let cfg;

function setup() {
  createCanvas(800, 400);

  cfg = {
    color: color(220, 0, 0),
    neg: 0,
    t: 0.5,
    weight: 10,
    offset: 10,
  }
}

function draw() {
  background(178,34,34);

  // cfg.t = min(1, (frameCount % (duration + hold)) / duration);
  cfg.t = min(max(0, (frameCount % overall - prehold * overall) / (duration * overall)), 1);

  // IMPORTANT. Order square points BL, TL, TR, BR
  let outer = [
    [50, 50],
    [50, 350],
    [350, 350],
    [350, 50]
  ];

  let inner = [
    [100, 100],
    [100, 300],
    [300, 300],
    [300, 100],
  ];

  let stretchers = computeStretchers(inner, outer);

  drawPanel(cfg, inner, outer, createVector(0, 0), 0.4, 0.2);
  drawPanel(cfg, inner, outer, createVector(200, 0), 0, 0.5);
  drawPanel(cfg, inner, outer, createVector(400, 0), 0.2, 0.6);
}

function drawPanel(cfg, inner, outer, offset, prehold, duration)
{
  let t = min(max(0, (cfg.t - prehold) / duration), 1);
  let shadowOffset = 3;
  let shadowWeight = 10;
  let weight = 15;

  cfg.offsetx = shadowOffset + offset.x;
  cfg.offsety = shadowOffset + offset.y;
  cfg.weight = weight;
  cfg.color = color(230,130,30);

  stretchers.forEach(s => snailTrail(cfg, s, false, t));
  snailTrail(cfg, outer, 1, t);
  snailTrail(cfg, inner, 1, t);

  cfg.color = color(255,215,0);
  cfg.weight = shadowWeight;
  cfg.offsetx = offset.x;
  cfg.offsety = offset.y;

  stretchers.forEach(s => snailTrail(cfg, s, false, t));
  snailTrail(cfg, outer, 1, t);
  snailTrail(cfg, inner, 1, t);
}

function computeStretchers(inner, outer)
{
  let midY = lerp(inner[1][0], inner[1][1], 0.5);
  let midX = lerp(inner[0][0], inner[2][0], 0.5); 
  let paddingY = ((outer[2][1] - outer[0][1]) - (inner[2][1] - inner[0][1])) * 0.5
  let paddingX = ((outer[2][1] - outer[0][1]) - (inner[2][1] - inner[0][1])) * 0.5
  let minX = outer[0][0]
  let minY = outer[0][1]
  let maxX = outer[2][0]
  let maxY = outer[2][1]
  
  stretchers = [
    [[minX, midY], [minX+paddingX, midY]],
    [[midX, maxY], [midX, maxY-paddingY]],
    [[maxX, midY], [maxX-paddingX, midY]],
    [[midX, minY], [midX, minY+paddingY]],
  ]

  return stretchers;
}

/**
 * Given a list of points - start a stroke from each point, and animate towards the next one.
 * @param {*} cfg
 * @param {*} points
 */
function snailTrail(cfg, points, loop, t) {
  if (t === 0) {
    return;
  }
  if (loop)
  {
    points
      .map(coords => createVector(...coords))
      .forEach((elt, i, arr) => {
        unit(cfg, elt, arr[(i + 1) % arr.length], t);
      });
  } else 
  {
    points
      .map(coords => createVector(...coords))
      .forEach((elt, i, arr) => {
        if (i < arr.length - 1)
        {
          unit(cfg, elt, arr[i + 1], t);
        }
      });
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