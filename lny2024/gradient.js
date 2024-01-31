function Gradient() {
    const Y_AXIS = 1;
    const X_AXIS = 2;
    var n = 3;
    const U = width / 32;

     /*
    this.textDiamond("CHÚC MỪNG NĂM MỚI", 0.76 * g, "vn"),
            this.textDiamond("HAPPY NEW YEAR", 0.9 * g, "vn"),
            this.viridianDiamond,
            this.textDiamond("新年快乐", 1.1 * g, "cn"),
            this.textDiamond("새해 복 많이 받으세요", 0.76 * g, "kr"),
*/
    var texts = 
    [{text: "CHÚC MỪNG NĂM MỚI",
            size: 0.76 * U,
            lang: "vn"
            },
    {text: "HAPPY NEW YEAR",
            size: 0.9 * U,
            lang: "vn"
            },
    {text: "新年快乐",
            size: 1.1 * U,
            lang: "cn"
            },
    {text: "새해 복 많이 받으세요",
            size: 0.76 * U,
            lang: "kr"
            },
        ];    

    this.setup = () => {
        // this.do_draw()
        this.shader = PRELOADS.gradient.chromaticShader;
        this.dusse = PRELOADS.gradient.dusseCross;
        this.dusseInterval = 3 * U;
        const desiredHeight = 2 * U;
        const scaleFactor = desiredHeight / this.dusse.height;
        this.texture = createGraphics(width * 1.5, desiredHeight * 2);
        for (let i = 0; i < 14; i++) {
            this.texture.push();
            this.texture.translate(i * this.dusseInterval, U*2);
            this.texture.scale(scaleFactor);

            //var text = texts[i].text;
            //var size = texts[i].size;
            //var lang = texts[i].lang;

            //this.text(this.texture, text, size, 0, 0, lang);
            this.texture.image(this.dusse, 0, 0);
            this.texture.pop()
        }
        this.gl = createGraphics(this.texture.width, this.texture.height, WEBGL);
        this.gl.shader(this.shader);
    }

    this.enter = () => {
        this.fonts = PRELOADS.gradient.fonts;
    }

    this.text = (ctx, text, textSize = 20, x, y, lang = "cn") => {
        const greeting = text;
        ctx.textSize(textSize);
        console.log(lang);
        ctx.textFont(this.fonts[lang]);
        //const bbox = this.fonts[lang].textBounds(greeting, 0, 0, textSize);
        //ctx.fill(0,205,85);
        fill(255);
        ctx.text(greeting, x, y);
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
        const maxRank = n;
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

        const mx = 0.005 * (noise(frameCount * 0.005) - 0.5);
        const my = 0.02 * (noise((frameCount * 0.01 + 5) * 0.03) - 0.5);
        this.shader.setUniform("uOffset", [mx, my]);
        this.gl.rect(0, 0, U, U);
        // image(this.gl, 3 * (i - 1) * U + (frameCount * 0.02 % 3 * U), 1 * U);
        //image(this.gl, (fract(frameCount / 120) - 1) * this.dusseInterval, 1.5 * U);
        pop();
        
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

/*
        setGradient(
            phase,
            xOffset + rank * size - animOffset, 0,
            size, height,
            Y_AXIS,
            false
        );
*/
        
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

        /*
        setGradient(
            phase,
            xOffset + width / 2 - ((rank + 1) * size) + animOffset,
            0,
            size,
            height,
            Y_AXIS,
            false
        );*/
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

        let gradientRed = cosineGradient(1.218, 0.5, 1.000, 0.188);
        let gradientGreen = cosineGradient(0.178, 0.578, 1.000, 0.078);
        let gradientBlue = cosineGradient(0.288, 0.5, 2.000, -0.852);

        let flipRed = cosineGradient(1.218, 0.5, 1.000, -0.188);
        let flipGreen = cosineGradient(0.178, 0.578, 1.000, -0.078);
        let flipBlue = cosineGradient(0.288, 0.5, 2.000, 0.852);

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
            var yFactor = (height/2 - abs((y+h*0.5) - height/2));
            //var yFactor = abs((y+h*0.5) - height/2);

            var darkMargin = U*yFactor*0.05;
            // Left to right gradient
            for (let i = x; i <= x + w; i++) {
                let inter = map(i, x, x + w, 0, 1) + offset * 2;
                let c = gradientColor(inter, gradientRed, gradientGreen, gradientBlue);

                if (i < darkMargin)
                {
                    var t = i / darkMargin;
                    var newC = lerpColor(color(100, 0, 0), c, utils.getBias(t, 0.4)); 
                    fill(newC);
                    //fill(0);
                    rect(i, y, 1, h+1);
                }
                else if (i > width - darkMargin)
                {
                    var t = (darkMargin - (i-(width-darkMargin))) / darkMargin;
                    var newC = lerpColor(color(100, 0, 0), c, utils.getBias(t, 0.4)); 
                    fill(newC);
                    //fill(0);
                    rect(i, y, 1, h+1);
                }
                else
                {
                    fill(c);
                    rect(i, y, 1, h + 1);
                }
            }
        }
        pop();
    }
}
