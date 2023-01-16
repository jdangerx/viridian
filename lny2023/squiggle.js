function Squiggle() {
    var bg_color = color(250, 210, 200);
    var red = color(140, 30, 0);

    const CELL = height * 0.25;
    const KNOT_SEPARATION = CELL;
    const LINECOUNT = 35;
    const WAVE_SPEED = 0.0005;

    this.setup = () => {
        this.drawOnce = false;

        // animals
        this.rabbit = PRELOADS.squiggle.rabbit;
        this.rabbitLayer = createGraphics(this.rabbit.width, this.rabbit.height);

        // paper
        const texture = PRELOADS.all.paper;
        this.baseTextureLayer = utils.createBaseTexture(texture, 255, 155);

        // WHAT IF COLOR
        this.redTextureLayer = utils.createBaseTexture(texture, 255, 0, 0, 155);

        this.moon = createGraphics(CELL * 3, CELL * 3);
        this.moonTexture = createGraphics(CELL * 3, CELL * 3);
        this.moon.stroke(red);
        this.moon.strokeWeight(3);
        this.moon.circle(CELL * 1.5, CELL * 1.5, CELL * 3 - 5);
        utils.applyTexture(this.moon, this.moonTexture, this.redTextureLayer, MULTIPLY);
    }

    this.draw = () => {
        if (this.drawOnce) {
            // useful for spitting out console logs without overwhelming the browser
            this.draw = () => null;
        }

        background(bg_color);

        stroke(red);
        strokeWeight(3);
        var t = frameCount * 0.01;
        var x = width/2 + cos(t) * CELL * 3 - this.moon.width / 2;
        var y = height/2 + sin(t) * CELL * 3 - this.moon.height / 2;
        image(this.moon, x, y, this.moon.width, this.moon.height);

        var animals = new Array(LINECOUNT).fill(0);
        animals[10] = {id: 1, offset: width * 0.75};
        animals[15] = {id: 1, offset: width * 0.5};
        animals[4] = {id: 1, offset: width * 0.85};


        this.drawWaveBundle(0, -CELL * 9, height * 0.4, CELL * 1, 0, animals);
        this.drawWaveBundle(0, -CELL * 4, height * 0.5, CELL * 2, 15, animals);

        //this.makeRabbit(this.rabbitLayer);
        //image(this.rabbitLayer, 0, 0, this.rabbit.width, this.rabbit.height);
    }

    this.makeRabbit = (ctx) =>
    {
        const rw = 0.2 * width;
        const rh = rw * this.rabbit.height / this.rabbit.width;
        ctx.image(this.rabbit, 0, 0, rw, rh);
    }

    this.drawWaveBundle = (rotation, startX, startY, bumpAmp, seed, animals) =>
    {
        push();
        translate(width/2, height/2);
        rotate(rotation);
        translate(-width/2, -height/2);
        var endX = width+CELL*5;
        this.drawWave(startX, endX, startY, bumpAmp, seed, animals);
        pop();
    }

    this.drawWave = (startX, endX, startY, bumpAmp, seed, animals) =>
    {
        for (var j=0; j < LINECOUNT; ++j)
        {
            var yOff = j * CELL/10 + startY;
            var xOff = CELL * 1 * sin(seed + j * 0.3 + frameCount * 0.01) + startX; 

            if (animals[j] !== 0) {
                this.drawAnimal(animals[j], xOff, yOff, endX, bumpAmp, j, seed);
            }
            var coordinates = this.makeCoordinates(xOff, yOff, endX, bumpAmp, j, seed);
            this.drawSpline(coordinates, seed * j);
        }
    }

    this.drawAnimal = (animal, startX, startY, endX, bumpAmp, j, seed) =>
    {
        push();
        fill(255);
        var x = 6 * KNOT_SEPARATION + (frameCount * 0.1);
        var y = this.computeY(x, j, bumpAmp, seed);

        x += startX;
        y += startY;
        circle(x, y, 100);
        pop();
    }

    this.makeCoordinates = (startX, startY, endX, bigSinAmp, j, seed) => 
    {
        var coordinates = [];
        var KNOTS = ((endX-startX) / float(KNOT_SEPARATION)) | 0;
        for (var i = 0; i < KNOTS; ++i)
        { 
            var x = this.computeX(i);
            var y = this.computeY(x, j, bigSinAmp, seed);

            if ((i === 0) || (i === KNOTS-1)) {
                y += 300;
            }

            coordinates.push(x + startX);
            coordinates.push(y + startY);
        }

        return coordinates;
    }

    this.computeX = (knotIndex) =>
    {
        return knotIndex * KNOT_SEPARATION;
    }

    this.computeY = (x, lineIndex, bigSinAmp, seed) =>
    {
        var t = frameCount * WAVE_SPEED;
        var noiseVal = noise((lineIndex * x + seed) * 0.05) * 1;
        var noiseVal2 = ((noise(0.00001 * x + seed) * 2) - 1) * 0.75 * 0.25;
        var smallSin = ((sin(x * 4) + 1) / 2)  * 0.5; 
        var bigSin = ((cos(x *0.1 + t)+1)/2) * bigSinAmp;
        var y = (smallSin + noiseVal + noiseVal2) * (KNOT_SEPARATION/5) + bigSin;
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

        
        for (let i = FIRST_X_COORDINATE; i < AMOUNT_OF_COORDINATES; i += 2) {
            ellipse(coordinates[i], coordinates[i + 1], 5, 5);
        }
    
    }
}
