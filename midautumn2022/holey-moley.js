function HoleyMoley() {
    this.setup = () => {
        this.bgImage = loadImage("images/paper.jpg");
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
        this.overlay.background(240);
        this.dropShadow.background(80);
        const x = frameCount % width;
        const y = 2 * frameCount % height;
        const radius = 2 * grid;
        this.cutout(this.dropShadow, x + grid * 0.1, y + grid * 0.1, radius);
        this.dropShadow.fill('rgba(0, 0, 0, 0)');
        this.dropShadow.stroke(80);
        this.dropShadow.strokeWeight(grid * 0.05);
        this.dropShadow.circle(x, y, 2 * radius);
        this.cutout(this.overlay, x, y, radius);
        image(this.dropShadow, 0, 0, width, height);
        image(this.overlay, 0, 0, width, height);
    }
}
