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
        this.fontLoaded = false;
        this.cnFont = loadFont("images/仓迹高德国妙黑.ttf", () => this.fontLoaded = true);
    }

    this.enter = () => {
        this.blue = color(60, 60, 200);
        this.white = color(250, 250, 240);
        this.red = color(200, 60, 60);
        this.black = color(30, 30, 30);
        this.overlay = createGraphics(width, height);
        this.reelLayers = [];
        this.reelOverlays = [];
        this.leftReel = createGraphics(width, height);
        this.rightReel = createGraphics(width, height);
    }

    this.overlayCallback = () => {
        this.overlay.tint(255, 20);
        this.overlay.image(this.paper, 0, 0, width, this.paper.height / this.paper.width * width);
    }

    this.applyTexture = (drawTo, overlay, baseTexture) => {
        overlay.clear();
        overlay.drawingContext.globalCompositeOperation = "source-over";
        overlay.image(baseTexture, 0, 0, overlay.width, overlay.height);
        overlay.drawingContext.globalCompositeOperation = "destination-in";
        overlay.image(drawTo, 0, 0, overlay.width, overlay.height);
        drawTo.push();
        drawTo.image(overlay, 0, 0, drawTo.width, drawTo.height);
        drawTo.pop();
    }

    this.border = (borderRatio, x, t) => {
        push();
        fill(this.blue);
        const borderWidth = width * borderRatio;
        const nStripes = 10;
        const stripesWidth = borderWidth * 5;
        const stripeWidth = stripesWidth / nStripes;

        push();
        rect(x, 0, borderWidth, height);
        translate(x + borderWidth - stripeWidth, 0);
        for (let i = 0; i < nStripes; i++) {
            stripeX = i * stripeWidth + (0.5 * t * stripeWidth % stripeWidth);
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

    this.diamond = (ctx, u) => {
        ctx.push();
        ctx.fill(this.white);
        ctx.stroke(this.black);
        ctx.strokeWeight(u * 0.12);
        ctx.strokeCap(ROUND);
        const quadpoints = [
            -8, 0,
            0, -4,
            8, 0,
            0, 4
        ];
        ctx.quad(...quadpoints.map(x => x * u));
        ctx.drawingContext.globalCompositeOperation = "source-atop";
        const lines = [
            2, 2.67, 3.33,
        ].flatMap(y => [-y, y])
            .map(y => [-8, y, 8, y]);

        lines.forEach(coords => ctx.line(...coords.map(x => x * u)));
        ctx.drawingContext.globalCompositeOperation = "source-over";
        ctx.pop()
    }

    this.reel = (ctx, x, xSize, t) => {
        push();
        ctx.noStroke();
        ctx.clear();
        const u = xSize * 0.1;
        const cellHeight = height * 1.2;
        const connectorSize = cellHeight / 2;

        const palletter = (ctx, _i) => {
            this.pallette(ctx, 0, 0, 10 * u, 6 * u);
        }

        const viridian = (ctx, _i) => {
            this.diamond(ctx, u);
            this.viridian(ctx, u);
        }

        const textDiamond = ctx => {
            this.diamond(ctx, u * 0.6);
            const greeting = "新年快乐";
            const textSize = 1.5 * u;
            if (this.fontLoaded) {
                ctx.textSize(textSize);
                ctx.textFont(this.cnFont);
                const bbox = this.cnFont.textBounds(greeting, 0, 0, textSize);
                ctx.fill(128);
                ctx.fill(this.black);
                ctx.text(greeting, -0.51 * bbox.w, 0.42 * bbox.h);
                ctx.fill(this.red);
                ctx.circle(0, 0, 5);
            }
        }

        const debugIcon = (ctx, i) => {
            ctx.fill(0);
            for (let j = 0; j <= i; j++) {
                ctx.circle(j * u, 0, u);
            }
        };

        // nullIcon wants the topX to be the same as the *next* topX
        const nullIcon = (ctx, i) => { };

        const items = [
            {
                topX: -3 * u,
                iconMaker: textDiamond,
            },
            {
                topX: 3 * u,
                iconMaker: nullIcon,
            },
            {
                topX: 3 * u,
                iconMaker: textDiamond,
            },
        ];

        const steps = items.map((_value, i, arr) => (i * 2 + 1) / (arr.length * 2));
        const stepT = utils.smoothsteps(steps, 0.1, t);
        const baseY = height / 2 - stepT * (items.length) * cellHeight;

        // need to render the first element at the bottom of the reel, too, to maintain the looping illusion
        const numIcons = items.length + 1;
        if (this.reelLayers.length !== numIcons) {
            console.log("initializing reel layers")
            this.reelLayers = Array(numIcons).fill().map(() => createGraphics(width, height)).map(ctx => ctx.noStroke());
            this.reelOverlays = Array(numIcons).fill().map(() => createGraphics(width, height));
        }

        for (let i = 0; i < numIcons; i++) {
            let { topX, iconMaker } = items[i % items.length];
            let nextIndex = (i + 1) % items.length;
            let botX = items[nextIndex].topX;
            let y = baseY + i * cellHeight;
            let iconCtx = this.reelLayers[i];
            this.redStripes(ctx, x + topX, y, 0.1 * u, -connectorSize, 8);
            this.redStripes(ctx, x + botX, y, 0.1 * u, connectorSize, 8);

            iconCtx.push();
            iconCtx.clear();
            iconCtx.translate(iconCtx.width / 2, iconCtx.height / 2);
            iconMaker(iconCtx, i);
            iconCtx.pop();


            this.applyTexture(iconCtx, this.reelOverlays[i], this.overlay);
            //utils.glow('rgba(0, 0, 0, 0.5)', 5, 5, 5, ctx);
            ctx.image(iconCtx, x - iconCtx.width / 2, y - iconCtx.height / 2, ctx.width, ctx.height);
            //utils.noGlow(ctx);
        }

        pop();
    }

    this.draw = () => {
        clear();
        background(this.white);
        noStroke();

        const total = 900;
        const t = (frameCount % total) / total;


        const borderSize = 0.02;
        this.border(borderSize, 0, 20 * t);
        this.border(-borderSize, width, 20 * t);
        this.reel(this.leftReel, 10 * g, 9 * g, t);


        this.reel(this.rightReel, 22 * g, 9 * g, t);

        image(this.overlay, 0, 0, width, height);
        image(this.leftReel, 0, 0, width, height);
        image(this.rightReel, 0, 0, width, height);
    }
}