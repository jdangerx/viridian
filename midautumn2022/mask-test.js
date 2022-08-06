function MaskTest() {
    let myImage;
    this.setup = () => {
        this.mask = createGraphics(128, 128);
        this.mask.noStroke();
        this.mask.fill('rgba(0, 0, 0, 1)');
        this.mask.fill('rgba(0, 0, 0, 1)');

        myImage = loadImage('paper.jpg');
        createCanvas(400, 400);
    }

    this.enter = () => {
    }

    this.draw = () => {
        background(128);
        this.phaseMask(this.mask, frameCount % 300 / 300 * TAU);
        // this.mask.drawingContext.globalCompositeOperation = 'source-in';mask.arc(64, 64, 128, 128, -PI / 2, PI / 2);

        this.mask.push();
        this.mask.drawingContext.globalCompositeOperation = 'source-in';
        this.mask.image(myImage, 0, 0);
        this.mask.pop();

        image(myImage, 136, 136, 128, 128);
        image(this.mask, 136, 8, 128, 128);
    }

    this.phaseMask = (ctx, a) => {
        const r = 64;
        const phase = a / (PI / 2) | 0;
        ctx.push();
        switch (phase) {
            case 0: // waxing crescent
                ctx.clear();
                // light part
                ctx.arc(r, r, 2 * r, 2 * r, - PI / 2, PI / 2);
                // cut out dark part
                ctx.blendMode(REMOVE);
                ctx.fill('rgba(0, 0, 0, 1)');
                ctx.arc(r, r, 2 * r * cos(a), 2 * r, -PI / 2, PI / 2);
                break;
            case 1: // waxing gibbous
                ctx.clear();
                // light east side
                ctx.arc(r, r, 2 * r, 2 * r, - PI / 2, PI / 2);
                // growing west side
                ctx.arc(r, r, 2 * r * cos(a), 2 * r, PI / 2, 3 * PI / 2);
                break;
            case 2: // waning gibbous
                ctx.clear();
                // light west side
                ctx.arc(r, r, 2 * r, 2 * r, PI / 2, 3 * PI / 2);
                // shrinking east side
                ctx.arc(r, r, 2 * r * cos(a), 2 * r, - PI / 2, PI / 2);
                break;
            case 3: // waning crescent
                ctx.clear();
                // light part
                ctx.arc(r, r, 2 * r, 2 * r, PI / 2, 3 * PI / 2);
                // cut out dark part
                ctx.blendMode(REMOVE);
                ctx.fill('rgba(0, 0, 0, 1)');
                ctx.arc(r, r, 2 * r * cos(a), 2 * r, PI / 2, 3 * PI / 2);
                break;
        }
        ctx.pop();
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
