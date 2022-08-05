function RisoTestJohn() {
    // just testing importing of mooncakes stuff for now
    this.setup = () => {
        this.buf = createGraphics(200, 200);
        this.buf.noStroke();
        this.buf.fill(240);
        this.buf.circle(50, 50, 50);
        this.buf.fill(80);
        this.buf.circle(150, 150, 50);
        this.buf.fill(160);
        this.buf.circle(100, 100, 80);

        threshold = 128;
        this.dithered = ditherImage(this.buf, 'atkinson', threshold);
    }
    this.enter = () => {
        this.setup();
    }

    this.draw = () => {
        background(128);
        blendMode(SCREEN);
        image(this.dithered, mouseX - 400, mouseY - 300);
    }
}
