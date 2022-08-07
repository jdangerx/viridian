function Phases() {
    let moonImage;
    let paperImage;
    let moonSize;
    this.setup = () => {
        createCanvas(900, 400);

        moonSize = width/10;
        threshold = 128;
        pixelDensity(1);

        this.moonBase = createGraphics(moonSize, moonSize);
        this.moonBase.noStroke();
        this.moonBase.fill('rgba(0, 0, 0, 1)');

        this.mask = createGraphics(moonSize, moonSize);
        this.mask.noStroke();
        this.mask.fill('rgba(0, 0, 0, 1)');

        this.westTerminator = createGraphics(moonSize, moonSize);
        this.westTerminator.noStroke();
        this.westTerminator.fill('rgba(0, 0, 0, 1)');

        this.eastTerminator = createGraphics(moonSize, moonSize);
        this.eastTerminator.noStroke();
        this.eastTerminator.fill('rgba(0, 0, 0, 1)');

        moonImage = loadImage('images/moonRound.png');
        paperImage = loadImage('images/paper.jpg');
    }

    this.enter = () => {
    }

    this.draw = function () {
        let dark = color(32, 74, 105, 255);
        let darker = color(12, 44, 75, 255);

        let bg = color(62, 114, 135, 255);
        let light = color(246, 226, 106, 255);


        background(bg);
        //image(paperImage, 0, 0, width, height);

        // it's a while loop

        noStroke();


        this.buf = createGraphics(moonSize, moonSize);
        this.buf.fill('rgba(255, 255, 255, 1)')
        this.buf.stroke(2);
        this.buf.circle(0, 0, 50);

        black = new Riso([0, 0, 0], 200, 200);
        black.fill(255);
        this.img = extractCMYKChannel(this.buf, 'k');
        black.image(extractCMYKChannel(this.buf, 'k'), 3, 3);
        drawRiso();

        return;
        for (let i = 0; i < (width / (moonSize * 1.5)); ++i) {
            var x = i * moonSize * 1.5;
            var y = height/2 - moonSize / 2 + cos(0.01 * frameCount + i) * moonSize;

            fill(dark);
            rectMode(CORNERS);
            rect(x, y+moonSize/2, x + moonSize, height);
            ellipseMode(CORNER);
            fill(darker);
            circle(x, y+moonSize/7, moonSize);
            fill(dark);
            circle(x, y, moonSize);


            this.drawMoon(x, y, moonSize/2, i*0.1);
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
            mask.image(moonImage, 0, 0, moonSize, moonSize);
            mask.pop();
        }

        // Create always circular moonbase, so the texture is visible even in shadow
        this.moonBase.push();
        this.moonBase.ellipseMode(CORNER);
        this.moonBase.circle(0, 0, moonSize);
        this.moonBase.drawingContext.globalCompositeOperation = 'source-in';
        this.moonBase.image(moonImage, 0, 0, moonSize, moonSize);
        this.moonBase.pop();

        juggleMask(this.mask, aOffset);
        //juggleMask(this.westTerminator, aOffset + 0.05);
        //juggleMask(this.eastTerminator, aOffset + -0.05);
        // TODO: if we want to drop shadow this, or throw a dark circle behind it, we'll need to tint each layer darker, instead of using the whole opacity thing.
        // if we do that, we might want to adjust some angle so the light/dark remains equal.
        // maybe easiest to render all of these into one final buffer, then render that buffer to screen as a whole.

        this.dithered0 = ditherImage(this.moonBase, 'atkinson', threshold);
        this.dithered1 = ditherImage(this.mask, 'atkinson', threshold);
        //this.dithered2 = ditherImage(this.westTerminator, 'atkinson', threshold);
        //this.dithered3 = ditherImage(this.eastTerminator, 'atkinson', threshold);

        image(this.dithered0, x, y, moonSize, moonSize);

        image(this.dithered1, x, y, moonSize, moonSize);
        //image(this.dithered2, x, y, moonSize, moonSize);
        //image(this.dithered2, x, y, moonSize, moonSize);
    }

    this.phaseMask = (ctx, a, r, color) => {
        const phase = a / (PI / 2) | 0;
        if (color === undefined) {
            color == 'rgba(0, 0, 0, 1)'
        }
        ctx.push();
        ctx.fill(255);
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
    