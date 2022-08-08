function GlowTest() {

    let moonImage;
    let flowerImage1;
    let flowerImage2;
    let flowerImage3;

    let moonSize = 300;

    this.setup = () => {
        colorMode(HSB, 360, 100, 100)


        moonSize = width / 5;
        threshold = 128;

        this.moonBase = createGraphics(moonSize, moonSize);
        this.moonBase.noStroke();
        this.moonBase.fill('rgba(0, 0, 0, 1)');

        this.flower1 = createGraphics(320, 320);
        this.flower1.noStroke();
        this.flower1.fill('rgba(0, 0, 0, 1)');

        this.flower2 = createGraphics(320, 320);
        this.flower2.noStroke();
        this.flower2.fill('rgba(0, 0, 0, 1)');

        this.flower3 = createGraphics(320, 320);
        this.flower3.noStroke();
        this.flower3.fill('rgba(0, 0, 0, 1)');

        //flower1Image = loadImage('images/flower-sheet.png');
        flowerImage1 = loadImage('images/flower1.png');
        flowerImage2 = loadImage('images/flower2.png');
        flowerImage3 = loadImage('images/flower3.png');
        moonImage = loadImage('images/moonRound.png');
    }

    this.glow = (glowColor, bluriness, x, y) => {
        drawingContext.shadowBlur = bluriness;
        drawingContext.shadowColor = glowColor;
        drawingContext.shadowOffsetX = x;
        drawingContext.shadowOffsetY = y;
    }

    this.noGlow = () => {
        drawingContext.shadowBlur = 0;
        drawingContext.shadowOffsetX = 0;
        drawingContext.shadowOffsetY = 0;
    }

    this.draw = () => {
        colorMode(HSB, 360, 100, 100);
        background(color(200, 80, 50));

        fill(255);
        noStroke();

        this.glow(color(255), 32, 0, 0);
        circle(width / 2, height / 2, 50);

        this.noGlow()

        this.glow(color(50), 0, 10, 10);

        circle(width / 2, height / 2 + 100, 50);

        this.glow(color(50, 30, 100), 64, 0, 0);


        this.moonBase.push();
        this.moonBase.ellipseMode(CORNER);
        this.moonBase.circle(0, 0, moonSize);
        this.moonBase.drawingContext.globalCompositeOperation = 'source-in';
        this.moonBase.tint(255, 245, 190, 255)
        this.moonBase.image(moonImage, 0, 0, moonSize, moonSize);
        this.moonBase.pop();
        image(this.moonBase, 100, 100, moonSize, moonSize);


        this.glow(color(0), 48, 5, 5);


        this.flower1.push();
        this.flower1.image(flowerImage1, 0, 0, 320, 320);
        this.flower1.pop();

        this.flower2.push();
        this.flower2.image(flowerImage2, 0, 0, 320, 320);
        this.flower2.pop();

        this.flower3.push();
        this.flower3.image(flowerImage3, 0, 0, 320, 320);
        this.flower3.pop();


        image(this.flower2, 620, 150, 200, 200);
        image(this.flower1, 500, 100, 200, 200);
        image(this.flower3, 720, 70, 200, 200);

    }
}
