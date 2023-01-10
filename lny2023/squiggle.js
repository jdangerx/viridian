function Squiggle() {
    this.setup = () => {
        this.drawOnce = false;
    }

    this.draw = () => {
        if (this.drawOnce) {
            // useful for spitting out console logs without overwhelming the browser
            this.draw = () => null
        }

        background(255);


        push();
        translate(width/2, height/2);
        rotate(PI/5);
        translate(-width/2, -height/2);
        this.drawWave(-100, width+100, height * 1, 50, noise(0.1));
        pop();

        push();
        translate(0, 0);
        this.drawWave(-100, width+100, height * 0.8, 50, noise(0.45));
        pop();

        push();
        translate(width/2, height/2);
        rotate(-PI/6);
        translate(-width/2, -height/2);
        translate(300, 0);
        this.drawWave(-100, width+100, height * 1.2, 50, noise(0.87));
        pop();
    }

    this.drawWave = (startX, endX, startY, lineCount, seed) =>
    {
        for (var j=0; j < lineCount; ++j)
        {
            var yOff = j * 12 + startY;
            var xOff = 50 * sin(j * 0.3) + startX; 
            var coordinates = this.makeCoordinates(xOff, yOff, endX, 100, seed);
            this.drawSpline(coordinates);
        }
    }

    this.makeCoordinates = (startX, startY, endX, bigSinAmp, seed) => {
        var coordinates = [];
        var KNOT_SEPARATION = 120;
        var KNOTS = (endX-startX) / float(KNOT_SEPARATION);
        var t = frameCount * 0.1;
        for (var i = 0; i < KNOTS; ++i)
        {
            var x = i * KNOT_SEPARATION + startX;
            var noiseVal = ((noise(i * KNOT_SEPARATION * 0.05 + seed) * 2) - 1);
            var noiseVal2 = ((noise(x * 0.05 + seed) * 2) - 1);
            var sinOffY = cos(i * KNOT_SEPARATION *0.1) * bigSinAmp;
            var y = (sin(i * KNOT_SEPARATION * 4 + t) + noiseVal + noiseVal2 * 0.75) * (KNOT_SEPARATION/4) + startY + sinOffY;

            if ((i === 0) || (i === KNOTS-1)) {
                y += 200;
            }

            coordinates.push(x);
            coordinates.push(y);
        }

        return coordinates;
    }

    this.drawSpline = (coordinates) => {

        var FIRST_X_COORDINATE = 0;
        var LAST_X_COORDINATE = (coordinates.length - 2);
        var AMOUNT_OF_COORDINATES = coordinates.length;

        curveTightness(-0.5);
        fill(140, 0, 0);
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

        /*
        for (let i = FIRST_X_COORDINATE; i < AMOUNT_OF_COORDINATES; i += 2) {
            ellipse(coordinates[i], coordinates[i + 1], 5, 5);
        }*/
    
    }
}
