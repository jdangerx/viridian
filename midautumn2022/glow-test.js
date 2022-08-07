function GlowTest() {

    let moonImage;
    let moonSize = 100;

    this.setup = () => {
        colorMode(HSB, 360, 100, 100)

        createCanvas(900, 400);

        moonSize = width/10;
        threshold = 128;

        this.moonBase = createGraphics(moonSize, moonSize);
        this.moonBase.noStroke();
        this.moonBase.fill('rgba(0, 0, 0, 1)');

        moonImage = loadImage('moonRound.png');
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
        background(0);

        fill(255);
        noStroke();
        
        this.glow(color(255), 32, 0, 0);
        circle(width/2, height/2, 50);

        this.noGlow()

        this.glow(color(50), 0, 10, 10);

        circle(width/2+50, height/2+50, 50);

        this.glow(color(200, 30, 100), 48, 0, 0);

        this.moonBase.push();
        this.moonBase.ellipseMode(CORNER);
        this.moonBase.circle(0, 0, moonSize);
        this.moonBase.drawingContext.globalCompositeOperation = 'source-in';
        this.moonBase.image(moonImage, 0, 0, moonSize, moonSize);
        this.moonBase.pop();
        image(this.moonBase, 100, 100, moonSize, moonSize);
    }
}
