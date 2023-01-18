function Squiggle() {
    var bg_color = color(215,156,119);
    //var red = color(140, 30, 0);
    var red = color(130,5,1);

    const CELL = height * 0.25;
    const VIRTUAL_SCREEN_WIDTH = width * 2;
    const KNOT_SEPARATION = CELL;
    const ANIMAL_SIZE = CELL*0.45;
    const LINECOUNT = 29;

    const WAVE_SPEED = 0.01;
    const OSCILLATION_SPEED = 0.03;
    const ANIMAL_SPEED = 3;

    const DEBUG = false;

    this.setup = () => {
        this.drawOnce = true;

        // animals
        this.animal1 = PRELOADS.squiggle.rat;
        this.animal2 = PRELOADS.squiggle.ox;
        this.animal3 = PRELOADS.squiggle.tiger;
        this.animal4 = PRELOADS.squiggle.rabbit;
        this.animal5 = PRELOADS.squiggle.dragon;
        this.animal6 = PRELOADS.squiggle.snake;
        this.animal7 = PRELOADS.squiggle.horse;
        this.animal8 = PRELOADS.squiggle.ram;
        this.animal9 = PRELOADS.squiggle.monkey;
        this.animal10 = PRELOADS.squiggle.rooster;
        this.animal11 = PRELOADS.squiggle.dog;
        this.animal12 = PRELOADS.squiggle.pig;

        //this.animal1Layer = createGraphics(ANIMAL_SIZE, ANIMAL_SIZE * this.animal1.height/this.animal1.width);
        //this.animal1Layer.image(this.animal1, 0, 0, this.animal1Layer.width, this.animal1Layer.height);

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
        this.moon.strokeWeight((CELL/270.0)*7);
        this.moon.circle(CELL * 1.5, CELL * 1.5, CELL * 3 - 5);
        utils.applyTexture(this.moon, this.moonTexture, this.baseTextureLayer, MULTIPLY);

        this.spot = createGraphics(CELL * 0.9, CELL * 0.9);
        this.spotTexture = createGraphics(CELL * 0.9, CELL * 0.9);
        this.spot.stroke(red);
        this.spot.strokeWeight((CELL/270.0)*7);
        this.spot.circle(CELL * 0.45, CELL * 0.45, CELL * 0.9 - 10);
        utils.applyTexture(this.spot, this.spotTexture, this.baseTextureLayer, MULTIPLY);
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

        this.drawWaveBundle(0, -CELL * 4, height * 0.25, CELL * 0.75, 0, animals, CELL * 1.5);

        var unit = (VIRTUAL_SCREEN_WIDTH / 12);
        animals[10] = { image: this.animal12, offset: unit * 1 };
        animals[8] = { image: this.animal11, offset: unit * 2 };
        animals[18] = { image: this.animal10, offset: unit * 3 };
        animals[11] = { image: this.animal9, offset: unit * 4 };
        animals[5] = { image: this.animal8, offset: unit * 5 };
        animals[10] = { image: this.animal7, offset: unit * 6 };
        animals[16] = { image: this.animal6, offset: unit * 7 };
        animals[9] = { image: this.animal5, offset: unit * 8 };
        animals[20] = { image: this.animal4, offset: unit * 9 };
        animals[7] = { image: this.animal3, offset: unit * 10 };
        animals[11] = { image: this.animal2, offset: unit * 11.5 };
        animals[12] = { image: this.animal1, offset: unit * 12 };

        animals = animals.map((animal, i) => {
            if (animal === 0) {
                return 0;
            }
            let { image, offset } = animal;
            const offsetSize = 50;
            offset += offsetSize * 2 * (noise(i) - 0.5);
            return { image, offset };
        })

        this.drawWaveBundle(0, -CELL * 4, height * 0.35, CELL * 0.9, 17, animals, 0);
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
            var yOff = j * CELL / 14 + startY;
            var xOff = CELL * 1 * sin((seed + j) * (CELL/270.0)*0.2 + t) + startX;

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
        // define a loop length that is larger than the screen width
        const loopPadding = (VIRTUAL_SCREEN_WIDTH - width) / 2;
        const loopLength = width + 2 * loopPadding;

        const loopX = (frameCount * ANIMAL_SPEED + animal.offset + startX) % loopLength;

        // displayX = 0, loopX should be at exactly loopPadding:
        const displayX = loopX - loopPadding;
        // when splineX = 0, displayX should be exactly startX:
        const splineX = displayX - startX;

        const y = this.computeY(splineX, j, bumpAmp, seed, false, bumpOffset) + startY - 40;

        var displayY = y- CELL*0.4;
        stroke(red);
        image(this.spot, displayX-CELL*0.45, displayY-CELL*0.45, CELL*0.9, CELL*0.9);
        image(animal.image, displayX - ANIMAL_SIZE/2, displayY-ANIMAL_SIZE/2, ANIMAL_SIZE, ANIMAL_SIZE * animal.image.height/animal.image.width);
 
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

        var LINE_NOISE_WEIGHT = 0.8;
        var GEN_NOISE_WEIGHT = 0;
        var SMALL_SIN_WEIGHT = 0;

        var BIG_SIN_PERIOD = (CELL/270.0)*0.004;

        var t = frameCount * WAVE_SPEED;

        var noiseVal = noise((3 * lineIndex + x * 0.75 + seed) * 0.05) * KNOT_SEPARATION * LINE_NOISE_WEIGHT;
        var noiseVal2 = ((noise(0.003 * x + seed) * 2) - 1) * KNOT_SEPARATION * GEN_NOISE_WEIGHT;
        var smallSin = ((sin(x * 4) + 1) / 2) * KNOT_SEPARATION * SMALL_SIN_WEIGHT;
        var bigSin = ((cos(bumpOffset + x * BIG_SIN_PERIOD - t) + 1) / 2) * bigSinAmp;

        if (!useSmallSin) {
            noiseVal = KNOT_SEPARATION * 0.8;
            smallSin *= 0;
        }

        //smallSin *= 0;
        //bigSin *= 0;

        var y = smallSin + noiseVal + noiseVal2 + bigSin;
        return y;
    }

    this.drawSpline = (coordinates, seed) => {

        var FIRST_X_COORDINATE = 0;
        var LAST_X_COORDINATE = (coordinates.length - 2);
        var AMOUNT_OF_COORDINATES = coordinates.length;

        curveTightness(-0.5);
        fill(red);
        strokeWeight((CELL/270.0)*5);
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
