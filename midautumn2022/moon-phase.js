function Phases() {
    let moonImage;
    let moonImageBlue;
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

        moonSize = utils.roundUpNearest10(grid * 2.75);
        threshold = 128;
        pixelDensity(1);

        moonImage = loadImage('images/moon-dithered2.png');
        moonImageBlue = loadImage('images/moon-dithered-blue2.png');

        paperImage = loadImage('images/parchment.jpg');
        flowerImage1 = loadImage('images/flower01-white.png');

        branchImage1 = loadImage('images/leaves07.png');
        branchImage2 = loadImage('images/leaves01.png');
        branchImage3 = loadImage('images/leaves03.png');
        branchImage4 = loadImage('images/leaves08.png');


        this.moonBase = createGraphics(moonSize, moonSize);
        this.moonBase.noStroke();
        this.moonBase.fill('rgba(0, 0, 0, 1)');

        this.moonMasked = createGraphics(moonSize, moonSize);
        this.moonMasked.noStroke();
        this.moonMasked.fill('rgba(0, 0, 0, 1)');

        this.flowerLayer = createGraphics(moonSize*4, moonSize*4);
        this.flowerLayer.noStroke();
        this.flowerLayer.fill('rgba(0, 0, 0, 1)');

        this.backgroundLayer = createGraphics(width, height);
        this.backgroundLayer.image(paperImage, 0, 0, paperImage.width, paperImage.height);
    }

    this.enter = () => {
    }

    this.draw = function () {


        background(colorBG);

        push();
        tint(colorBG);
        this.backgroundLayer.image(paperImage, 0, 0, width, width * (paperImage.height/paperImage.width));
        image(this.backgroundLayer, 0, 0, width, height);
        pop();

        // it's a while loop

        noStroke();

        push();
        utils.glow(color(0, 0, 0), 12, 0, 0);
        this.flowerLayer.clear();
        tint(colorFlower);

        flowerSize = grid * 8;
        utils.addRotatedImage(this.flowerLayer, branchImage1, Math.PI);
        image(this.flowerLayer, width-grid*5.8, -grid*5, flowerSize, flowerSize);

        flowerSize = grid * 8;
        utils.addRotatedImage(this.flowerLayer, branchImage4, -Math.PI*0.35);
        image(this.flowerLayer, grid*2.5, -grid*4, flowerSize, flowerSize);


        flowerSize = grid * 1;
        utils.addRotatedImage(this.flowerLayer, branchImage3, -Math.PI*0.05);
        image(this.flowerLayer, grid*8, -grid*0.2, flowerSize, flowerSize);

        flowerSize = grid * 10;
        utils.addRotatedImage(this.flowerLayer, branchImage1, Math.PI*0.53);
        image(this.flowerLayer, width-flowerSize, height - flowerSize*0.52, flowerSize, flowerSize);    

        utils.noGlow();
        pop();

        for (let i = 0; i < (width / (moonSize * 1.5) - 1); ++i) {
            var x = (i+0.5) * moonSize * 1.5;
            var y = height / 2 - moonSize/2 + cos(0.005 * frameCount + i) * moonSize * 0.5;

            fill(colorDarkTransparent);
            rectMode(CORNERS);
            rect(x, y + moonSize / 2, x + moonSize, height);
            ellipseMode(CORNER);
            fill(colorDarker);
            circle(x, y + moonSize / 6, moonSize);
            fill(colorDark);
            circle(x, y, moonSize);

            this.drawMoon(x, y, moonSize / 2, i * 0.1445);
        }

        push();
        utils.glow(color(0, 0, 0), 12, 0, 0);
        this.flowerLayer.clear();
        tint(colorFlower);

        var flowerSize = grid * 7;
        utils.addRotatedImage(this.flowerLayer, branchImage1, Math.PI*0.06);
        image(this.flowerLayer, -grid*1.7, grid * 0.004, flowerSize, flowerSize);   

        flowerSize = grid * 1.2;
        utils.addRotatedImage(this.flowerLayer, branchImage3, Math.PI*0.55);
        image(this.flowerLayer, width-flowerSize*0.8, flowerSize*2, flowerSize, flowerSize);    

        utils.noGlow();
        pop();
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
        this.moonBase.image(moonImageBlue, 0, 0, moonSize, moonSize);
        this.moonBase.pop();

        juggleMask(this.moonMasked, aOffset);

        push();
        utils.glow(colorDarker, 12, 0, 0);
        image(this.moonBase, x, y, moonSize, moonSize);
        utils.noGlow();
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
