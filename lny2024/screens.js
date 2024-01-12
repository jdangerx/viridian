function Screens() {
    const Y_AXIS = 1;
    const X_AXIS = 2;
    var n = 4;

    this.setup = () => {
        noStroke();
    }

    function palette(t, ar, ag, ab, br, bg, bb, cr, cg, cb, dr, dg, db) {
        let r = (ar + br * cos(6.28318 * (cr * t + dr))) * 255;
        let g = (ag + bg * cos(6.28318 * (cg * t + dg))) * 255;
        let b = (ab + bb * cos(6.28318 * (cb * t + db))) * 255;
        return color(r, g, b);
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

        var size = height / (n*3);
        var offset = (1 + sin(1)) * 0.5 + frameCount * 0.005;

        setGradient(offset, (n-1) * size, 0, size, height * 3, Y_AXIS);
        setGradient(offset, 0, (n-1)*size, width/2, size, X_AXIS);
        setGradient(offset, width/2 - ((n) * size), 0, size, height * 3, Y_AXIS);
        setGradient(offset, 0, height-((n)*size), width/2, size, X_AXIS);

        for (var i = n+2; i >= 0; --i)
        {
            var offset = (1 + sin(i / n)) * 0.5 + frameCount * 0.0;
            offset *= 0.5;

            var animOffset = size * fract(frameCount*0.01);

            var x = i;
            if (i == n+2)
            {
                x = 0;
                animOffset = 0;
            }

            if (i > n)
            {
                x = n;
            }

            setGradient(offset, width/2 - ((x+1) * size) + animOffset, 0, size, height, Y_AXIS);
            setGradient(offset, 0, x*size - animOffset, width/2, size, X_AXIS);
            setGradient(offset, x * size - animOffset, 0, size, height, Y_AXIS);
            setGradient(offset, 0, height-((x+1)*size) + animOffset, width/2, size, X_AXIS);
            //setGradient(offset, 0, (n-i) * size, height * 3, size, X_AXIS);

        }
    }

    function setGradient(offset, x, y, w, h, axis) {
        noFill();

        if (axis === Y_AXIS) {
            // Top to bottom gradient
            for (let i = y; i <= y + h; i++) {
                let inter = map(i, y, y + h, 0, 1) + offset;
                let c = palette(inter, 1.178, 0.500, 0.500, 0.388, -0.352, 0.248, 1.000, 1.000, 1.000, 2.138, 2.738, 0.368);
                stroke(c);
                line(x, i, x + w, i);
            }
        } else if (axis === X_AXIS) {
            // Left to right gradient
            for (let i = x; i <= x + w; i++) {
                let inter = map(i, x, x + w, 0, 1) + offset * 2;
                let c = palette(inter, 1.178, 0.500, 0.500, 0.388, -0.352, 0.248, 1.000, 1.000, 1.000, 2.138, 2.738, 0.368);
                //let c = palette(inter, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1.0, 1.0, 1.0, 0.00, 0.10, 0.20);
                stroke(c);
                line(i, y, i, y + h);
            }
        }
    }
}
