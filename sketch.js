let duration = 120;
let hold = 30;
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
  background(20);

  cfg.t = min(1, (frameCount % (duration + hold)) / duration);

  let outer = [
    [50, 50],
    [50, 350],
    [350, 350],
    [350, 50]
  ];

  let inner = [
    [300, 100],
    [300, 300],
    [100, 300],
    [100, 100],
  ];

  let stretchers = [
    [[200, 50], [200, 100]],
    [[200, 300], [200, 350]],
    [[50, 200], [100, 200]],
    [[300, 200], [350, 200]],
  ];

  cfg.offset = 3;
  cfg.weight = 15;
  cfg.color = color(220, 220, 0);

  stretchers.forEach(s => snailTrail(cfg, s));
  snailTrail(cfg, outer);
  snailTrail(cfg, inner);

  cfg.color = color(220, 0, 0);
  cfg.weight = 10;
  cfg.offset = 0;

  stretchers.forEach(s => snailTrail(cfg, s));
  snailTrail(cfg, outer);
  snailTrail(cfg, inner);
}

/**
 * Given a list of points - start a stroke from each point, and animate towards the next one.
 * @param {*} cfg
 * @param {*} points
 */
function snailTrail(cfg, points) {
  points
    .map(coords => createVector(...coords))
    .forEach((elt, i, arr) => {
      unit(cfg, elt, arr[(i + 1) % arr.length]);
    });
}

function unit(cfg, p1, p2) {
  let time = getGain(cfg.t, 0.3);

  let x = lerp(p1.x, p2.x, time);
  let y = lerp(p1.y, p2.y, time);

  strokeCap(ROUND);
  stroke(cfg.color);
  strokeWeight(cfg.weight);

  line(p1.x + cfg.offset, p1.y + cfg.offset, x + cfg.offset, y + cfg.offset);
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