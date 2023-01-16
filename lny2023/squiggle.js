function Squiggle() {
    var bg_color = color(250, 210, 200);
    var red = color(140, 30, 0);

    var KNOT_SEPARATION = 120;

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

        

        this.moon = createGraphics(600, 600);
        this.moonTexture = createGraphics(600, 600);
        this.moon.stroke(red);
        this.moon.strokeWeight(3);
        this.moon.circle(300, 300, 500);
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
        var x = width/2 + cos(t) * 400 - this.moon.width / 2;
        var y = height/2 + sin(t) * 400 - this.moon.height / 2;
        image(this.moon, x, y, this.moon.width, this.moon.height);

        this.drawWaveBundle(0, -1000, width+600, height * 0.4, 100, 0);
        this.drawWaveBundle(0, -400, width+600, height * 0.5, 200, 15);

        this.makeRabbit(this.rabbitLayer);
        image(this.rabbitLayer, 0, 0, this.rabbit.width, this.rabbit.height);
    }

    this.makeRabbit = (ctx) =>
    {
        const rw = 0.2 * width;
        const rh = rw * this.rabbit.height / this.rabbit.width;
        ctx.image(this.rabbit, 0, 0, rw, rh);
    }

    this.drawWaveBundle = (rotation, startX, endX, startY, bumpAmp, seed) =>
    {
        push();
        translate(width/2, height/2);
        rotate(rotation);
        translate(-width/2, -height/2);
        this.drawWave(startX, endX, startY, bumpAmp, seed);
        pop();
    }

    this.drawWave = (startX, endX, startY, bumpAmp, seed) =>
    {
        var lineCount = 35;
        for (var j=1; j <= lineCount; ++j)
        {
            var yOff = j * 12 + startY;
            var xOff = 100 * sin(seed + j * 0.3 + frameCount * 0.01) + startX; 
            var coordinates = this.makeCoordinates(xOff, yOff, endX, bumpAmp, j, seed);
            this.drawSpline(coordinates, seed * j);
        }
    }

    this.makeCoordinates = (startX, startY, endX, bigSinAmp, j, seed) => 
    {
        var coordinates = [];
        var KNOT_SEPARATION = 120;
        var KNOTS = ((endX-startX) / float(KNOT_SEPARATION)) | 0;
        var t = frameCount * 0.00;
        for (var i = 0; i < KNOTS; ++i)
        { 
            var x = this.computeX(i);
            var y = this.computeY(x, t, j, bigSinAmp, seed);

            if ((i === 0) || (i === KNOTS-1)) {
                y += 300;
            }

            coordinates.push(x + startX);
            coordinates.push(y + startY);

            console.log(x + " " + y);

        }

        return coordinates;
    }

    this.computeX = (knotIndex) =>
    {
        return knotIndex * KNOT_SEPARATION;
    }

    this.computeY = (x, t, lineIndex, bigSinAmp, seed) =>
    {
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

        /*
        for (let i = FIRST_X_COORDINATE; i < AMOUNT_OF_COORDINATES; i += 2) {
            ellipse(coordinates[i], coordinates[i + 1], 5, 5);
        }*/
    
    }
}
