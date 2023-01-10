function WhiteRabbit() {
    const g = width / 32;
    this.setup = () => {
        this.borderRabbits = {
            right: loadImage("images/border-rabbit-right.png"),
            left: loadImage("images/border-rabbit-left.png"),
            rightInvert: loadImage("images/border-rabbit-right-invert.png"),
            leftInvert: loadImage("images/border-rabbit-left-invert.png"),
        };
        this.rabbit = loadImage("images/big-white-rabbit.png");
        this.paper = loadImage("images/crumpled-paper-texture.jpeg", () => this.overlayCallback());
    }

    this.enter = () => {
        this.blue = color(60, 60, 200);
        this.white = color(250, 250, 240);
        this.red = color(200, 60, 60);
        this.black = color(30, 30, 30);
        this.overlay = createGraphics(width, height);
    }

    this.overlayCallback = () => {
        this.overlay.tint(255, 30);
        this.overlay.image(this.paper, 0, 0, width, this.paper.height / this.paper.width * width);
    }

    this.border = (borderRatio, x, t) => {
        push();
        fill(this.blue);
        const borderWidth = width * borderRatio;
        const nStripes = 8;
        const stripesWidth = borderWidth * 0.8;
        const stripeWidth = stripesWidth / nStripes;

        push();
        rect(x, 0, borderWidth, height);
        translate(x + borderWidth - stripeWidth, 0);
        for (let i = 0; i < nStripes; i++) {
            stripeX = i * stripeWidth + (t * stripeWidth % stripeWidth);
            let stripeValue = 0.8 * cos(PI / 2 * stripeX / stripesWidth);
            fill(this.blue);
            rect(stripeX, 0, stripeWidth * stripeValue, height);
        }
        pop();

        pop();
    }

    this.pallette = (x, y, w, h) => {
        push();
        translate(x, y);
        fill(this.red);
        rect(-0.50 * w, -0.37 * h, w, h, h * 0.3);
        fill(this.black);
        ellipse(-0.10 * w, 0, w, h);
        fill(this.white);
        circle(0.21 * w, -0.2 * h, 0.2 * h);
        fill(this.red);
        circle(0.26 * w, 0.1 * h, 0.18 * h);
        const rw = 0.2 * width;
        const rh = rw * this.rabbit.height / this.rabbit.width;
        image(this.rabbit, -0.71 * rw, -0.65 * rh, rw, rh);
        pop();
    }

    this.blueStripes = (x, y, width, height, nStripes, offset) => {
        push();
        rowHeight = height / nStripes;
        translate(x, y - rowHeight);
        for (let i = 0; i < nStripes; i++) {
            stripeY = i * rowHeight + (offset * rowHeight % rowHeight);
            let stripeValue = 0.8 * cos(PI / 2 * stripeY / height);
            fill(this.blue);
            rect(0, stripeY, width, rowHeight * stripeValue);
        }
        pop();
    }

    this.redStripes = (x, y, stripeWidth, ySize, nStripes) => {
        push();
        fill(this.white);
        rect(x - (nStripes + 0.5) * stripeWidth, y, stripeWidth, height);
        for (let i = 0; i < nStripes; i++) {
            fill(this.red);
            rect(x - (nStripes - 0.5) * stripeWidth + 2 * i * stripeWidth, y, stripeWidth, ySize);
            fill(this.white);
            rect(x - (nStripes - 0.5) * stripeWidth + (2 * i + 1) * stripeWidth, y, stripeWidth, ySize);
        }
        pop()
    }


    this.reel = (x, xSize, t) => {
        push();
        const u = xSize * 0.1;
        const cellHeight = height * 1.2;
        const connectorSize = cellHeight / 2;

        const palletter = (y, _i) => {
            this.pallette(x, y, 10 * u, 6 * u);
        }

        const debugIcon = (y, i) => {
            push();
            fill(0);
            for (let j = 0; j <= i; j++) {
                circle(x + j * u, y, u);
            }
            pop();
        };

        const viridian = (y, _i) => {
            push();
            translate(x, y);
            // TODO: probably we want each letter to be its own coordinate system
            // and then we have offsets between each one - easier to think about.

            /**
             * letters = [
             * { strokes: [["l", [0, 0, 2, 6]], ["l", [2, 6, 4 0]]],
                 * marginLeft: 0,
                 * marginTop: 0 // with default margins
             * },
             * ]
             * Then a conversion to raw coordinates to draw + center
             *
             */

            const strokes = [
                // V
                ["l", [0, 0, 2, 6]],
                ["l", [2, 6, 4, 0]],
                // i
                ["l", [5, 2, 5, 6]],
                // r
                ["l", [7, 2, 7, 6]],
                ["a", [7, 3.30, 3, 2.6, -TAU / 4, TAU / 4]],
                ["l", [7, 3.3, 8.5, 6]],
                // i
                ["l", [10.25, 2, 10.25, 6]],
                // d
                ["l", [12, 2, 12, 6]],
                ["a", [12, 4, 3, 4, -TAU / 4, TAU / 4]],
                // i
                ["l", [15, 2, 15, 6]],
                // a
                ["l", [18, 2, 17, 6]],
                ["l", [18, 2, 19, 6]],
                ["l", [18, 6, 17.5, 4]],
                ["l", [18, 6, 18.5, 4]],
                //n
                ["l", [20, 2, 20, 6]],
                ["l", [20, 2, 22, 6]],
                ["l", [22, 2, 22, 6]],
            ];


            strokes.forEach(([type, coords]) => {
                fill('rgba(0, 0, 0, 0)');
                stroke(0);
                const s = u * 0.4;
                strokeWeight(s * 0.2);
                push();
                translate(-11 * s, -3 * s);
                if (type === "l") {
                    let [x1, y1, x2, y2] = coords
                    line(x1 * s, y1 * s, x2 * s, y2 * s);
                } else if (type === "a") {
                    let [x, y, w, h, th0, th1] = coords
                    arc(x * s, y * s, w * s, h * s, th0, th1, OPEN);
                }
                pop();
            });

            pop();
        }

        const items = [
            {
                topX: 3 * u,
                iconMaker: palletter,
            },
            {
                topX: -3 * u,
                iconMaker: viridian,
            },
            {
                topX: 3 * u,
                iconMaker: palletter,
            },
        ]

        const steps = items.map((_value, i, arr) => (i * 2 + 1) / (arr.length * 2));
        const stepT = utils.smoothsteps(steps, 0.1, t);
        const baseY = height / 2 - stepT * (items.length) * cellHeight;

        // need to render the first element at the bottom of the reel, too, to maintain the looping illusion
        for (let i = 0; i <= items.length; i++) {
            let { topX, iconMaker } = items[i % items.length];
            let nextIndex = (i + 1) % items.length;
            let botX = items[nextIndex].topX;
            let y = baseY + i * cellHeight;
            this.redStripes(x + topX, y, 0.1 * u, -connectorSize, 8);
            this.redStripes(x + botX, y, 0.1 * u, connectorSize, 8);
            iconMaker(y, i);
        }
        pop();
    }

    this.draw = () => {
        background(this.white);
        noStroke();

        const total = 800;
        const t = (frameCount % total) / total;


        this.reel(10 * g, 9 * g, t);

        const borderSize = 0.06;
        this.border(borderSize, 0, 20 * t);
        this.border(-borderSize, width, 20 * t);
        blendMode(HARD_LIGHT);
        image(this.overlay, 0, 0, width, height);
    }
}