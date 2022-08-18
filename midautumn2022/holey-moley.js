function HoleyMoley() {
    this.setup = () => {
        this.bgImage = loadImage("images/paper.jpg");
        this.overlayImage = loadImage("images/parchment.jpg");
        this.overlay = createGraphics(width, height);
        this.dropShadow = createGraphics(width, height);
    }
    this.enter = () => {
        this.setup();
    }

    this.cutout = (ctx, x, y, radius) => {
        ctx.push();
        ctx.blendMode(REMOVE);
        ctx.fill(0);
        ctx.circle(x, y, 2 * radius);
        ctx.pop();
    }

    this.draw = () => {
        image(this.bgImage, 0, 0, width, height);
        this.overlay.image(this.overlayImage, 0, 0, width, height);
        const radius = 2 * grid;
        const xMargin = radius * 1.1;
        const xRange = width - 2 * xMargin;
        const x = width - xMargin - abs(2 * frameCount % xRange - xRange / 2) * 2;
        const yMargin = radius * 1.1;
        const yRange = height - 2 * yMargin;
        const y = yMargin + abs(1.8 * frameCount % yRange - yRange / 2) * 2;
        this.cutout(this.overlay, x, y, radius);
        utils.glow(color(80), radius * 0.3, 0, 0);
        image(this.overlay, 0, 0, width, height);
        utils.noGlow();
    }
}
