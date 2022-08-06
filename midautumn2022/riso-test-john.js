function RisoTestJohn() {
    this.setup = () => {
        pixelDensity(1);
        // first draw stuff into a buffer
        this.buf = createGraphics(200, 200);
        this.buf.noStroke()
        this.buf.fill('rgba(0, 0, 0, 0)')
        this.buf.fill(200, 120, 120);
        this.buf.circle(50, 50, 50);
        this.buf.fill(120, 240, 120);
        this.buf.circle(150, 150, 50);
        this.buf.fill(120, 120, 240);
        this.buf.circle(100, 100, 80);

        // then dither it
        threshold = 128;
        justReds = extractRGBChannel(this.buf, 'r')
        this.ditheredRed = ditherImage(justReds, 'atkinson', threshold);
        // then make a Riso layer that uses this dithered image as its base
        this.red = new Riso('red')
        this.red.noStroke();
        this.red.image(this.ditheredRed, 0, 0);

        justGreens = extractRGBChannel(this.buf, 'g')
        ditheredGreen = ditherImage(justGreens, 'atkinson', threshold);
        // then make a Riso layer that uses this dithered image as its base
        this.green = new Riso('green')
        this.green.noStroke();
        this.green.image(ditheredGreen, 0, 0);

        justBlues = extractRGBChannel(this.buf, 'b')
        ditheredBlue = ditherImage(justBlues, 'atkinson', threshold);
        // then make a Riso layer that uses this dithered image as its base
        this.blue = new Riso('blue')
        this.blue.noStroke();
        this.blue.image(ditheredBlue, 0, 0);

        // in theory, we can extract the CMYK/RGB layers from the buf, and then make individual dithered bufs there, and then print them to separate riso layers

    }
    this.enter = () => {
    }

    this.draw = () => {
        background(240);
        //image(this.ditheredRed, 0, 0)
        image(this.red, 0, 0);
        image(this.green, -200, -200);
        image(this.blue, -200, 0)
    }
}
