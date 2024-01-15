function Gradient() {
    const Y_AXIS = 1;
    const X_AXIS = 2;
    var n = 3;
    const U = width / 32;

    this.setup = () => {
        // this.do_draw()
        this.shader = PRELOADS.gradient.chromaticShader;
        this.dusse = PRELOADS.gradient.dusseCross;
        this.dusseInterval = 3 * U;
        const desiredHeight = 4 * U;
        const scaleFactor = desiredHeight / this.dusse.height;
        this.texture = createGraphics(width * 1.5, desiredHeight * 2);
        for (let i = 0; i < 14; i++) {
            this.texture.push()
            this.texture.translate(i * this.dusseInterval, U);
            this.texture.scale(scaleFactor);
            this.texture.image(this.dusse, 0, 0);
            this.texture.pop()
        }
        this.gl = createGraphics(this.texture.width, this.texture.height, WEBGL);
        this.gl.shader(this.shader);
    }

    this.draw = () => this.do_draw()

    this.do_draw = () => {
        // split out from .draw() so we can inspect a static version
        // todo: pass in framecount here?
        background(100, 0, 0);
        var size = height / (n * 3.35);
        const loopPeriod = 100;
        var loopCounter = (frameCount / loopPeriod) | 0;

        const mainPhase = frameCount * 0.005;
        const rankPhase = rank => sin((rank + loopCounter) / n) * 0.5;

        // a box that sits behind the rank N box
        // this box never moves, but has the phase of rank N+1
        const maxRank = n + 2;
        box(maxRank, 0, mainPhase + rankPhase(n + 1), size, false);
        // moving boxes
        // count down from highest rank because it's the farthest away
        for (let rank = maxRank; rank >= 0; rank--) {
            const animOffset = size * fract(frameCount / loopPeriod);
            box(rank, animOffset, rankPhase(rank) + mainPhase, size, false);
        }

        // a box that sits behind the rank N box
        // this box never moves, but has the phase of rank N+1
        box(n, 0, mainPhase + rankPhase(n + 1), size, true, width / 2);
        // moving boxes
        // count down from highest rank because it's the farthest away
        for (let rank = maxRank; rank >= 0; rank--) {
            const animOffset = size * fract(frameCount / loopPeriod);
            box(rank, animOffset, rankPhase(rank) + mainPhase, size, true, width / 2);
        }

        push();
        blendMode(SCREEN);
        this.shader.setUniform("uTexture", this.texture);

        const mx = 0.03 * (noise(frameCount * 0.03) - 0.5);
        const my = 0.1 * (noise((frameCount + 5) * 0.03) - 0.5);
        this.shader.setUniform("uOffset", [mx, my]);
        this.gl.rect(0, 0, U, U);
        // image(this.gl, 3 * (i - 1) * U + (frameCount * 0.02 % 3 * U), 1 * U);
        image(this.gl, (fract(frameCount / 120) - 1) * this.dusseInterval, 1.5 * U);
        pop();
        // outer box that never moves
        // TODO: there might be some clever way to make this phase match up better with the inner boxes
        //box(0, 0, mainPhase, size);

    }

    function box(rank, animOffset, phase, size, invertX, xOffset = 0) {
        // rank: the higher the rank, the further "in" the animation it is
        // animOffset: how much this box has expanded from its initial pos
        // phase: gradient phase
        // size: width of each bar

        phase *= 0.5;

        // TODO: pass in a p5js.point for the base location
        if (invertX) {
            setGradient(
                -phase,
                xOffset, rank * size - animOffset, // XY
                width / 2, size, // dimensions
                X_AXIS,
                true
            );
        }
        else {
            setGradient(
                phase,
                xOffset, rank * size - animOffset, // XY
                width / 2, size, // dimensions
                X_AXIS,
                false
            );
        }

        setGradient(
            phase,
            xOffset + rank * size - animOffset, 0,
            size, height,
            Y_AXIS,
            false
        );

        if (invertX) {
            setGradient(
                -phase,
                xOffset, height - ((rank + 1) * size) + animOffset,
                width / 2, size,
                X_AXIS,
                true
            );
        }
        else {
            setGradient(
                phase,
                xOffset, height - ((rank + 1) * size) + animOffset,
                width / 2, size,
                X_AXIS,
                false
            );
        }

        setGradient(
            phase,
            xOffset + width / 2 - ((rank + 1) * size) + animOffset,
            0,
            size,
            height,
            Y_AXIS,
            false
        );
    }

    function cosineGradient(dcOffset, amp, freq, phase) {
        return (t) => {
            return 255 * (amp * cos(TAU * (freq * t + phase)) + dcOffset)
        }
    }

    function gradientColor(t, r, g, b) {
        return color(r(t), g(t), b(t));
    }


    function setGradient(offset, x, y, w, h, axis, flip) {
        // TODO: pass in a position & a dimension instead of 4 numbers
        push();
        noStroke();

        let gradientRed = cosineGradient(1.178, 0.388, 1.000, 2.138)
        let gradientGreen = cosineGradient(0.098, -0.352, 1.000, 2.738)
        let gradientBlue = cosineGradient(0.098, 0.248, 1.000, 0.368)

        let flipRed = cosineGradient(1.178, 0.388, 1.000, -2.138)
        let flipGreen = cosineGradient(0.098, -0.352, 1.000, -2.738)
        let flipBlue = cosineGradient(0.098, 0.248, 1.000, -0.368)

        if (flip) {
            gradientRed = flipRed;
            gradientGreen = flipGreen;
            gradientBlue = flipBlue;
        }

        //const gradientRed = cosineGradient(1.178, 0.388, 1.000, 2.138)
        //const gradientGreen = cosineGradient(0.5, -0.352, 1.000, 2.738)
        //const gradientBlue = cosineGradient(0.5, 0.248, 1.000, 0.368)
        if (axis === Y_AXIS) {
            // Top to bottom gradient
            for (let i = y; i <= y + h; i++) {
                let inter = map(i, y, y + h, 0, 1) + offset;
                let c = gradientColor(inter, gradientRed, gradientGreen, gradientBlue);
                fill(c);
                rect(x, i, w + 1, 1);
            }
        } else if (axis === X_AXIS) {
            // Left to right gradient
            for (let i = x; i <= x + w; i++) {
                let inter = map(i, x, x + w, 0, 1) + offset * 2;
                let c = gradientColor(inter, gradientRed, gradientGreen, gradientBlue);
                fill(c);
                rect(i, y, 1, h + 1)
            }
        }
        pop();
    }
}
