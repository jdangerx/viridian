let duration = 120;
let hold = 30;
let cfg;
    
function setup() {
  createCanvas(800, 400);
  
  cfg = {
    color: color(220, 0, 0),
    neg : 0,
    t : 0.5,
    weight: 10,
    offset: 10,
  }
}

function draw() {
  background(20);
  
  cfg.t = min(1,(frameCount % (duration + hold))/duration);
   
  let q1 = [[50, 50],
           [50, 350],
           [350, 350],
           [350, 50]];
  
  let q2 = [[100, 100],
           [100, 300],
           [300, 300],
           [300, 100]];
  
  cfg.offset = 3;
  cfg.weight = 15;
  cfg.color = color(220, 220, 0);
   
  myStrokes(cfg, [[200, 50], [200, 100]]);
  myStrokes(cfg, [[200, 300], [200, 350]]);
  myStrokes(cfg, [[50, 200], [100, 200]]);
  myStrokes(cfg, [[300, 200], [350, 200]]);
  
  myStrokes(cfg, q1, 0);
  myStrokes(cfg, q2, 1);
  
  cfg.color = color(220, 0, 0);
  cfg.weight = 10;
  cfg.offset = 0;
  
  myStrokes(cfg, [[200, 50], [200, 100]]);
  myStrokes(cfg, [[200, 300], [200, 350]]);
  myStrokes(cfg, [[50, 200], [100, 200]]);
  myStrokes(cfg, [[300, 200], [350, 200]]);
  
  myStrokes(cfg, q1, 0);
  myStrokes(cfg, q2, 1);
}

function myStrokes(cfg, points, neg) // points is a list of lists
{
  console.log(cfg.offset)
     points
       .map(coords => createVector(coords[0], coords[1]))
       .forEach((elt, i, arr) => {
       unit(cfg, elt, arr[(i+1) % arr.length], neg);
     });
}

function unit(cfg, p1, p2, neg)
{  
  let time = GetGain(cfg.t, 0.3);
  
  let a = (neg) ? p1 : p2;
  let b = (neg) ? p2 : p1;
  let x = lerp(a.x, b.x, time);
  let y = lerp(a.y, b.y, time);
  
  // Real stroke
  strokeCap(ROUND);
  stroke(cfg.color);
  strokeWeight(cfg.weight);

  line(a.x + cfg.offset, a.y + cfg.offset, x + cfg.offset, y + cfg.offset);
}

function GetBias(time,bias)
{
  return (time / ((((1.0/bias) - 2.0)*(1.0 - time))+1.0));
}

function GetGain(time,gain)
{
  if(time < 0.5)
    return GetBias(time * 2.0,gain)/2.0;
  else
    return GetBias(time * 2.0 - 1.0,1.0 - gain)/2.0 + 0.5;
}