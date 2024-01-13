function Gradient() {
    const Y_AXIS = 1;
    const X_AXIS = 2;
    var n = 4;

    this.setup = () => {
        noStroke();
    }

    function cosineGradient(dcOffset, amp, freq, phase) {
        return (t) => {
            return 255 * (amp * cos(TAU * (freq * t + phase)) + dcOffset)
        }
    }

    function palette(t, r, g, b) {
        return color(r(t), g(t), b(t));
    }

    this.draw = () => {
        background(0);
        var max_i = 0;
        /*
        for (var i = 0; i < n / 2; i += 1) {
            var size = width / n;
            var offset = (1 + sin(i / n)) * 0.5 + frameCount * 0.005;
            offset *= 2;
            setGradient(offset, i * size, 0, size, height * 3, Y_AXIS);
            max_i = i;
        }

        for (var i = max_i; i < n; i += 1) {
            var size = width / n;
            var offset = (1 + sin((n - i - 1) / n)) * 0.5 + frameCount * 0.005;
            offset *= 2;
            setGradient(offset, i * size, 0, size, height * 3, Y_AXIS);
        }*/

        var size = height / (n * 3);
        var offset = (1 + sin(1)) * 0.5 + frameCount * 0.005;

        setGradient(offset, (n - 1) * size, 0, size, height * 3, Y_AXIS);
        setGradient(offset, 0, (n - 1) * size, width / 2, size, X_AXIS);
        setGradient(offset, width / 2 - ((n) * size), 0, size, height * 3, Y_AXIS);
        setGradient(offset, 0, height - ((n) * size), width / 2, size, X_AXIS);

        var extraOffset = 0;

        for (var i = n + 2; i >= 0; --i) {
            var offset = (1 + sin((i + extraOffset) / n)) * 0.5 + frameCount * 0.0;
            //offset *= 0.5;

            var animOffset = size * fract(frameCount * 0.01);

            var x = i;
            if (i == n + 2) {
                x = 0;
                animOffset = 0;
            }

            if (i > n) {
                x = n;
            }

            setGradient(offset, 0, x * size - animOffset, width / 2, size, X_AXIS);
            setGradient(offset, x * size - animOffset, 0, size, height, Y_AXIS);
            setGradient(offset, 0, height - ((x + 1) * size) + animOffset, width / 2, size, X_AXIS);
            setGradient(offset, width / 2 - ((x + 1) * size) + animOffset, 0, size, height, Y_AXIS);
        }
    }

    function setGradient(offset, x, y, w, h, axis) {
        push();
        noStroke();
        const gradientRed = cosineGradient(1.178, 0.388, 1.000, 2.138)
        const gradientGreen = cosineGradient(0.5, -0.352, 1.000, 2.738)
        const gradientBlue = cosineGradient(0.5, 0.248, 1.000, 0.368)
        if (axis === Y_AXIS) {
            // Top to bottom gradient
            for (let i = y; i <= y + h; i++) {
                let inter = map(i, y, y + h, 0, 1) + offset;
                let c = palette(inter, gradientRed, gradientGreen, gradientBlue);
                fill(c);
                rect(x, i, w + 1, 1);
            }
        } else if (axis === X_AXIS) {
            // Left to right gradient
            for (let i = x; i <= x + w; i++) {
                let inter = map(i, x, x + w, 0, 1) + offset * 2;
                let c = palette(inter, gradientRed, gradientGreen, gradientBlue);
                fill(c);
                rect(i, y, 1, h + 1)
            }
        }
        pop();
    }
}
