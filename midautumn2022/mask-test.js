function MaskTest() {
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

    this.drawMoon = function (x, y, a, light_color, dark_color) {
        noStroke();

        let color1 = color(0, 25, 25, 0); //red
        let color2 = color(0, 25, 25, 0); //gray
        let color3 = color(0, 25, 25, 0); //blue
        let color4 = color(0, 25, 25, 0); //green

        if (-Math.PI / 2 < a && a < 0) {
            color3 = light_color;
            color4 = light_color;
            color1 = light_color;
            color2 = dark_color;
        } else if (-Math.PI < a && a < -Math.PI / 2) {
            color1 = light_color;
            color3 = dark_color;
            color4 = dark_color;
            color2 = dark_color;
        } else if (-3 * Math.PI / 2 < a && a < -Math.PI) {
            color4 = dark_color;
            color2 = light_color;
            color1 = dark_color;
            color3 = dark_color;
        } else if (-2 * Math.PI < a && a < -3 * Math.PI / 2) {
            color4 = light_color;
            color3 = light_color;
            color1 = dark_color;
            color2 = light_color;
        } else {
            color3 = light_color;
            color4 = light_color;
            color1 = light_color;
            color2 = dark_color;
        }

        fill(color1);
        arc(x, y, d, d, PI / 2, 3 * PI / 2);
        fill(color2);
        arc(x, y, d + 1, d + 1, 3 * PI / 2, PI / 2);

        let heightPhase = d;
        let widthPhase = map(Math.cos(a), 0, 1, 0, d);

        fill(color3);
        arc(x, y, widthPhase - 2, d + 1, PI / 2, 3 * PI / 2);
        fill(color4);
        arc(x, y, widthPhase - 2, d + 1, 3 * PI / 2, PI / 2)
    }
}
