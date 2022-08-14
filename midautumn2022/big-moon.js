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
        //flowerImage1 = loadImage('images/flowers/PNG/GB_ELEMENT-30.png');
        //flowerImage2 = loadImage('images/flowers/PNG/GB_ELEMENT-30-3.png');
        flowerImage1 = loadImage('images/flowers/PNG/GB_ELEMENT-40-1.png');
        flowerImage2 = loadImage('images/flowers/PNG/GB_ELEMENT-40-2.png');

        bunnyImage1 = loadImage('images/rabbits/PNG/bunny-ponder.png');
        bunnyImage2 = loadImage('images/rabbits/PNG/bunny-sit.png');

        this.moonBase = createGraphics(moonSize+5, moonSize+5);
        this.moonBase.fill('rgba(0, 0, 0, 1)');
        this.moonBase.ellipseMode(CORNER);

        this.flowerLayer = createGraphics(grid*10, grid*10);
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
        
        for (let j = 0; j < 1; ++j)
        {
            for (let i = 0; i < 20; ++i)
            {
                var flowerX = ((i-1) + (j*0.5)) * grid*2.1;
                var flowerY = height/2+grid*(j+1);
                this.drawFlower(flowerX, flowerY, i + j);
            }
        }

        this.drawMoon(width/2, height/2);

        push();
        utils.glow(colorOutline, 0, 1, 1);
        this.flowerLayer.clear();

        this.flowerLayer.image(bunnyImage1, 0, 0, grid*10, grid*10);
        var bunSize = grid * 8;
        var bunX = width/2+grid*4;
        var bunY = height/2-grid*2;
        image(this.flowerLayer, bunX, bunY, bunSize, bunSize);

        utils.glow(colorOutline, 0, -1, -1);
        
        image(this.flowerLayer, bunX, bunY, bunSize, bunSize);

        this.flowerLayer.clear();
        this.flowerLayer.image(bunnyImage2, 0, 0, grid*10, grid*10);
        bunX = width/2-grid*12;
        bunY = height/2-grid*2;
        image(this.flowerLayer, bunX, bunY, bunSize, bunSize);

        utils.glow(colorOutline, 0, -1, -1);
        
        image(this.flowerLayer, bunX, bunY, bunSize, bunSize);


        for (let j = 1; j < 3; ++j)
        {
            for (let i = 0; i < 20; ++i)
            {
                var flowerX = ((i-1) + (j*0.5)) * grid*2.1;
                var flowerY = height/2+grid*(j+1);
                this.drawFlower(flowerX, flowerY, i + j);
            }
        }

        utils.noGlow();
        pop();
    }

    this.drawFlower = (x, y, i) => {
        utils.noGlow();
        var ran = 1;//random(0, 1);
        var ranImage = flowerImage2;
        if (ran > 0.5) {
            ranImage = flowerImage1;
        }
        this.flowerLayer.clear();
        utils.addRotatedImage(this.flowerLayer, ranImage, i); 
        image(this.flowerLayer, x, y, grid*3, grid*3);
    }


    this.drawMoon = (x, y) => {

        var size = moonSize;// + cos(frameCount * 0.01) * grid/2;
        // Create always circular moonbase, so the texture is visible even in shadow

        this.moonBase.push();
        this.moonBase.clear();
        this.moonBase.fill(255);
        this.moonBase.circle(0, 0, size+1);
        this.moonBase.drawingContext.globalCompositeOperation = 'source-in';
        this.moonBase.image(paperImage, 0, 0, size, size);
        this.moonBase.pop();

        this.moonBase.push();
        this.moonBase.noFill();
        this.moonBase.stroke(colorOutline);
        this.moonBase.strokeWeight(2);

        this.moonBase.circle(0, 0, (size)+3);
        this.moonBase.pop();

        image(this.moonBase, x-size/2, y-size*0.2, size, size);
    }
}