function RisoTest() {
    // just testing importing of mooncakes stuff for now
    this.setup = () => {
        this.buf = new Riso('orange');
        this.buf.noStroke();
        this.buf.fill(240);
        this.buf.circle(50, 50, 50);
        this.buf.fill(80);
        this.buf.circle(150, 150, 50);
        this.buf.fill(160);
        this.buf.circle(100, 100, 80);

    }
    this.enter = () => {
        this.setup();
    }

    this.draw = () => {
        background(128, 150, 240);
        threshold = 128;
        this.dithered = ditherImage(this.buf, 'atkinson', threshold);
        translate(-400, -300);
        image(this.dithered, mouseX, mouseY);
    }
}
