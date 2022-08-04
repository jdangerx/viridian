const mooncakes = {
    setupContexts: (size) => {
        return {
            pattern: createGraphics(size, size),
            mask: createGraphics(size, size),
            scallop: createGraphics(size * 1.5, size * 1.5)
        }
    }
}

function Mooncakes() {
    let contexts;
    let patternSize;
    let DOUGH_RGB;
    let HIGHLIGHT_RGB;
    let SHADOW_RGB;
    let scribble;
    let t = 0;

    this.setup = function () {
        patternSize = 200;

        DOUGH_RGB = color(201,128,57);
        HIGHLIGHT_RGB = color(248,185,118);
        SHADOW_RGB = color(161,79,10);
        contexts = mooncakes.setupContexts(patternSize);
        const { pattern, mask, scallop } = contexts;
        scribble = new Scribble(pattern);

        this.makeScallops(scallop);
        mask.background('rgba(0, 0, 0, 0)')
        mask.fill('rgba(0, 0, 0, 1)')
        mask.circle(mask.width / 2, mask.height / 2, pattern.width);
        mask.drawingContext.globalCompositeOperation = 'source-in';

        this.genMooncake(pattern, 1);
    }


    this.makeScallops = function (ctx) {
        // scallop could be done with gyrate
        // should we pass in the graphics element, instead of mutating global state?
        ctx.noStroke();
        ctx.background('rgba(0, 0, 0, 0)')
        const numScallops = 18;
        const stepSize = TAU / numScallops;
        const ringRadius = patternSize / 2;
        ctx.fill(HIGHLIGHT_RGB);
        for (let i = 0; i < numScallops; i++) {
            const diameter = TAU * ringRadius / numScallops * 1.5;
            x = cos(i * stepSize) * (ringRadius - 2 * diameter / numScallops);
            y = sin(i * stepSize) * (ringRadius - 2 * diameter / numScallops);
            ctx.circle(ctx.width / 2 + x, ctx.height / 2 + y, diameter * 1.2);
        }
        ctx.push();
        ctx.fill(DOUGH_RGB);
        for (let i = 0; i < numScallops; i++) {
            const diameter = TAU * ringRadius / numScallops * 1.5;
            x = cos(i * stepSize) * (ringRadius - 2 * diameter / numScallops);
            y = sin(i * stepSize) * (ringRadius - 2 * diameter / numScallops);
            ctx.circle(ctx.width / 2 + x, ctx.height / 2 + y, diameter);
        }
        ctx.pop();
        ctx.stroke(SHADOW_RGB);
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
        pattern.background(DOUGH_RGB);
        pattern.strokeCap(SQUARE);
        pattern.fill('rgba(0, 0, 0, 0)');

        pattern.push();
        pattern.translate(2, 2);
        pattern.strokeWeight(12);
        pattern.stroke(SHADOW_RGB);
        this.flower(pattern, frameCount);
        pattern.pop();

        pattern.stroke(HIGHLIGHT_RGB);
        pattern.strokeWeight(5);
        this.flower(pattern, frameCount);
    }

    this.drawMooncake = (x, y) => {
        const { mask, pattern, scallop } = contexts;
        mask.image(pattern, 0, 0);
        image(scallop, x - scallop.width / 2, y - scallop.height / 2);
        image(mask, x - mask.width / 2, y - mask.height / 2);
    }

    this.draw = function () {
        background(93,169,155);
        this.genMooncake(contexts.pattern, frameCount);
        this.drawMooncake(mouseX, mouseY);
    }
}