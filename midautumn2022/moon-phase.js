function Phases() {
    let myImage;
    let moonSize;
    this.setup = () => {
        createCanvas(900, 400);

        moonSize = width/10;

        this.mask = createGraphics(moonSize, moonSize);
        this.mask.noStroke();
        this.mask.fill('rgba(0, 0, 0, 1)');

        this.westTerminator = createGraphics(moonSize, moonSize);
        this.westTerminator.noStroke();
        this.westTerminator.fill('rgba(0, 0, 0, 1)');

        this.eastTerminator = createGraphics(moonSize, moonSize);
        this.eastTerminator.noStroke();
        this.eastTerminator.fill('rgba(0, 0, 0, 1)');

        myImage = loadImage('paper.jpg');
    }

    this.enter = () => {
    }

    this.draw = function () {
        let dark = color(32, 74, 105, 255);
        let bg = color(62, 114, 135, 255);
        let light = color(246, 226, 106, 255);

        background(bg);
        fill(51);


        // it's a while loop

        noStroke();

        for (let i = 0; i < (width / (moonSize * 1.5)); ++i) {
            var x = i * moonSize * 1.5;
            var y = height/2 - moonSize / 2 + cos(0.01 * frameCount + i) * moonSize;

            fill(color(32, 74, 105, 255));
            rectMode(CORNERS);
            rect(x, y+moonSize/2, x + moonSize, height);
            ellipseMode(CORNER);
            circle(x, y, moonSize);

            this.drawMoon(x, y, moonSize/2, i*Math.PI);
        }
    }


    this.drawMoon = (x, y, r, aOffset) => {
        const juggleMask = (mask, offset) => {
            this.phaseMask(mask, (frameCount + offset * 300) % 300 / 300 * TAU, r);
            mask.push();
            // because we have to keep redrawing to the mask, we need to only use
            // this source-in composite operation when we're actually applying the
            // reverse mask
            mask.drawingContext.globalCompositeOperation = 'source-in';

            // because we keep editing the mask and re-applying, and Image.mask()
            // is cumulative, we have to use a reverse mask.
            mask.image(myImage, 0, 0);
            mask.pop();
        }
        juggleMask(this.mask, aOffset);
        juggleMask(this.westTerminator, aOffset + 0.05);
        juggleMask(this.eastTerminator, aOffset + -0.05);
        // TODO: if we want to drop shadow this, or throw a dark circle behind it, we'll need to tint each layer darker, instead of using the whole opacity thing.
        // if we do that, we might want to adjust some angle so the light/dark remains equal.
        // maybe easiest to render all of these into one final buffer, then render that buffer to screen as a whole.
        tint(255, 255 / 3);

        image(this.mask, x, y, moonSize, moonSize);
        image(this.westTerminator, x, y, moonSize, moonSize);
        image(this.eastTerminator, x, y, moonSize, moonSize);
    }

    this.phaseMask = (ctx, a, r, color) => {
        const phase = a / (PI / 2) | 0;
        if (color === undefined) {
            color == 'rgba(0, 0, 0, 1)'
        }
        ctx.push();
        switch (phase) {
            case 0: // waxing crescent
                ctx.clear();
                // light part
                ctx.arc(r, r, 2 * r, 2 * r, - PI / 2, PI / 2);
                // cut out dark part
                ctx.blendMode(REMOVE);
                ctx.fill('rgba(0, 0, 0, 1)');
                ctx.arc(r, r, 2 * r * cos(a), 2 * r, -PI / 2, PI / 2);
                break;
            case 1: // waxing gibbous
                ctx.clear();
                // light east side
                ctx.arc(r, r, 2 * r, 2 * r, - PI / 2, PI / 2);
                // growing west side
                ctx.arc(r, r, 2 * r * cos(a), 2 * r, PI / 2, 3 * PI / 2);
                break;
            case 2: // waning gibbous
                ctx.clear();
                // light west side
                ctx.arc(r, r, 2 * r, 2 * r, PI / 2, 3 * PI / 2);
                // shrinking east side
                ctx.arc(r, r, 2 * r * cos(a), 2 * r, - PI / 2, PI / 2);
                break;
            case 3: // waning crescent
                ctx.clear();
                // light part
                ctx.arc(r, r, 2 * r, 2 * r, PI / 2, 3 * PI / 2);
                // cut out dark part
                ctx.blendMode(REMOVE);
                ctx.fill('rgba(0, 0, 0, 1)');
                ctx.arc(r, r, 2 * r * cos(a), 2 * r, PI / 2, 3 * PI / 2);
                break;
        }
        ctx.pop();
    }
}
    