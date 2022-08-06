function MaskTest() {
    let myImage;
    this.setup = () => {
        this.mask = createGraphics(128, 128);
        this.mask.noStroke();
        this.mask.fill('rgba(0, 0, 0, 1)');

        myImage = loadImage('paper.jpg');
        createCanvas(400, 400);
    }

    this.enter = () => {
    }

    this.draw = () => {
        background(128);
        this.phaseMask(this.mask, frameCount % 300 / 300 * TAU);
        fill(51);
        circle(200, 200, 126);
        this.mask.push();
        // because we have to keep redrawing to the mask, we need to only use
        // this source-in composite operation when we're actually applying the
        // reverse mask
        this.mask.drawingContext.globalCompositeOperation = 'source-in';

        // because we keep editing the mask and re-applying, and Image.mask()
        // is cumulative, we have to use a reverse mask.
        this.mask.image(myImage, 0, 0);
        this.mask.pop();

        image(this.mask, 136, 136, 128, 128);
    }

    this.phaseMask = (ctx, a, color) => {
        const r = 64;
        const phase = a / (PI / 2) | 0;
        if (color === undefined) {
            color == 'rgba(0, 0, 0, 1)'
        }
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
}
