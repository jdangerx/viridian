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

    this.border = (borderRatio, t) => {
        // TODO: animate based on xOffset?
        push();
        fill(this.blue);
        const borderHeight = borderRatio * height;
        const rabbitHeight = borderHeight * 1.2;
        const rabbitScale = rabbitHeight / this.borderRabbits.right.height;
        const rh = this.borderRabbits.right.height * rabbitScale;
        const rw = this.borderRabbits.right.width * rabbitScale;
        utils.glow("#000000", 4, 0, borderHeight * 0.05);
        rect(0, 0, width, borderHeight);
        utils.noGlow();
        rect(0, height - borderHeight, width, borderHeight);

        const marginX = 0.25 * borderHeight;
        const marginY = 0.1 * borderHeight;
        const shadowOffset = 0.12 * borderHeight;
        const patternWidth = 2 * (rw + marginX);
        const xOffset = t * patternWidth;
        const nRabbits = (width / patternWidth) / 2 + 1;
        push();
        translate(xOffset % patternWidth, 0);
        for (let i = -nRabbits - 1; i < nRabbits; i++) {
            x = i * patternWidth + (rw + marginX) / 2;
            let x0 = x + marginX / 2;
            let x1 = x0 + rw + marginX;
            utils.glow(this.blue, 0, shadowOffset, shadowOffset);
            image(this.borderRabbits.rightInvert, width / 2 + x0, marginY, rw, rh);
            image(this.borderRabbits.leftInvert, width / 2 + x1, marginY, rw, rh);
            utils.noGlow();
        }
        pop();
        push();
        translate(-xOffset % patternWidth, 0);
        for (let i = -nRabbits; i < nRabbits; i++) {
            x = i * patternWidth + (rw + marginX) / 2;
            let x0 = x + marginX / 2;
            let x1 = x0 + rw + marginX;
            utils.glow(this.blue, 0, shadowOffset, shadowOffset);
            image(this.borderRabbits.right, width / 2 - x1 - rw, height - marginY - rh, rw, rh);
            image(this.borderRabbits.left, width / 2 - x0 - rw, height - marginY - rh, rw, rh);
            utils.noGlow();
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
        const borderSize = 0.15;

        const total = 300;
        const t = (frameCount % total) / total;
        const slowT = ((frameCount / 2) % total) / total;

        this.blueStripes(0, height * (1 - borderSize), width * 0.5, -height * 0.24, 8, t);
        this.blueStripes(width * 0.5, height * borderSize, width * 0.5, height * 0.24, 8, t);

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

        this.border(borderSize, utils.smoothstep(0.45, 0.55, t));
        blendMode(HARD_LIGHT);
        image(this.overlay, 0, 0, width, height);
    }
}