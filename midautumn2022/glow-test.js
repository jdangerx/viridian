function GlowTest() {
    this.setup = () => {
        colorMode(HSB, 360, 100, 100)
        createCanvas(400, 400);
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
    }
}
