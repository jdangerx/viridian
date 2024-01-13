function Gradient() {
    const Y_AXIS = 1;
    const X_AXIS = 2;
    var n = 4;

    this.setup = () => {
        // this.do_draw()
    }

    this.draw = () => this.do_draw()

    this.do_draw = () => {
        // split out from .draw() so we can inspect a static version
        // todo: pass in framecount here?
        background(0);
        var size = height / (n * 3);
        const loopPeriod = 100;
        var loopCounter = (frameCount / loopPeriod) | 0;

        const mainPhase = frameCount * 0.005;
        const rankPhase = rank => sin((rank + loopCounter) / n) * 0.5;

        // a box that sits behind the rank N box
        // this box never moves, but has the phase of rank N+1
        box(n, 0, mainPhase + rankPhase(n + 1), size);
        // moving boxes
        // count down from highest rank because it's the farthest away
        for (let rank = n; rank > 0; rank--) {
            const animOffset = size * fract(frameCount / loopPeriod);
            box(rank, animOffset, rankPhase(rank) + mainPhase, size);
        }

        // outer box that never moves
        // TODO: there might be some clever way to make this phase match up better with the inner boxes
        box(0, 0, mainPhase, size);

    }

    function box(rank, animOffset, phase, size) {
        // rank: the higher the rank, the further "in" the animation it is
        // animOffset: how much this box has expanded from its initial pos
        // phase: gradient phase
        // size: width of each bar

        // TODO: pass in a p5js.point for the base location
        setGradient(
            phase,
            0, rank * size - animOffset, // XY
            width / 2, size, // dimensions
            X_AXIS
        );
        setGradient(
            phase,
            rank * size - animOffset, 0,
            size, height,
            Y_AXIS
        );
        setGradient(
            phase,
            0, height - ((rank + 1) * size) + animOffset,
            width / 2, size,
            X_AXIS
        );
        setGradient(
            phase,
            width / 2 - ((rank + 1) * size) + animOffset,
            0,
            size,
            height,
            Y_AXIS
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


    function setGradient(offset, x, y, w, h, axis) {
        // TODO: pass in a position & a dimension instead of 4 numbers
        push();
        noStroke();
        const gradientRed = cosineGradient(1.178, 0.388, 1.000, 2.138)
        const gradientGreen = cosineGradient(0.5, -0.352, 1.000, 2.738)
        const gradientBlue = cosineGradient(0.5, 0.248, 1.000, 0.368)
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
