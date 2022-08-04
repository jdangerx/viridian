function Mooncakes() {
    this.setup = () => {
        this.patternSize = 200;

        this.dough_rgb = color(201, 128, 57);
        this.highlight_rgb = color(248, 185, 118);
        this.shadow_rgb = color(161, 79, 10);
        this.setupContexts(patternSize);
        const { pattern, mask, scallop } = this.contexts;
        scribble = new Scribble(pattern);

        this.makeScallops(scallop);
        mask.background('rgba(0, 0, 0, 0)')
        mask.fill('rgba(0, 0, 0, 1)')
        mask.circle(mask.width / 2, mask.height / 2, pattern.width);
        mask.drawingContext.globalCompositeOperation = 'source-in';

        this.genMooncake(pattern, 1);
    }

    this.setupContexts = (size) => {
        this.contexts = {
            pattern: createGraphics(size, size),
            mask: createGraphics(size, size),
            scallop: createGraphics(size * 1.5, size * 1.5)
        }
    }

    this.makeScallops = function (ctx) {
        // scallop could be done with gyrate
        // should we pass in the graphics element, instead of mutating global state?
        ctx.noStroke();
        ctx.background('rgba(0, 0, 0, 0)')
        const numScallops = 18;
        const stepSize = TAU / numScallops;
        const ringRadius = patternSize / 2;
        ctx.fill(this.highlight_rgb);
        for (let i = 0; i < numScallops; i++) {
            const diameter = TAU * ringRadius / numScallops * 1.5;
            x = cos(i * stepSize) * (ringRadius - 2 * diameter / numScallops);
            y = sin(i * stepSize) * (ringRadius - 2 * diameter / numScallops);
            ctx.circle(ctx.width / 2 + x, ctx.height / 2 + y, diameter * 1.2);
        }
        ctx.push();
        ctx.fill(this.dough_rgb);
        for (let i = 0; i < numScallops; i++) {
            const diameter = TAU * ringRadius / numScallops * 1.5;
            x = cos(i * stepSize) * (ringRadius - 2 * diameter / numScallops);
            y = sin(i * stepSize) * (ringRadius - 2 * diameter / numScallops);
            ctx.circle(ctx.width / 2 + x, ctx.height / 2 + y, diameter);
        }
        ctx.pop();
        ctx.stroke(this.shadow_rgb);
        ctx.circle(ctx.width / 2, ctx.height / 2, patternSize + 10);
    }

    this.flower = function (ctx, frame) {
        t = utils.frameToTime(frame, 300, 0, 1);
        ctx.push();
        eased = lerp(50, 100, 0.5 + 0.3 * sin(2 * TAU * t) + 0.2 * sin(3 * TAU * t));
        ctx.translate(100, 100);
        ctx.rotate(TAU / 4 * utils.smoothstep(0.2, 0.8, t));
        //ctx.strokeWeight(4);

        ctx.ellipse(0, 0, 80, 80);
        ctx.ellipse(0, 0, 60, 60);
        ctx.ellipse(0, 0, 40, 40);

        unit = () => {
            ctx.ellipse(0, 75, eased, 50);
        };
        num = 20;
        utils.gyrate(ctx, unit, [], createVector(0, 0), num, TAU / num);
        ctx.pop();
    }

    this.genMooncake = (pattern, frameCount) => {
        pattern.background(this.dough_rgb);
        pattern.strokeCap(SQUARE);
        pattern.fill('rgba(0, 0, 0, 0)');

        pattern.push();
        pattern.translate(2, 2);
        pattern.strokeWeight(12);
        pattern.stroke(this.shadow_rgb);
        this.flower(pattern, frameCount);
        pattern.pop();

        pattern.stroke(this.highlight_rgb);
        pattern.strokeWeight(5);
        this.flower(pattern, frameCount);
    }

    this.drawMooncake = (x, y, { mask, pattern, scallop }) => {
        mask.image(pattern, 0, 0);
        image(scallop, x - scallop.width / 2, y - scallop.height / 2);
        image(mask, x - mask.width / 2, y - mask.height / 2);
    }

    this.draw = function () {
        background(93, 169, 155);
        this.genMooncake(this.contexts.pattern, frameCount);
        this.drawMooncake(mouseX, mouseY, this.contexts);
    }
}