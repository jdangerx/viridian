function Squiggle() {
    var bg_color = color(250, 210, 200);
    var red = color(140, 30, 0);

    this.setup = () => {
        this.drawOnce = false;

        //this.rabbit = loadImage("images/bunny-leap.png");
    }

    this.draw = () => {
        if (this.drawOnce) {
            // useful for spitting out console logs without overwhelming the browser
            this.draw = () => null
        }

        background(bg_color);

        stroke(red);
        strokeWeight(3);
        var t = frameCount * 0.01;
        //circle(width/2 + cos(t) * 400, height/2 + sin(t) * 400, 500);


        this.drawWaveBundle(0, -1000, width+400, height * 0.4, 100, 0);
        this.drawWaveBundle(0, -400, width+400, height * 0.5, 200, 15);

        //this.rabbitLayer = createGraphics(this.rabbit.width, this.rabbit.height);
        //this.makeRabbit(this.rabbitLayer);
        //image(this.rabbitLayer, 0, 0, this.rabbit.width, this.rabbit.height);
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

    this.makeCoordinates = (startX, startY, endX, bigSinAmp, j, seed) => {
        var coordinates = [];
        var KNOT_SEPARATION = 120;
        var KNOTS = ((endX-startX) / float(KNOT_SEPARATION)) | 0;
        var t = frameCount * 0.01;
        for (var i = 1; i <= KNOTS; ++i)
        { 
            var x = i * KNOT_SEPARATION + startX;
            var noiseVal = noise((j* x+ seed) * 0.05) * 1;
            var noiseVal2 = ((noise(j * 0.3 * i + seed) * 2) - 1) * 0.75 * 0.5;
            var smallSin = ((sin(i * KNOT_SEPARATION * 4) + 1) / 2)  * 0.5; 
            var bigSin = ((cos(i * KNOT_SEPARATION *0.1 + t)+1)/2) * bigSinAmp;
            var y = (smallSin + noiseVal + noiseVal2) * (KNOT_SEPARATION/5) + startY + bigSin;
            
            // FOR SCALE 
            //var y = startY + noise(i + j + seed) * 100;

            if ((i === 1) || (i === KNOTS)) {
                y += 300;
            }

            coordinates.push(x);
            coordinates.push(y);
        }

        return coordinates;
    }

    this.computeX = () =>
    {
        return i * KNOT_SEPARATION + startX;
    }

    this.computeY = () =>
    {
        return i * KNOT_SEPARATION + startX;
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
