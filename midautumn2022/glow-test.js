function GlowTest() {

    let moonImage;
    let flower1Image;
    let flower1;
    let moonSize = 100;

    this.setup = () => {
        colorMode(HSB, 360, 100, 100)

        createCanvas(900, 400);

        moonSize = width/10;
        threshold = 128;

        this.moonBase = createGraphics(moonSize, moonSize);
        this.moonBase.noStroke();
        this.moonBase.fill('rgba(0, 0, 0, 1)');

        this.flower1 = createGraphics(1000, 1000);
        this.flower1.noStroke();
        this.flower1.fill('rgba(0, 0, 0, 1)');

//        flower1Image = loadImage('images/flower-sheet.png');
        flower1Image = loadImage('images/flower1.png');
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
        background(color(210, 70, 50));

        fill(255);
        noStroke();
        
        this.glow(color(255), 32, 0, 0);
        circle(width/2, height/2, 50);

        this.noGlow()

        //this.glow(color(50), 0, 10, 10);

        circle(width/2+50, height/2+50, 50);

        this.glow(color(200, 30, 100), 48, 0, 0);

        
        this.moonBase.push();
        this.moonBase.ellipseMode(CORNER);
        this.moonBase.circle(0, 0, moonSize);
        this.moonBase.drawingContext.globalCompositeOperation = 'source-in';
        this.moonBase.image(moonImage, 0, 0, moonSize, moonSize);
        this.moonBase.pop();
        image(this.moonBase, 100, 100, moonSize, moonSize);


        this.glow(color(0), 48, 0, 0);


        this.flower1.push();
        this.flower1.image(flower1Image, 0, 0, 320, 320);
        this.flower1.pop();
        image(this.flower1, 500, 100, 360, 360);
        image(this.flower1, 550, 150, 360, 360);

    }
}
