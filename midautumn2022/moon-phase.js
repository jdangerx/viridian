function Phases() {
    let moonImage;
    let paperImage;
    let moonSize;
    let colorMoon = color(252, 246, 200, 255);
    let colorMoonShadow = color(210, 210, 230, 70);

    let colorDark = color(2, 70, 123, 255);
    let colorDarkTransparent = color(2, 40, 83, 105);
    let colorDarker = color(29, 47, 87, 255);
    let colorBG = color(8, 109, 157, 255);
    let colorFlower = color(178, 68, 89);

    this.setup = () => {

        colorMode(HSB, 360, 100, 100, 255);

        colorDark = color(206, 98.4, 48.2, 255);
        colorDarkTransparent = color(212, 97.6, 32.5, 105);
        colorDarker = color(221, 66.7, 34.1, 255);
        colorBG = color(199, 94.9, 61.6, 255);
        colorFlower = color(349, 61.8, 69.8);

        moonSize = grid * 2;
        threshold = 128;
        pixelDensity(1);

        moonImage = loadImage('images/moon-dithered.png');
        paperImage = loadImage('images/parchment.jpg');
        flowerImage1 = loadImage('images/flower01-white.png');


        this.moonBase = createGraphics(moonSize, moonSize);
        this.moonBase.noStroke();
        this.moonBase.fill('rgba(0, 0, 0, 1)');

        this.moonMasked = createGraphics(moonSize, moonSize);
        this.moonMasked.noStroke();
        this.moonMasked.fill('rgba(0, 0, 0, 1)');

        this.flowerLayer = createGraphics(350, 350);
        this.flowerLayer.noStroke();
        this.flowerLayer.fill('rgba(0, 0, 0, 1)');

        this.backgroundLayer = createGraphics(width, height);
        this.backgroundLayer.image(paperImage, 0, 0, paperImage.width, paperImage.height);
    }

    this.enter = () => {
    }

    this.draw = function () {


        background(colorBG);
        tint(colorBG);
        this.backgroundLayer.image(paperImage, 0, 0, width, width * (paperImage.height/paperImage.width));
        image(this.backgroundLayer, 0, 0, width, height);

        // it's a while loop

        noStroke();

        for (let i = 0; i < (width / (moonSize * 1.5) - 1.5); ++i) {
            var x = (i+0.5) * moonSize * 1.5;
            var y = height / 2 - moonSize/2 + cos(0.01 * frameCount + i) * moonSize / 2;

            fill(colorDarkTransparent);
            rectMode(CORNERS);
            rect(x, y + moonSize / 2, x + moonSize, height);
            ellipseMode(CORNER);
            fill(colorDarker);
            circle(x, y + moonSize / 6, moonSize);
            fill(colorDark);
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

        push();
        // TODO: tint is mad slow, so maybe replace with a colored image89        
        tint(colorMoonShadow);
        image(this.moonBase, x, y, moonSize, moonSize);
        pop();

        //image(this.moonMasked, x, y, moonSize, moonSize);
        tint(colorMoon);
        image(this.moonMasked, x, y, moonSize, moonSize);

        utils.glow(colorDarkTransparent, 10, 0, 0);
        this.flowerLayer.image(flowerImage1, 0, 0, this.flowerLayer.width, this.flowerLayer.height);
        tint(colorFlower);
        var flowerSize = grid * 3;
        image(this.flowerLayer, 20, 50, flowerSize, flowerSize);

        utils.noGlow();

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
