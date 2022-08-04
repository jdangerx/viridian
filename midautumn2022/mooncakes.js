function Mooncakes() {
    this.setup = () => {
        this._setup(200)
    }

    this._setup = (patternSize) => {
        // the real setup function that we can initialize elsewhere
        this.patternSize = patternSize;
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
        ctx.background('rgba(0, 0, 0, 0)');
        const numScallops = 18;
        const ringRadius = this.patternSize / 2;
        ctx.fill(this.highlight_rgb);
        const oneScallop = (diameterCoeff) => {
            const diameter = TAU * ringRadius / numScallops * diameterCoeff;
            ctx.circle(ringRadius - 2 * diameter / numScallops, 0, diameter);
        };
        const center = createVector(ctx.width / 2, ctx.height / 2)
        utils.gyrate(ctx, oneScallop, [1.8], center, numScallops, TAU / numScallops);
        ctx.push();
        ctx.fill(this.dough_rgb);
        utils.gyrate(ctx, oneScallop, [1.5], center, numScallops, TAU / numScallops);
        ctx.pop();
        ctx.stroke(this.shadow_rgb);
        ctx.circle(ctx.width / 2, ctx.height / 2, this.patternSize * 1.05);
    }

    this.flower = function (ctx, frame) {
        const t = utils.frameToTime(frame, 300, 0, 1);
        ctx.push();
        const unit = ctx.width;
        const eased = lerp(unit / 4, unit / 2, 0.5 + 0.3 * sin(2 * TAU * t) + 0.2 * sin(3 * TAU * t));
        ctx.translate(unit / 2, unit / 2);
        ctx.rotate(TAU / 4 * utils.smoothstep(0.2, 0.8, t));
        ctx.strokeWeight(unit / 50);

        ctx.circle(0, 0, 0.4 * unit);
        ctx.circle(0, 0, 0.3 * unit);
        ctx.circle(0, 0, 0.2 * unit);

        const petal = () => {
            ctx.ellipse(0, 0.375 * unit, eased, 0.25 * unit);
        };
        num = 20;
        utils.gyrate(ctx, petal, [], createVector(0, 0), num, TAU / num);
        ctx.pop();
    }

    this.genMooncake = (pattern, frameCount) => {
        pattern.background(this.dough_rgb);
        pattern.strokeCap(SQUARE);
        pattern.fill('rgba(0, 0, 0, 0)');

        pattern.push();
        pattern.translate(2, 2);
        pattern.strokeWeight(pattern.weight * 0.06);
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
        this.drawMooncake(mouseX - width/2, mouseY - height/2, this.contexts);
    }
}