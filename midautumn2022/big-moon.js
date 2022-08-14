function BigMoon() {
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

        moonSize = utils.roundUpNearest10(grid * 10);
        threshold = 128;
        pixelDensity(1);

        moonImage = loadImage('images/moonRound.png');

        paperImage = loadImage('images/paper.jpg');
        flowerImage1 = loadImage('images/flower01.png');

        this.moonBase = createGraphics(moonSize+5, moonSize+5);
        this.moonBase.noStroke();
        this.moonBase.fill('rgba(0, 0, 0, 1)');

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

        utils.noGlow();
        pop();

        this.drawMoon(100, 100);

    }


    this.drawMoon = (x, y) => {

        // Create always circular moonbase, so the texture is visible even in shadow
        this.moonBase.push();
        this.moonBase.ellipseMode(CORNER);
        //this.moonBase.circle(0, 0, moonSize+5);
        //this.moonBase.drawingContext.globalCompositeOperation = 'source-in';
        this.moonBase.image(moonImage, 0, 0, moonSize, moonSize);
        this.moonBase.pop();

        push();
        utils.glow(colorDarker, 12, 0, 0);
        image(this.moonBase, x, y, moonSize, moonSize);
        utils.noGlow();
        pop();
    }
}