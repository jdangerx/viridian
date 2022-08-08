function Phases() {
    let moonImage;
    let paperImage;
    let moonSize;
    let dark = color(32, 74, 105, 255);
    let darker = color(12, 44, 75, 255);

    let bg = color(62, 114, 135, 255);
    let light = color(246, 226, 106, 255);

    this.setup = () => {
        createCanvas(3840, 1080);
        //createCanvas(1920, 540);

        moonSize = width / 12;
        threshold = 128;
        pixelDensity(1);

        this.moonBase = createGraphics(moonSize, moonSize);
        this.moonBase.noStroke();
        this.moonBase.fill('rgba(0, 0, 0, 1)');

        this.moonMasked = createGraphics(moonSize, moonSize);
        this.moonMasked.noStroke();
        this.moonMasked.fill('rgba(0, 0, 0, 1)');

        moonImage = loadImage('images/moonRound.png');
        paperImage = loadImage('images/paper.jpg');
    }

    this.enter = () => {
    }

    this.draw = function () {


        background(bg);

        // it's a while loop

        noStroke();

        for (let i = 0; i < (width / (moonSize * 1.5) - 1); ++i) {
            var x = (i+0.5) * moonSize * 1.5;
            var y = height / 2 - moonSize/2 + cos(0.01 * frameCount + i) * moonSize / 2;

            fill(dark);
            rectMode(CORNERS);
            rect(x, y + moonSize / 2, x + moonSize, height);
            ellipseMode(CORNER);
            fill(darker);
            circle(x, y + moonSize / 7, moonSize);
            fill(dark);
            circle(x, y, moonSize);


            this.drawMoon(x, y, moonSize / 2, i * 0.145);
        }
    }


    this.drawMoon = (x, y, r, aOffset) => {
        const juggleMask = (mask, offset) => {
            this.phaseMask(mask, (frameCount + offset * 300) % 300 / 300 * TAU, r);
            //this.phaseMask(mask, 0, r);

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

        juggleMask(this.moonMasked, aOffset);

        baseDithered = ditherImage(this.moonBase, 'atkinson', threshold);
        maskedDithered = ditherImage(this.moonMasked, 'atkinson', threshold);

        push();
        tint(255, 100);
        image(this.moonBase, x, y, moonSize, moonSize);
        pop();

        image(this.moonMasked, x, y, moonSize, moonSize);
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
