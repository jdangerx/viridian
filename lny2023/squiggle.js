function Squiggle() {
    var bg_color = color(250, 210, 200);
    var red = color(140, 30, 0);

    const CELL = height * 0.25;
    const KNOT_SEPARATION = CELL;
    const LINECOUNT = 25;
    const WAVE_SPEED = 0.001;
    const DEBUG = false;

    this.setup = () => {
        this.drawOnce = false;

        // animals
        this.rabbit = PRELOADS.squiggle.rabbit;
        this.rabbitLayer = createGraphics(this.rabbit.width, this.rabbit.height);

        // paper
        const texture = PRELOADS.all.paper;
        this.baseTextureLayer = utils.createBaseTexture(texture, 255, 155);

        // WHAT IF COLOR
        this.bgTextureLayer = utils.createBaseTexture(texture, 250, 210, 200, 100);

        this.base = createGraphics(width, height);
        this.baseTexture =  createGraphics(width, height);
        utils.applyTexture(this.base, this.baseTexture, this.bgTextureLayer, MULTIPLY);

        this.moon = createGraphics(CELL * 3, CELL * 3);
        this.moonTexture = createGraphics(CELL * 3, CELL * 3);
        this.moon.stroke(red);
        this.moon.strokeWeight(3);
        this.moon.circle(CELL * 1.5, CELL * 1.5, CELL * 3 - 5);
        utils.applyTexture(this.moon, this.moonTexture, this.baseTextureLayer, MULTIPLY);
    }

    this.draw = () => {
        if (this.drawOnce) {
            // useful for spitting out console logs without overwhelming the browser
            this.draw = () => null;
        }

        background(bg_color);
        image(this.bgTextureLayer, 0, 0, width, height);

        stroke(red);
        strokeWeight(3);
        var t = frameCount * 0.01;
        var x = width/2 + cos(t) * CELL * 3 - this.moon.width / 2;
        var y = height/2 + sin(t) * CELL * 3 - this.moon.height / 2;
        image(this.moon, x, y, this.moon.width, this.moon.height);

        var animals = new Array(LINECOUNT).fill(0);
        animals[10] = {id: 1, offset: width * 0.75};
        animals[15] = {id: 1, offset: width * 0.5};
        animals[1] = {id: 1, offset: width * 0.85};

        this.drawWaveBundle(0, -CELL * 4, height * 0.3, CELL * 1.00, 0, animals, CELL * 2);
        this.drawWaveBundle(0, -CELL * 4, height * 0.4, CELL * 1.10, 15, animals, 0);

        //this.makeRabbit(this.rabbitLayer);
        //image(this.rabbitLayer, 0, 0, this.rabbit.width, this.rabbit.height);
    }

    this.makeRabbit = (ctx) =>
    {
        const rw = 0.2 * width;
        const rh = rw * this.rabbit.height / this.rabbit.width;
        ctx.image(this.rabbit, 0, 0, rw, rh);
    }

    this.drawWaveBundle = (rotation, startX, startY, bumpAmp, seed, animals, bumpOffset) =>
    {
        push();
        translate(width/2, height/2);
        rotate(rotation);
        translate(-width/2, -height/2);
        var endX = width+CELL*5;
        this.drawWave(startX, endX, startY, bumpAmp, seed, animals, bumpOffset);
        pop();
    }

    this.drawWave = (startX, endX, startY, bumpAmp, seed, animals, bumpOffset) =>
    {
        for (var j=0; j < LINECOUNT; ++j)
        {
            var t = frameCount * 0.01;
            var yOff = j * CELL/12 + startY;
            var xOff = CELL * 1 * sin((seed + j) * 0.3 + t) + startX; 

            if (animals[j] !== 0) {
                this.drawAnimal(animals[j], xOff, yOff, endX, bumpAmp, j, seed, bumpOffset);
            }
            var coordinates = this.makeCoordinates(xOff, yOff, endX, bumpAmp, j, seed, bumpOffset);
            this.drawSpline(coordinates, seed * j);
        }
    }

    this.drawAnimal = (animal, startX, startY, endX, bumpAmp, j, seed, bumpOffset) =>
    {
        push();
        fill(255);
        var x = 6 * KNOT_SEPARATION +frameCount;
        var y = this.computeY(x, j, bumpAmp, seed, false, bumpOffset);      

        x += startX;
        y += startY;
        circle(x, y - CELL * 0.5, 100);
        pop();
    }

    this.makeCoordinates = (startX, startY, endX, bigSinAmp, j, seed, bumpOffset) => 
    {
        var coordinates = [];
        var KNOTS = ((endX-startX) / float(KNOT_SEPARATION)) | 0;
        for (var i = 0; i < KNOTS; ++i)
        { 
            var x = this.computeX(i);
            var y = this.computeY(x, j, bigSinAmp, seed, true, bumpOffset);

            if ((i === 0) || (i === KNOTS-1)) {
                y += 300;
            }

            x += startX;
            y += startY;

            coordinates.push(x);
            coordinates.push(y);
        }

        return coordinates;
    }

    this.computeX = (knotIndex) =>
    {
        return knotIndex * KNOT_SEPARATION;
    }

    this.computeY = (x, lineIndex, bigSinAmp, seed, useSmallSin, bumpOffset) =>
    {

        var LINE_NOISE_WEIGHT = 2.5;
        var GEN_NOISE_WEIGHT = 1;
        var SMALL_SIN_WEIGHT = 1;
        
        var t = frameCount * WAVE_SPEED;
        
        var noiseVal = noise((10 + lineIndex + x * 0.5 + seed) * 0.05) * LINE_NOISE_WEIGHT;
        var noiseVal2 = ((noise(0.003 * x + seed) * 2) - 1) * GEN_NOISE_WEIGHT;
        var smallSin = ((sin(x * 4) + 1) / 2) * SMALL_SIN_WEIGHT; 
        var bigSin = ((cos(bumpOffset + x *0.008 - t)+1)/2) * bigSinAmp;

        if (!useSmallSin)
        { 
            noiseVal = LINE_NOISE_WEIGHT;
            smallSin *= 0;
        }

        //smallSin *= 0;
        //bigSin *= 0;

        var y = (smallSin + noiseVal + noiseVal2) * (KNOT_SEPARATION/4) + bigSin;
        return y;
    }

    this.drawSpline = (coordinates, seed) => {

        var FIRST_X_COORDINATE = 0;
        var LAST_X_COORDINATE = (coordinates.length - 2);
        var AMOUNT_OF_COORDINATES = coordinates.length;

        curveTightness(-0.5);
        fill(red);
        strokeWeight(2);
        stroke(bg_color);
        beginShape();

        // Draw the continuous spline curve, which must be bound by beginShape and endShape.
        // Note: The first and last coordinates of a spline must be invoked curveVertex twice with the same arguments.
        for (let i = FIRST_X_COORDINATE; i < AMOUNT_OF_COORDINATES; i += 2) {
            if ((i === FIRST_X_COORDINATE) || (i === LAST_X_COORDINATE)) {
                curveVertex(coordinates[i], coordinates[i + 1]);
                curveVertex(coordinates[i], coordinates[i + 1]);
            } else {
                curveVertex(coordinates[i], coordinates[i + 1]);
            }
        }

        endShape();

        if (DEBUG)
        {
           for (let i = FIRST_X_COORDINATE; i < AMOUNT_OF_COORDINATES; i += 2) {
                ellipse(coordinates[i], coordinates[i + 1], 5, 5);
            }
        }
    }
}
