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
        this.reelLayers = [];
        this.reelOverlays = [];
        this.reelLayer = createGraphics(width, height);
        this.reelOverlay = createGraphics(width, height);
    }

    this.overlayCallback = () => {
        this.overlay.tint(255, 30);
        this.overlay.image(this.paper, 0, 0, width, this.paper.height / this.paper.width * width);
        this.reelOverlay.image(this.overlay, 0, 0, width, height);
    }


    this.applyTexture = (drawTo, overlay, baseTexture) => {
        overlay.clear();
        overlay.drawingContext.globalCompositeOperation = "source-over";
        overlay.image(baseTexture, 0, 0, overlay.width, overlay.height);
        overlay.drawingContext.globalCompositeOperation = "destination-in";
        overlay.image(drawTo, 0, 0, overlay.width, overlay.height);
        drawTo.push();
        drawTo.blendMode(HARD_LIGHT);
        drawTo.image(overlay, 0, 0, drawTo.width, drawTo.height);
        drawTo.blendMode(BLEND);
        drawTo.pop();
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

    this.pallette = (ctx, x, y, w, h) => {
        ctx.push();
        ctx.translate(x, y);
        ctx.fill(this.red);
        ctx.rect(-0.50 * w, -0.37 * h, w, h, h * 0.3);
        ctx.fill(this.black);
        ctx.ellipse(-0.10 * w, 0, w, h);
        ctx.fill(this.white);
        ctx.circle(0.21 * w, -0.2 * h, 0.2 * h);
        ctx.fill(this.red);
        ctx.circle(0.26 * w, 0.1 * h, 0.18 * h);
        const rw = 0.2 * width;
        const rh = rw * this.rabbit.height / this.rabbit.width;
        ctx.image(this.rabbit, -0.71 * rw, -0.65 * rh, rw, rh);
        ctx.pop();
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

    this.redStripes = (ctx, x, y, stripeWidth, ySize, nStripes) => {
        ctx.push();
        for (let i = 0; i < nStripes; i++) {
            ctx.fill(this.red);
            ctx.rect(x - (nStripes - 0.5) * stripeWidth + 2 * i * stripeWidth, y, stripeWidth, ySize);
            ctx.fill(this.white);
            ctx.rect(x - (nStripes - 0.5) * stripeWidth + (2 * i + 1) * stripeWidth, y, stripeWidth, ySize);
        }
        ctx.pop()
    }

    this.viridian = (ctx, u) => {
        ctx.push();
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
            ctx.fill('rgba(0, 0, 0, 0)');
            ctx.stroke(0);
            const s = u * 0.4;
            ctx.strokeWeight(s * 0.2);
            ctx.push();
            ctx.translate(-11 * s, -3 * s);
            if (type === "l") {
                let [x1, y1, x2, y2] = coords
                ctx.line(x1 * s, y1 * s, x2 * s, y2 * s);
            } else if (type === "a") {
                let [x, y, w, h, th0, th1] = coords
                ctx.arc(x * s, y * s, w * s, h * s, th0, th1, OPEN);
            }
            ctx.pop();
        });

        ctx.pop();
    }

    this.reel = (ctx, x, xSize, t) => {
        push();
        ctx.noStroke();
        ctx.clear();
        const u = xSize * 0.1;
        const cellHeight = height * 1.2;
        const connectorSize = cellHeight / 2;

        const palletter = (ctx, y, _i) => {
            ctx.push();
            ctx.clear();
            this.pallette(ctx, x, y, 10 * u, 6 * u);
            ctx.pop();
        }

        const viridian = (ctx, y, _i) => {
            ctx.push();
            ctx.clear();
            ctx.translate(x, y);
            this.viridian(ctx, u);
            ctx.pop();
        }

        const debugIcon = (ctx, y, i) => {
            ctx.push();
            ctx.clear();
            ctx.fill(0);
            for (let j = 0; j <= i; j++) {
                ctx.circle(x + j * u, y, u);
            }
            ctx.pop();
        };

        const items = [
            {
                topX: 3 * u,
                iconMaker: palletter,
            },
            {
                topX: -3 * u,
                iconMaker: viridian,
            },
        ];

        const steps = items.map((_value, i, arr) => (i * 2 + 1) / (arr.length * 2));
        const stepT = utils.smoothsteps(steps, 0.1, t);
        const baseY = height / 2 - stepT * (items.length) * cellHeight;

        // need to render the first element at the bottom of the reel, too, to maintain the looping illusion
        const numIcons = items.length + 1;
        if (this.reelLayers.length !== numIcons * 3) {
            console.log("initializing reel layers")
            this.reelLayers = Array(numIcons).fill().map(() => createGraphics(width, height)).map(ctx => ctx.noStroke());
            this.reelOverlays = Array(numIcons).fill().map(() => createGraphics(width, height));
        }

        for (let i = 0; i < numIcons; i++) {
            let { topX, iconMaker } = items[i % items.length];
            let nextIndex = (i + 1) % items.length;
            let botX = items[nextIndex].topX;
            let y = baseY + i * cellHeight;
            this.redStripes(ctx, x + topX, y, 0.1 * u, -connectorSize, 8);
            this.redStripes(ctx, x + botX, y, 0.1 * u, connectorSize, 8);
            iconMaker(this.reelLayers[i], y, i);
        }

        this.reelLayers.forEach((drawTo, i) => {
            this.applyTexture(drawTo, this.reelOverlays[i], this.overlay);
            ctx.image(drawTo, 0, 0, ctx.width, ctx.height);
        });
        pop();
    }

    this.draw = () => {
        clear();
        background(this.white);
        noStroke();

        const total = 300;
        const t = (frameCount % total) / total;



        const borderSize = 0.06;
        this.border(borderSize, 0, 20 * t);
        this.border(-borderSize, width, 20 * t);

        this.reel(this.reelLayer, 10 * g, 9 * g, t);
        this.applyTexture(this.reelLayer, this.reelOverlay, this.overlay);
        image(this.reelLayer, 0, 0, width, height);
    }
}