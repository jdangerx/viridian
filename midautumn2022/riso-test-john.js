function RisoTestJohn() {
    this.setup = () => {
        // first draw stuff into a buffer
        this.buf = createGraphics(200, 200);
        this.buf.fill('rgba(0, 0, 0, 0)')
        this.buf.fill(240);
        this.buf.circle(50, 50, 50);
        this.buf.fill(80);
        this.buf.circle(150, 150, 50);
        this.buf.fill(160);
        this.buf.circle(100, 100, 80);

        // then dither it
        threshold = 128;
        this.dithered = ditherImage(this.buf, 'atkinson', threshold);

        // then make a Riso layer that uses this dithered image as its base
        this.riso = new Riso('blue')
        this.riso.noStroke();
        this.riso.image(this.dithered, 0, 0)

        // in theory, we can extract the CMYK/RGB layers from the buf, and then make individual dithered bufs there, and then print them to separate riso layers

    }
    this.enter = () => {
        this.setup();
    }

    this.draw = () => {
        background(240);
        image(this.riso, 0, 0);
    }
}
