function WhiteRabbit() {
    this.setup = () => {
        this.borderRabbits = {
            right: loadImage("images/border-rabbit-right.png"),
            left: loadImage("images/border-rabbit-left.png"),
            rightInvert: loadImage("images/border-rabbit-right-invert.png"),
            leftInvert: loadImage("images/border-rabbit-left-invert.png"),
        };
        this.paper = loadImage("images/crumpled-paper-texture.jpeg");
        this.blue = color(60, 60, 200);
        this.white = color(250, 250, 240);
        this.red = color(200, 60, 60);
        this.black = color(30, 30, 30);
    }

    this.border = (borderRatio) => {
        // TODO: animate based on xOffset?
        push();
        fill(this.blue);
        const borderHeight = borderRatio * height;
        const rabbitHeight = borderHeight * 1.2;
        const rabbitScale = rabbitHeight / this.borderRabbits.right.height;
        const rh = this.borderRabbits.right.height * rabbitScale;
        const rw = this.borderRabbits.right.width * rabbitScale;
        rect(0, 0, width, borderHeight);
        rect(0, height - borderHeight, width, borderHeight);

        const marginX = 0.25 * borderHeight;
        const marginY = 0.1 * borderHeight;
        const shadowOffset = 0.12 * borderHeight;
        // if we iterate based some # of rabbits instead of on position the animation will be easier.
        for (let x = 0; x < width / 2; x += 2 * (rw + marginX)) {
            let x0 = x + marginX / 2;
            let x1 = x0 + rw + marginX;
            utils.glow(this.blue, 0, shadowOffset, shadowOffset);
            image(this.borderRabbits.rightInvert, width / 2 + x0, marginY, rw, rh);
            image(this.borderRabbits.leftInvert, width / 2 + x1, marginY, rw, rh);
            image(this.borderRabbits.rightInvert, width / 2 - x1 - rw, marginY, rw, rh);
            image(this.borderRabbits.leftInvert, width / 2 - x0 - rw, marginY, rw, rh);
            image(this.borderRabbits.right, width / 2 + x0, height - marginY - rh, rw, rh);
            image(this.borderRabbits.left, width / 2 + x1, height - marginY - rh, rw, rh);
            image(this.borderRabbits.right, width / 2 - x1 - rw, height - marginY - rh, rw, rh);
            image(this.borderRabbits.left, width / 2 - x0 - rw, height - marginY - rh, rw, rh);
            utils.noGlow();
        }

        pop();
    }
    this.draw = () => {
        background(this.white);

        {
            fill(this.blue);
            noStroke();
            let stripeWidth = width * 0.004;
            const nStripes = 8;
            for (let i = 0; i < nStripes; i++) {
                rect(
                    0,
                    height * 0.75 - (nStripes - 0.5) * stripeWidth + 2 * i * stripeWidth,
                    width / 2,
                    stripeWidth * (0.6 + i * 0.15)
                );

                rect(
                    width / 2,
                    height * 0.25 - (nStripes - 0.5) * stripeWidth + 2 * i * stripeWidth,
                    width / 2,
                    stripeWidth * (1.6 - i * 0.15)
                );
            }
        }
        {
            noStroke();
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
        }
        this.border(0.15);
        push();
        blendMode(HARD_LIGHT);
        tint(255, 40);
        image(this.paper, 0, 0, width, this.paper.height / this.paper.width * width);
        pop();
    };
}