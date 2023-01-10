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
        const palletter = (y, i) => {
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

        const reelItems = [
            {
                topX: 0 * u,
                iconMaker: palletter,
            },
            {
                topX: 2 * u,
                iconMaker: debugIcon,
            },
        ]

        const reelT = utils.smoothsteps([0.25, 0.75], 0.2, t);
        const baseY = height / 2 - reelT * (reelItems.length) * cellHeight;

        // need to render the first element at the bottom of the reel, too, to maintain the looping illusion
        for (let i = 0; i <= reelItems.length; i++) {
            let { topX, iconMaker } = reelItems[i % reelItems.length];
            let nextIndex = (i + 1) % reelItems.length;
            let botX = reelItems[nextIndex].topX;
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

        const total = 400;
        const t = (frameCount % total) / total;


        this.reel(10 * g, 9 * g, t);

        const borderSize = 0.06;
        this.border(borderSize, 0, 20 * t);
        this.border(-borderSize, width, 20 * t);
        blendMode(HARD_LIGHT);
        image(this.overlay, 0, 0, width, height);
    }
}