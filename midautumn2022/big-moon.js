function BigMoon() {
    let moonImage;
    let paperImage;
    let moonSize;
    let bunnyImage1;
    let bunnyImage2;

    let colorMoon;
    let colorMoonShadow = color(210, 210, 230, 70);
    let colorDeepRed = color(2, 70, 123, 255);
    let colorDarkTransparent = color(2, 40, 83, 105);
    let colorDarker = color(29, 47, 87, 255);
    let colorBG;
    let colorFlower = color(178, 68, 89);

    this.setup = () => {

        colorMode(HSB, 360, 100, 100, 255);

        colorDeepRed = color(356, 81.8, 64.7, 255);
        colorBG = color(23, 44.2, 94.1, 255);
        colorOutline = color(17, 90, 42.7);
        colorMoon = (23, 44.2, 94.1, 255);

        moonSize = utils.roundUpNearest10(grid * 10);
        threshold = 128;
        pixelDensity(1);

        moonImage = loadImage('images/moonRound.png');

        paperImage = loadImage('images/paper.jpg');
        flowerImage1 = loadImage('images/flower01.png');
        bunnyImage1 = loadImage('images/Bunnies/PNG/bunny-ponder.png');
        bunnyImage2 = loadImage('images/Bunnies/PNG/bunny-sit.png');

        this.moonBase = createGraphics(moonSize*2+5, moonSize*2+5);
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

        noStroke();
        this.drawMoon(width/2, height/2);

        push();
        utils.glow(color(0, 0, 0), 12, 0, 0);
        this.flowerLayer.clear();
        tint(colorFlower);

        utils.noGlow();
        pop();

        push();
        utils.glow(colorOutline, 0, 1, 1);
        this.flowerLayer.clear();

        this.flowerLayer.image(bunnyImage1, 0, 0, moonSize*5, moonSize*5);
        var bunSize = moonSize * 0.6;
        var bunX = width/2+grid*4;
        var bunY = height/2-grid*1;
        image(this.flowerLayer, bunX, bunY, bunSize, bunSize);

        utils.glow(colorOutline, 0, -1, -1);
        
        image(this.flowerLayer, bunX, bunY, bunSize, bunSize);

        this.flowerLayer.clear();
        this.flowerLayer.image(bunnyImage2, 0, 0, moonSize*5, moonSize*5);
        bunX = width/2-grid*12;
        bunY = height/2-grid*1;
        image(this.flowerLayer, bunX, bunY, bunSize, bunSize);

        utils.glow(colorOutline, 0, -1, -1);
        
        image(this.flowerLayer, bunX, bunY, bunSize, bunSize);


        utils.noGlow();
        pop();
    }


    this.drawMoon = (x, y) => {

        var size = moonSize + cos(frameCount * 0.01) * grid/2;
        // Create always circular moonbase, so the texture is visible even in shadow

        this.moonBase.push();
        this.moonBase.clear();
        this.moonBase.fill(255);
        this.moonBase.circle(size/2, size/2, size+1);
        this.moonBase.drawingContext.globalCompositeOperation = 'source-in';
        this.moonBase.image(paperImage, 0, 0, moonSize*2, moonSize*2);
        this.moonBase.pop();

        this.moonBase.noFill();
        this.moonBase.ellipseMode(CORNER);
        this.moonBase.stroke(colorOutline);
        this.moonBase.strokeWeight(2);

        this.moonBase.circle(size/2, size/2, (size)+3);

        image(this.moonBase, x-size/2, y-size/2, moonSize, moonSize);
    }
}