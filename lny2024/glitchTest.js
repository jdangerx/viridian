function GlitchTest() {
    const U = width / 32; // UNIT distance
    this.setup = () => {
        crossImg = PRELOADS.glitchTest.dusseCross;
        this.crossCtx = createGraphics(crossImg.width, crossImg.height);
        this.crossCtx.push();
        this.crossCtx.image(crossImg, 0, 0);
        this.crossCtx.pop();

    }

    this.cross = (imageWidth, posVec) => {
        push();
        scaleFactor = imageWidth / this.crossCtx.width;
        translate(posVec);
        scale(scaleFactor);
        image(this.crossCtx, 0, 0);
        pop();
    }

    this.draw = () => {
        background(0, 0, 0);
        this.cross(6 * U, createVector(0, 0));
    }
}
