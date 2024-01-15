function GlitchTest() {
    this.setup = () => {
        const crossImg = PRELOADS.glitchTest.dusseCross;
        //crossImg.resize(0, height * 0.8);
        this.tex = createGraphics(width, height);
        this.tex.noStroke();

        // hmm, scale should probably snap to integer scaling
        const scaleFactor = height * 0.4 / (crossImg.height);
        const crossDims = createVector(crossImg.width, crossImg.height).mult(scaleFactor);
        const xInterval = 1.8;
        const yInterval = 0.8;
        const numX = (1 + (width / crossDims.x) / xInterval) | 0;
        const numY = (1 + (height / crossDims.y) / yInterval) | 0;
        for (let i = 0; i < numX; i++) {
            for (let j = 0; j < numY; j++) {
                this.tex.push();
                this.tex.translate(
                    (-0.5 + i + (j % 2) * 0.5) * (xInterval * crossDims.x),
                    (-0.5 + j) * (yInterval * crossDims.y)
                );
                this.tex.scale(scaleFactor);
                this.tex.image(crossImg, 0, 0);
                this.tex.pop();
            }
        }
    }


    this.draw = () => {
        background(0, 0, 0);
        const theShader = PRELOADS.glitchTest.shader;
        shader(theShader);

        const amp = 0.015;
        const loopPeriod = 240;
        const pulse = (
            utils.cubicPulse(0.3, 0.15, fract(frameCount / loopPeriod)) +
            utils.cubicPulse(0.6, 0.1, fract(frameCount / loopPeriod)) * 0.4
        );

        // const mx = (0.8 + 0.2 * sin(frameCount * 0.1)) * amp * pulse * sin(frameCount * 0.5);
        // const my = 0.5 * (sin(frameCount * 0.1)) * amp * pulse * sin(frameCount * 0.3);

        const mx = (-0.5 + Math.sqrt(noise(frameCount * 0.04))) * amp * pulse;
        const my = (-0.5 + Math.sqrt(noise(frameCount * 0.04 + 10))) * amp * pulse;
        theShader.setUniform("uTexture", this.tex);
        theShader.setUniform("uOffset", [mx, my]);
        rect(0, 0, 1, 1);
        // image(this.tex, -width / 2, -height / 2);
    }
}
