function WhiteRabbit() {
    const g = width / 32;
    this.setup = () => {
    }

    this.enter = () => {
        this.blue = color(60, 60, 200);
        this.white = color(250, 250, 240);
        this.red = color(200, 60, 60);
        this.black = color(30, 30, 30);

        this.leftReel = createGraphics(width, height);
        this.rightReel = createGraphics(width, height);

        this.iconLayer = createGraphics(width, height);
        this.iconLayer.noStroke();
        this.iconTextureLayer = createGraphics(width, height);

        console.log(PRELOADS);
        this.rabbit = PRELOADS.whiteRabbit.rabbit;
        this.fonts = PRELOADS.whiteRabbit.fonts;

        const texture = PRELOADS.all.crumpledPaper;
        this.baseTextureLayer = utils.createBaseTexture(texture, 255, 20);
    }

    this.border = (borderWidth, x, t) => {
        push();
        fill(this.blue);
        const nStripes = 10;
        const stripesWidth = borderWidth * 5;
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

    this.pallette = (ctx, w) => {
        const h = 0.6 * w;
        ctx.push();
        // centering offset
        ctx.translate(0.05 * w, 0.02 * w);
        ctx.fill(this.red);
        ctx.rect(-0.50 * w, -0.37 * h, w, h, h * 0.3);
        ctx.fill(this.black);
        ctx.ellipse(-0.10 * w, 0, w, h);
        ctx.fill(this.white);
        ctx.circle(0.21 * w, -0.2 * h, 0.2 * h);
        ctx.fill(this.red);
        ctx.circle(0.26 * w, 0.1 * h, 0.18 * h);
        const rw = 0.75 * w;
        const rh = rw * this.rabbit.height / this.rabbit.width;
        ctx.image(this.rabbit, -0.71 * rw, -0.65 * rh, rw, rh);
        ctx.fill(this.red);
        ctx.ellipse(-0.370 * w, -0.29 * h, 0.06 * h, 0.05 * h);
        ctx.fill(this.white);
        ctx.circle(-0.380 * w, -0.300 * h, 0.018 * h);
        ctx.pop();
        // utils.origin(ctx);
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

    this.viridian = (ctx, xSize) => {
        ctx.push();
        // TODO: probably we want each letter to be its own coordinate system
        // and then we have offsets between each one - easier to think about.

        const { rightEnd, letters } = [
            { strokes: [["l", [0, 0, 2, 6]], ["l", [2, 6, 4, 0]]], marginLeft: 0, marginTop: 0 }, // V
            { strokes: [["l", [0, 0, 0, 4]],], marginLeft: 0.5 }, // i
            {
                strokes: [
                    ["l", [0, 0, 0, 4]],
                    ["a", [0, 1.30, 3, 2.6, -TAU / 4, TAU / 4]],
                    ["l", [0, 1.3, 1.5, 4]],
                ],
            }, // r
            { strokes: [["l", [0, 0, 0, 4]],] }, // i
            { // d
                strokes: [
                    ["l", [0, 0, 0, 4]],
                    ["a", [0, 2, 3, 4, -TAU / 4, TAU / 4]],
                ]
            },
            { strokes: [["l", [0, 0, 0, 4]],] }, // i
            { // a
                strokes: [
                    ["l", [1, 0, 0, 4]],
                    ["l", [1, 0, 2, 4]],
                    ["l", [1, 4, 0.5, 2]],
                    ["l", [1, 4, 1.5, 2]],
                ]
            },
            { // n
                strokes: [
                    ["l", [0, 0, 0, 4]],
                    ["l", [0, 0, 2, 4]],
                    ["l", [2, 0, 2, 4]],
                ]
            },
        ].reduce(({ rightEnd, letters }, letter) => {
            const strokes = letter.strokes;
            const marginLeft = letter.marginLeft === undefined ? 1 : letter.marginLeft;
            const marginTop = letter.marginTop === undefined ? 2 : letter.marginTop;
            const letterStartX = rightEnd + marginLeft;
            const shiftedStrokes = strokes.map(([type, coords]) => {
                let shifted;
                if (type === "l") {
                    shifted = [coords[0] + letterStartX, coords[1] + marginTop, coords[2] + letterStartX, coords[3] + marginTop];
                } else {
                    shifted = [
                        coords[0] + letterStartX, coords[1] + marginTop,
                        coords[2], coords[3], coords[4], coords[5]
                    ]
                }
                return [type, shifted];
            });
            const strokeMaxXs = shiftedStrokes.map(([type, coords]) => {
                if (type === "l") {
                    return Math.max(coords[0], coords[2]);
                } else {
                    return Math.max(coords[0], coords[0] + coords[2] / 2);
                }
            });
            const newRightX = Math.max(...strokeMaxXs);
            letters.push({ strokes: shiftedStrokes })
            return { rightEnd: newRightX, letters: letters }
        }, { rightEnd: 0, letters: [] });

        const s = xSize * 0.02;
        ctx.translate(-rightEnd / 2 * s, -3 * s);
        letters.forEach(
            ({ strokes }) => strokes.forEach(
                ([type, coords]) => {
                    ctx.noFill();
                    ctx.stroke(0);
                    ctx.strokeWeight(s * 0.4);
                    ctx.push();
                    if (type === "l") {
                        let [x1, y1, x2, y2] = coords
                        ctx.line(x1 * s, y1 * s, x2 * s, y2 * s);
                    } else if (type === "a") {
                        let [x, y, w, h, th0, th1] = coords
                        ctx.arc(x * s, y * s, w * s, h * s, th0, th1, OPEN);
                    }
                    ctx.pop();
                })
        );

        ctx.pop();
    }

    this.diamond = (ctx, w) => {
        u = w / 16;
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


    this.textDiamond = (text, textSize = 20, lang = "cn") => {
        return (ctx, xSize) => {
            this.diamond(ctx, xSize);
            const greeting = text;
            ctx.textSize(textSize);
            ctx.textFont(this.fonts[lang]);
            const bbox = this.fonts[lang].textBounds(greeting, 0, 0, textSize);
            ctx.fill(128);
            ctx.fill(this.black);
            ctx.text(greeting, -0.51 * bbox.w, 0.42 * bbox.h);
        };
    }

    this.viridianDiamond = (ctx, xSize) => {
        this.diamond(ctx, xSize);
        this.viridian(ctx, xSize);
    }

    this.debugIcon = (ctx, xSize, i) => {
        ctx.fill(0);
        const u = xSize * 0.1;
        for (let j = 0; j <= i; j++) {
            ctx.circle(j * u, 0, u);
        }
    };

    // nullIcon wants the topX to be the same as the *next* topX
    this.nullIcon = () => { };

    this.reel = (ctx, items, x, xSize, t) => {
        push();
        ctx.noStroke();
        ctx.clear();
        const u = xSize * 0.1;
        const cellHeight = height * 1.8;
        const connectorSize = cellHeight / 2;

        const steps = items.map((_value, i, arr) => (i * 2 + 1) / (arr.length * 2));
        const stepT = utils.smoothsteps(steps, 0.1, t);
        const baseY = height / 2 - stepT * (items.length) * cellHeight;

        // need to render the first element at the bottom of the reel, too, to maintain the looping illusion
        const numIcons = items.length + 1;
        for (let i = 0; i < numIcons; i++) {
            let { topX, iconMaker } = items[i % items.length];
            let nextIndex = (i + 1) % items.length;
            let botX = items[nextIndex].topX;
            let y = baseY + i * cellHeight;
            let above = (y < -cellHeight / 2);
            let below = (y > height + cellHeight / 2);
            if (above || below) {
                continue;
            }
            let iconCtx = this.iconLayer;
            this.redStripes(ctx, x + topX * u, y, 0.1 * u, -connectorSize, 8);
            this.redStripes(ctx, x + botX * u, y, 0.1 * u, connectorSize, 8);

            iconCtx.push();
            iconCtx.clear();
            iconCtx.translate(iconCtx.width / 2, iconCtx.height / 2);
            iconMaker(iconCtx, xSize, i);
            iconCtx.pop();


            utils.applyTexture(iconCtx, this.iconTextureLayer, this.baseTextureLayer, HARD_LIGHT);
            if ((y <= height + iconCtx.height / 2) || (y >= -iconCtx.height / 2)) {
                ctx.image(iconCtx, x - iconCtx.width / 2, y - iconCtx.height / 2, ctx.width, ctx.height);
            }
        }

        pop();
    }

    this.draw = () => {
        const itemsMaker = (diamond) => {
            return [
                {
                    topX: -3, iconMaker: this.pallette,
                },
                {
                    topX: 3, iconMaker: diamond,
                },
                {
                    topX: -3, iconMaker: this.nullIcon,
                },

            ]
        };

        const cycle = (arr, x) => arr.slice(-x).concat(arr.slice(0, -x));

        const leftTexts = [
            this.textDiamond("새해 복 많이 받으세요", 0.8 * g, "kr"),

        ]
        const leftItems = leftTexts.flatMap(itemsMaker);

        const rightTexts = [
            this.textDiamond("新年快乐", 1.1 * g, "cn"),
        ]
        const rightItems = cycle(rightTexts
            .flatMap(itemsMaker)
            .map(({ topX, iconMaker }) => { return { topX: -topX, iconMaker } }),
            1);

        const total = 200 * leftItems.length;
        const t = (frameCount % total) / total;

        const borderSize = 5 * g;
        const borderT = 4 * leftItems.length * t;
        const frameWidth = width - 2 * borderSize;
        const reelMargin = borderSize + frameWidth / 4;

        clear();
        background(this.white);
        noStroke();
        this.border(borderSize / 6, 0, borderT);
        this.border(-borderSize / 6, width, borderT);
        this.reel(this.leftReel, leftItems, reelMargin, frameWidth * 0.4, t);


        this.reel(this.rightReel, rightItems, width - reelMargin, frameWidth * 0.4, t);

        blendMode(HARD_LIGHT);
        image(this.baseTextureLayer, 0, 0, width, height);
        blendMode(BLEND);
        image(this.leftReel, 0, 0, width, height);
        image(this.rightReel, 0, 0, width, height);
    }
}