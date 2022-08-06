function RisoTestJohn() {
    this.setup = () => {
        pixelDensity(1);
        // first draw stuff into a buffer
        background(255);
        this.buf = createGraphics(200, 200);
        this.buf.noStroke()
        this.buf.fill('rgba(255, 255, 255, 1)')
        this.buf.fill(200, 120, 120);
        this.buf.circle(50, 50, 50);
        this.buf.fill(120, 240, 120);
        this.buf.circle(150, 150, 50);
        this.buf.fill(120, 120, 240);
        this.buf.circle(100, 100, 80);

        let fill = 160;
        cyan = new Riso([0, 255, 255], 200, 200);
        cyan.fill(fill);
        cyan.image(extractCMYKChannel(this.buf, 'c'), 0, 0);

        this.cyan = cyan;

        magenta = new Riso([255, 0, 255], 200, 200);
        magenta.fill(fill);
        magenta.image(extractCMYKChannel(this.buf, 'm'), 3, 0);

        yellow = new Riso([255, 255, 0], 200, 200);
        yellow.fill(fill);
        yellow.image(extractCMYKChannel(this.buf, 'y'), 0, 3);

        black = new Riso([0, 0, 0], 200, 200);
        black.fill(fill);
        this.img = extractCMYKChannel(this.buf, 'k');
        black.image(extractCMYKChannel(this.buf, 'k'), 3, 3);



    }
    this.enter = () => {
        this.setup();
    }

    this.draw = () => {
        background(200);
        translate(200, 200);
        drawRiso();
        image(this.buf, 0, -200);
        image(this.img, -200, -200);
        image(this.cyan, -200, 0);
        // image(this.blue, 0, -200);
    }
}
