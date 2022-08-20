function Mountains() {
    let moonImage;
    let paperImage;
    let mountainImage1;
    let bunnyImage1;
    let bunnyImage2;

    let moonSize;
    let strokeWidth = 0;

    let colorMoon;
    let colorDeepRed;
    let colorBG;
    let colorMountain;
    let colorFlower = color(178, 68, 89);

    let numFlowers = 18;
    let flowerRadius = grid * 3;
    let fallingFlowers = [];

    this.setup = () => {

        colorMode(HSB, 360, 100, 100, 255);

        colorDeepRed = color(356, 81.8, 64.7, 255);
        colorBG = color(195, 56, 74, 255);
        colorOutline = color(17, 90, 42.7);
        colorMoon = color(38, 50, 98, 255);
        colorMountain = color(119, 10, 69);

        moonSize = utils.roundUpNearest10(grid * 4.5);
        this.strokeWidth = 0;
        threshold = 128;
        pixelDensity(1);

        //moonImage = loadImage('images/moonRound.png');
        moonImage = loadImage("images/watercolor_texture_pack/10-1.jpg");
        paperImage = loadImage("images/watercolor_texture_pack/10.jpg");
        mountainImage1 = loadImage('images/water_color_mountains/background_6.png');
        mountainImage2 = loadImage('images/water_color_mountains/background_7.png');
        mountainImage3 = loadImage('images/water_color_mountains/background_2.png');
        mountainImage4 = loadImage('images/water_color_mountains/background_2.png');

        bunnyImage1 = loadImage('images/rabbits/PNG/bunny-hop.png');
        bunnyImage2 = loadImage('images/rabbits/PNG/bunny-sit.png');

        this.moonBase = createGraphics(moonSize+this.strokeWidth+2, moonSize+this.strokeWidth+2);
        this.moonBase.fill('rgba(0, 0, 0, 1)');
        this.moonBase.ellipseMode(CORNER);

        this.bunnyLayer = createGraphics(height, height);
        this.bunnyLayer.noStroke();
        this.bunnyLayer.fill('rgba(0, 0, 0, 1)');

        this.mountainLayer = createGraphics(grid*10, grid*10);
        this.mountainLayer.noStroke();
        this.mountainLayer.fill('rgba(0, 0, 0, 1)');

        this.backgroundLayer = createGraphics(width, height);
        this.backgroundLayer.image(paperImage, 0, 0, paperImage.width, paperImage.height);
    }

    this.enter = () => {
    }

    this.draw = function () {

        randomSeed(12);
        background(colorBG);

        push();
        tint(colorBG);
        this.backgroundLayer.image(paperImage, 0, 0, width, width * (paperImage.height/paperImage.width));
        image(this.backgroundLayer, 0, 0, width, height);
        pop();

        noStroke();
      
        this.drawMoon(width/2, height/2);

        /*
        for (let i = 0; i < numFlowers; ++i)
        {
            this.updateMountain(fallingFlowers[i]);
        }*/

        push();
        var glowStrokeWidth = this.strokeWidth + 3;

        
        this.bunnyLayer.clear();
        utils.addRotatedImageOffset(this.bunnyLayer, bunnyImage1, frameCount/100, -grid*3.5);

        utils.glow(color(0), 12, 0, 0);
        var bunSize = grid * 5;
        var bunX = width/2;
        var bunY = height/2;
        imageMode(CENTER);
        image(this.bunnyLayer, bunX, bunY, this.bunnyLayer.width, this.bunnyLayer.height);
        //this.drawWithOutline(this.bunnyLayer, bunX, bunY, colorOutline, glowStrokeWidth, bunSize);


        for (let j = 2; j < 4; ++j)
        {
            for (let i = 0; i < 20; ++i)
            {
                var mountainSizeX = grid * 6;
                var x = ((i-1+cos(frameCount/200)*0.5*Math.pow(-1, j)) - (j*0.7)) * mountainSizeX * 1.4;
                var y = grid * 3.5 + grid*(j+1)*1.3;
                this.drawMountain(x, y, 0, mountainSizeX);
            }
        }

        utils.noGlow();
        pop();
    }

    this.updateMountain = () => {
        for (let i=0; i < numFlowers; ++i)
        {
            var f = fallingFlowers[i];
            f.y += f.velocityY;
            if (f.y > height) {
                f.y -= height * 2;
            }
            f.rotation += 0.001 * f.rotationScale;
            this.drawMountain(f.x, f.y, f.rotation, f.radius, false);
        }
    }

    this.drawMountain = (x, y, rotation, size, deleteRandomly=false) => {
        push();
        utils.glow(color(0), 12, -2, 2);

        var ran = random(0, 4);
        var ranImage = mountainImage1;
        if (ran > 1) {
            ranImage = mountainImage2;
        }
        if (ran > 2) {
            ranImage = mountainImage3;
        }
        if (ran > 3) {
            ranImage = mountainImage4;
        }

        if (deleteRandomly)
        {
            ran = random(0, 1);
            if (ran > 0.35)
            {
                return;
            }
        }

        this.mountainLayer.clear();
        utils.addRotatedImage(this.mountainLayer, ranImage, rotation); 
        //tint(colorMountain);
        image(this.mountainLayer, x, y, size*2, size);

        utils.noGlow();
        pop();
    }


    this.drawMoon = (x, y) => {
        push();
        utils.glow(color(0), 12, -2, 2);

        tint(colorMoon);
        var size = moonSize + cos(frameCount * 0.005) * grid/2;
        // Create always circular moonbase, so the texture is visible even in shadow

        this.moonBase.push();
        this.moonBase.clear();
        this.moonBase.fill(255);
        this.moonBase.circle(this.strokeWidth, this.strokeWidth, moonSize+1);
        this.moonBase.drawingContext.globalCompositeOperation = 'source-in';
        this.moonBase.image(moonImage, 0, 0, moonSize*2, moonSize*2);
        this.moonBase.pop();

        image(this.moonBase, x-size/2, y-size/2, size, size);

        utils.noGlow();
        pop();
    }
}