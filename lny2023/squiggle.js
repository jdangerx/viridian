function Squiggle() {
    this.setup = () => {
        this.drawOnce = true;
    }

    this.draw = () => {
        if (this.drawOnce) {
            // useful for spitting out console logs without overwhelming the browser
            this.draw = () => null
        }

        background(250, 200, 200);

        //this.drawWaveBundle(0, -200, width+200, height * 0.3, 300, 0);

        this.drawWaveBundle(PI/12, -500, width*0.75, height * 1.0, 200, 5.2);

        //this.drawWaveBundle(0, -100, width+200, height * 0.7, 300, 0);

        //this.drawWaveBundle(-PI/6, 200, width+100, height * 1.0, 300, 17.87);
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
        var lineCount = 10;
        for (var j=1; j <= lineCount; ++j)
        {
            var yOff = j * 12 + startY;
            var xOff = 100 * sin(j * 0.3 + frameCount * 0.03) + startX; 
            var coordinates = this.makeCoordinates(xOff, yOff, endX, bumpAmp, j, seed);
            this.drawSpline(coordinates, seed * j);
        }
    }

    this.makeCoordinates = (startX, startY, endX, bigSinAmp, j, seed) => {
        var coordinates = [];
        var KNOT_SEPARATION = 120;
        var KNOTS = ((endX-startX) / float(KNOT_SEPARATION)) | 0;
        var t = frameCount * 0.0;
        for (var i = 1; i <= KNOTS; ++i)
        { 
            var x = i * KNOT_SEPARATION + startX;
            var noiseVal = noise((j* i * KNOT_SEPARATION + seed) * 0.05) * 0;
            var noiseVal2 = ((noise(j * 0.3 * i + seed) * 2) - 1) * 0.75 * 0;
            var smallSin = ((sin(i * KNOT_SEPARATION * 4 + t) + 1) / 2)  * 0; 
            var bigSin = ((cos(i * KNOT_SEPARATION *0.1)+1)/2) * bigSinAmp;
            var y = (smallSin + noiseVal + noiseVal2) * (KNOT_SEPARATION/6) + startY + bigSin;
            
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

    this.drawSpline = (coordinates, seed) => {

        var FIRST_X_COORDINATE = 0;
        var LAST_X_COORDINATE = (coordinates.length - 2);
        var AMOUNT_OF_COORDINATES = coordinates.length;

        curveTightness(-0.5);
        fill(140, 50, 0);
        strokeWeight(2);
        stroke(255);
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
