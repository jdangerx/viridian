function Squiggle() {
    var bg_color = color(250, 210, 200);
    var red = color(140, 30, 0);

    const CELL = height * 0.25;
    const KNOT_SEPARATION = CELL;
    const LINECOUNT = 2;
    const WAVE_SPEED = 0; 0.001;
    const DEBUG = false;
    const OSCILLATION_SPEED = 0;

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
        this.baseTexture = createGraphics(width, height);
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
        var x = width / 2 + cos(t) * CELL * 3 - this.moon.width / 2;
        var y = height / 2 + sin(t) * CELL * 3 - this.moon.height / 2;
        image(this.moon, x, y, this.moon.width, this.moon.height);

        var animals = new Array(LINECOUNT).fill(0);

        this.drawWaveBundle(0, -CELL * 4, height * 0.3, CELL * 1.00, 0, animals, CELL * 2);

        var unit = (width / 13);
        animals[1] = { id: 1, offset: unit * 1 };
        /*
        animals[4] = {id: 1, offset: unit * 2};
        animals[8] = {id: 1, offset: unit * 3};
        animals[1] = {id: 1, offset: unit * 4};
        animals[6] = {id: 1, offset: unit * 5};
        animals[11] = {id: 1, offset: unit * 6};
        animals[2] = {id: 1, offset: unit * 7};
        animals[9] = {id: 1, offset: unit * 8};
        animals[5] = {id: 1, offset: unit * 9};
        animals[3] = {id: 1, offset: unit * 10};
        animals[12] = {id: 1, offset: unit * 11};
        animals[7] = {id: 1, offset: unit * 12};
        */

        this.drawWaveBundle(0, -CELL * 4, height * 0.4, CELL * 1.10, 15, animals, 0);

        //this.makeRabbit(this.rabbitLayer);
        //image(this.rabbitLayer, 0, 0, this.rabbit.width, this.rabbit.height);
    }

    this.makeRabbit = (ctx) => {
        const rw = 0.2 * width;
        const rh = rw * this.rabbit.height / this.rabbit.width;
        ctx.image(this.rabbit, 0, 0, rw, rh);
    }

    this.drawWaveBundle = (rotation, startX, startY, bumpAmp, seed, animals, bumpOffset) => {
        push();
        translate(width / 2, height / 2);
        rotate(rotation);
        translate(-width / 2, -height / 2);
        var endX = width + CELL * 5;
        this.drawWave(startX, endX, startY, bumpAmp, seed, animals, bumpOffset);
        pop();
    }

    this.drawWave = (startX, endX, startY, bumpAmp, seed, animals, bumpOffset) => {
        for (var j = 0; j < LINECOUNT; ++j) {
            var t = frameCount * OSCILLATION_SPEED;
            var yOff = j * CELL / 12 + startY;
            var xOff = CELL * 1 * sin((seed + j) * 0.3 + t) + startX;

            if (animals[j] !== 0) {
                this.drawAnimal(animals[j], xOff, yOff, endX, bumpAmp, j, seed, bumpOffset);
            }
            var coordinates = this.makeCoordinates(xOff, yOff, endX, bumpAmp, j, seed, bumpOffset);
            this.drawSpline(coordinates, seed * j);
        }
    }

    this.drawAnimal = (animal, startX, startY, endX, bumpAmp, j, seed, bumpOffset) => {
        push();
        fill(255);
        const maxDisplayX = width + CELL;
        let x = frameCount * 4 + animal.offset;
        const displayX = (x + startX) % maxDisplayX;
        const coordX = displayX - startX;
        // x = maxX
        // displayX = maxX + startX
        // coordX = 0

        // we *want* coordX = maxX
        // when x = maxX + 1
        // display X = maxX + startX + 1
        // coord X = maxX + 1


        //displayX = maxX + startX
        // when do we want coordX to wrap back to 0?
        // when
        // when do we want displayX to wrap back to 0?
        // displayX wraps at displayX = maxX
        // when displayX wraps to 0, this corresponds to displayX = -startX



        let y = this.computeY(coordX, j, bumpAmp, seed, false, bumpOffset);
        y += startY;

        circle(displayX, y, 100);
        pop();
    }

    this.makeCoordinates = (startX, startY, endX, bigSinAmp, j, seed, bumpOffset) => {
        var coordinates = [];
        var KNOTS = ((endX - startX) / float(KNOT_SEPARATION)) | 0;
        for (var i = 0; i < KNOTS; ++i) {
            var x = this.computeX(i);
            var y = this.computeY(x, j, bigSinAmp, seed, true, bumpOffset);

            if ((i === 0) || (i === KNOTS - 1)) {
                y += 300;
            }

            x += startX;
            y += startY;

            coordinates.push(x);
            coordinates.push(y);
        }

        return coordinates;
    }

    this.computeX = (knotIndex) => {
        return knotIndex * KNOT_SEPARATION;
    }

    this.computeY = (x, lineIndex, bigSinAmp, seed, useSmallSin, bumpOffset) => {

        var LINE_NOISE_WEIGHT = 0; 2.5;
        var GEN_NOISE_WEIGHT = 0; 1;
        var SMALL_SIN_WEIGHT = 0; 1;

        var t = frameCount * WAVE_SPEED;

        var noiseVal = noise((10 + lineIndex + x * 0.5 + seed) * 0.05) * LINE_NOISE_WEIGHT;
        var noiseVal2 = ((noise(0.003 * x + seed) * 2) - 1) * GEN_NOISE_WEIGHT;
        var smallSin = ((sin(x * 4) + 1) / 2) * SMALL_SIN_WEIGHT;
        var bigSin = ((cos(bumpOffset + x * 0.008 - t) + 1) / 2) * bigSinAmp;

        if (!useSmallSin) {
            noiseVal = LINE_NOISE_WEIGHT;
            smallSin *= 0;
        }

        //smallSin *= 0;
        //bigSin *= 0;

        var y = (smallSin + noiseVal + noiseVal2) * (KNOT_SEPARATION / 4) + bigSin;
        return y;
    }

    this.drawSpline = (coordinates, seed) => {

        var FIRST_X_COORDINATE = 0;
        var LAST_X_COORDINATE = (coordinates.length - 2);
        var AMOUNT_OF_COORDINATES = coordinates.length;

        curveTightness(-0.5);
        fill(red);
        fill('rgba(180, 0, 0, 0.3)')
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

        if (DEBUG) {
            for (let i = FIRST_X_COORDINATE; i < AMOUNT_OF_COORDINATES; i += 2) {
                ellipse(coordinates[i], coordinates[i + 1], 5, 5);
            }
        }
    }
}
