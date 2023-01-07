function WhiteRabbit() {
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

    this.pallette = (x, y, w, h, rotation) => {
        push();
        translate(x, y);
        rotate(rotation);
        fill(this.red);
        rect(-0.39 * w, -0.37 * h, w, h, h * 0.3);
        fill(this.black);
        ellipse(0, 0, w, h);
        fill(this.white);
        circle(0.22 * w, -0.2 * h, 0.2 * h);
        fill(this.blue);
        circle(0.33 * w, 0.1 * h, 0.18 * h);
        const rw = 0.16 * width;
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

    this.draw = () => {
        background(this.white);
        noStroke();

        const total = 300;
        const t = (frameCount % total) / total;
        const slowT = ((frameCount / 2) % total) / total;

        const stripeWidth = width * 0.003;
        const nStripes = 8;
        fill(this.white);
        rect(width * 0.5 - (nStripes + 0.5) * stripeWidth, 0, stripeWidth, height);
        for (let i = 0; i < nStripes; i++) {
            fill(this.red);
            rect(width * 0.5 - (nStripes - 0.5) * stripeWidth + 2 * i * stripeWidth, 0, stripeWidth, height);
            fill(this.white);
            rect(width * 0.5 - (nStripes - 0.5) * stripeWidth + (2 * i + 1) * stripeWidth, 0, stripeWidth, height);
        }

        const damping = utils.widePulse(0.3, 0.7, 0.2, slowT);
        const palletteLooseness = utils.widePulse(0.5, 0.6, 0.1, slowT);
        const firstPallette = createVector(0.25, 0.54);
        const secondPallette = createVector(0.75, 0.62);
        {
            const loc = p5.Vector.lerp(
                firstPallette,
                secondPallette,
                utils.smoothstep(0.62, 0.72, slowT)
            );
            this.pallette(
                width * loc.x,
                height * loc.y,
                width * 0.2 * (1 + 0.1 * sin(frameCount * 0.001) * damping),
                height * 0.5 * (1 + 0.1 * sin(frameCount * 0.001) * damping),
                sin(10 * t * 2 * PI * palletteLooseness) * PI * 0.05 * damping
            );
        }

        {
            const loc = p5.Vector.lerp(
                secondPallette,
                firstPallette,
                utils.smoothstep(0.65, 0.75, slowT)
            );
            this.pallette(
                width * loc.x,
                height * loc.y,
                width * 0.2 * (1 + 0.1 * sin(frameCount * 0.0012) * damping),
                height * 0.5 * (1 + 0.1 * sin(frameCount * 0.0012) * damping),
                sin(11 * t * 2 * PI * palletteLooseness) * PI * 0.05 * damping
            );
        }

        const borderSize = 0.06;
        this.border(borderSize, 0, 2 * t);
        this.border(-borderSize, width, 2 * t);
        blendMode(HARD_LIGHT);
        image(this.overlay, 0, 0, width, height);
    }
}