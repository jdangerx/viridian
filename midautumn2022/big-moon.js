class FallingFlower {
    constructor(x, y, radius, rotation, rotationScale) {
        this.x = x;
        this.y = y;
        this.velocityY = 0.03;
        this.radius = radius;
        this.rotation = rotation

        var x = random(0, 1);
        this.rotationScale = rotationScale;
    }
}

function BigMoon() {
    let moonImage;
    let paperImage;
    let bunnyImage1;
    let bunnyImage2;

    let moonSize;
    let strokeWidth = 8;

    let colorMoon;
    let colorDeepRed;
    let colorBG;
    let colorFlower = color(178, 68, 89);

    let numFlowers = 18;
    let flowerRadius = grid * 3;
    let fallingFlowers = [];

    this.setup = () => {

        colorMode(HSB, 360, 100, 100, 255);

        colorDeepRed = color(356, 81.8, 64.7, 255);
        colorBG = color(23, 44.2, 94.1, 255);
        colorOutline = color(17, 90, 42.7);
        colorMoon = (23, 44.2, 94.1, 255);

        moonSize = utils.roundUpNearest10(grid * 10);
        this.strokeWidth = 4;
        threshold = 128;
        pixelDensity(1);

        for (let i = 0; i < numFlowers; ++i) {
            var rotationScale = random(-1, 1);

            var newFlower = new FallingFlower(
                (i + random(-0.2, 0.2)) * (flowerRadius * 1.1),
                random(-height * 2, 0),
                flowerRadius,
                i * 0.7,
                rotationScale);
            fallingFlowers[i] = newFlower;
        }

        moonImage = loadImage('images/moonRound.png');

        paperImage = loadImage('images/paper.jpg');
        //flowerImage2 = loadImage('images/flowers/PNG/GB_ELEMENT-30-3.png');
        flowerImage1 = loadImage('images/flowers/PNG/GB_ELEMENT-40-1.png');
        flowerImage2 = loadImage('images/flowers/PNG/GB_ELEMENT-40-2.png');
        flowerImage3 = loadImage('images/flowers/PNG/GB_ELEMENT-30.png');

        bunnyImage1 = loadImage('images/rabbits/PNG/bunny-ponder.png');
        bunnyImage2 = loadImage('images/rabbits/PNG/bunny-sit.png');
        bunnyImage3 = loadImage('images/rabbits/PNG/bunny-back.png');

        this.moonBase = createGraphics(width, height);
        this.moonBase.fill('rgba(0, 0, 0, 1)');
        this.moonBase.ellipseMode(CORNER);

        this.moonBaseMask = createGraphics(width, height);

        this.flowerLayer = createGraphics(grid * 10, grid * 10);
        this.flowerLayer.noStroke();
        this.flowerLayer.fill('rgba(0, 0, 0, 1)');

        this.backgroundLayer = createGraphics(width, height);
        this.backgroundLayer.image(paperImage, 0, 0, paperImage.width, paperImage.height);
    }

    this.enter = () => {
    }

    this.draw = function () {

        randomSeed(13);
        background(colorBG);

        push();
        tint(colorBG);
        this.backgroundLayer.image(paperImage, 0, 0, width, width * (paperImage.height / paperImage.width));
        image(this.backgroundLayer, 0, 0, width, height);
        pop();

        noStroke();

        for (let j = -1; j < 1; ++j) {
            for (let i = 0; i < 20; ++i) {
                var deleteRandomly = false;
                if (j < 0) {
                    deleteRandomly = true;
                }
                var flowerX = ((i - 1) + (j * 0.5)) * grid * 2.1;
                var flowerY = height / 2 + grid * (j + 1);
                this.drawFlower(flowerX, flowerY, i + j, grid * 3, deleteRandomly);
            }
        }

        this.drawMoon(width / 2, height / 2 - grid * .5);

        for (let i = 0; i < numFlowers; ++i) {
            this.updateFlower(fallingFlowers[i]);
        }

        push();
        var glowStrokeWidth = this.strokeWidth + 3;

        this.flowerLayer.clear();
        this.flowerLayer.image(bunnyImage1, 0, 0, grid * 10, grid * 10);
        var bunSize = grid * 7;
        var bunX = width / 2 + grid * 3.8;
        var bunY = height / 2 - grid * 2;
        utils.drawWithOutline(this.flowerLayer, bunX, bunY, colorOutline, glowStrokeWidth, bunSize);

        this.flowerLayer.clear();
        this.flowerLayer.image(bunnyImage2, 0, 0, grid * 12, grid * 12);
        bunSize = grid * 8;
        bunX = width / 2 - grid * 13;
        bunY = height / 2 - grid * 3;
        utils.drawWithOutline(this.flowerLayer, bunX, bunY, colorOutline, glowStrokeWidth, bunSize);

        for (let j = 1; j < 2; ++j) {
            for (let i = 0; i < 20; ++i) {
                var flowerX = ((i - 1) + (j * 0.5)) * grid * 2.1;
                var flowerY = height / 2 + grid * (j + 1);
                this.drawFlower(flowerX, flowerY, i + j, grid * 3);
            }
        }

        this.flowerLayer.clear();
        this.flowerLayer.image(bunnyImage3, 0, 0, grid * 10, grid * 10);
        bunX = width / 2 - grid * 2;
        bunY = height / 2 - grid * 0.7;
        utils.drawWithOutline(this.flowerLayer, bunX, bunY, colorOutline, glowStrokeWidth, bunSize);

        for (let j = 2; j < 3; ++j) {
            for (let i = 0; i < 20; ++i) {
                var flowerX = ((i - 1) + (j * 0.5)) * grid * 2.1;
                var flowerY = height / 2 + grid * (j + 1);
                this.drawFlower(flowerX, flowerY, i + j, grid * 3);
            }
        }

        utils.noGlow();
        pop();
    }

    this.updateFlower = () => {
        for (let i = 0; i < numFlowers; ++i) {
            var f = fallingFlowers[i];
            f.y += f.velocityY;
            if (f.y > height) {
                f.y -= height * 2;
            }
            f.rotation += 0.001 * f.rotationScale;
            this.drawFlower(f.x, f.y, f.rotation, f.radius, false);
        }
    }

    this.drawFlower = (x, y, rotation, size, deleteRandomly = false) => {
        utils.noGlow();

        var ran = random(0, 1);
        var ranImage = flowerImage2;
        if (ran > 0.35) {
            ranImage = flowerImage1;
        }

        if (deleteRandomly) {
            ran = random(0, 1);
            if (ran > 0.35) {
                return;
            }
        }

        this.flowerLayer.clear();
        utils.addRotatedImage(this.flowerLayer, ranImage, rotation);
        image(this.flowerLayer, x, y, size, size);
    }


    this.drawMoon = (x, y) => {
        var size = moonSize + cos(frameCount * 0.005) * grid / 2;
        // Create always circular moonbase, so the texture is visible even in shadow
        this.moonBaseMask.push();
        this.moonBaseMask.background(255);
        this.moonBaseMask.noStroke();
        this.moonBaseMask.blendMode(REMOVE);
        this.moonBaseMask.fill(255);
        this.moonBaseMask.circle(x, y, size);
        this.moonBaseMask.pop();

        this.moonBase.push();
        this.moonBase.clear();
        this.moonBase.image(paperImage, 0, 0, width, width * (paperImage.height / paperImage.width));
        this.moonBase.blendMode(REMOVE);
        this.moonBase.image(this.moonBaseMask, 0, 0)
        this.moonBase.pop();

        this.moonBase.push();
        this.moonBase.noFill();
        this.moonBase.stroke(colorOutline);
        this.moonBase.strokeWeight(strokeWidth);

        this.moonBase.ellipseMode(CENTER);
        this.moonBase.circle(x, y, size + strokeWidth);
        this.moonBase.pop();

        image(this.moonBase, 0, 0);
    }
}