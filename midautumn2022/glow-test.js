function GlowTest() {
    this.setup = () => {
        colorMode(HSB, 360, 100, 100)
        createCanvas(400, 400);
    }

    this.glow = (glowColor, bluriness) => {
        drawingContext.shadowBlur = bluriness;
        drawingContext.shadowColor = glowColor;
    }

    this.noGlow = () => {
        drawingContext.shadowBlur = 0;
    }

    this.draw = () => {
        background(0);

        fill(255);
        noStroke();
        this.glow(color(255), 32);
        circle(width/2, height/2, 50);

        this.noGlow()

        circle(width/2+50, height/2+50, 50);
    }
}
