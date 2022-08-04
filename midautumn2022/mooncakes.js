function Mooncakes() {
    let pattern;
    let mask;
    let scallop;
    let patternSize;
    let scallopSize;
    let DOUGH_RGB;
    let HIGHLIGHT_RGB;
    let SHADOW_RGB;
    let scribble;
    let t = 0;

    this.setup = function () {
        patternSize = 200;

        DOUGH_RGB = color(210, 140, 50);
        HIGHLIGHT_RGB = color(250, 180, 80);
        SHADOW_RGB = color(150, 100, 30);
        scallopSize = patternSize * 1.5;
        pattern = createGraphics(patternSize, patternSize);
        scribble = new Scribble(pattern);
        mask = createGraphics(patternSize, patternSize);
        scallop = createGraphics(scallopSize, scallopSize);
        this.makeScallops();
        mask.background('rgba(0, 0, 0, 0)')
        mask.fill('rgba(0, 0, 0, 1)')
        mask.circle(patternSize / 2, patternSize / 2, patternSize);
        mask.drawingContext.globalCompositeOperation = 'source-in';

        this.genMooncake(1);
    }


    this.makeScallops = function () {
        // scallop could be done with gyrate
        // should we pass in the graphics element, instead of mutating global state?
        scallop.noStroke();
        scallop.background('rgba(0, 0, 0, 0)')
        const numScallops = 30;
        const stepSize = TAU / numScallops;
        const ringRadius = patternSize / 2;
        scallop.fill(SHADOW_RGB);
        for (let i = 0; i < numScallops; i++) {
            const diameter = TAU * ringRadius / numScallops * 1.5;
            x = cos(i * stepSize) * (ringRadius - 2 * diameter / numScallops);
            y = sin(i * stepSize) * (ringRadius - 2 * diameter / numScallops);
            scallop.circle(scallopSize / 2 + x, scallopSize / 2 + y, diameter * 1.2);
        }
        scallop.push();
        scallop.fill(DOUGH_RGB);
        for (let i = 0; i < numScallops; i++) {
            const diameter = TAU * ringRadius / numScallops * 1.5;
            x = cos(i * stepSize) * (ringRadius - 2 * diameter / numScallops);
            y = sin(i * stepSize) * (ringRadius - 2 * diameter / numScallops);
            scallop.circle(scallopSize / 2 + x, scallopSize / 2 + y, diameter);
        }
        scallop.pop();
        scallop.circle(scallopSize / 2 + 3, scallopSize / 2 + 3, patternSize);
    }

    this.flower = function (ctx, frame) {
        t = utils.frameToTime(frame, 300, 0, 1);
        ctx.push();
        eased = lerp(20, 40, 0.5 + 0.5 * sin(2 * TAU * t));
        ctx.strokeWeight(4);

        scribble.scribbleEllipse(100, 100, 80, 80);
        scribble.scribbleEllipse(100, 100, 60, 60);
        scribble.scribbleEllipse(100, 100, 40, 40);

        unit = () => {
            scribble.scribbleEllipse(0, 75, eased, 50);
        };
        num = 32;
        utils.gyrate(ctx, unit, [], createVector(100, 100), num, TAU / num);
        ctx.pop();
    }

    this.genMooncake = (frameCount) => {
        pattern.background(DOUGH_RGB);
        pattern.strokeWeight(6);
        pattern.strokeCap(SQUARE);
        pattern.fill('rgba(0, 0, 0, 0)');

        pattern.push();
        pattern.translate(3, 3);
        pattern.stroke(SHADOW_RGB);
        this.flower(pattern, frameCount);
        pattern.pop();

        pattern.stroke(HIGHLIGHT_RGB);
        pattern.circle(patternSize / 2, patternSize / 2, patternSize - 5);
        this.flower(pattern, frameCount);
    }

    this.drawMooncake = (x, y) => {
        mask.image(pattern, 0, 0);
        image(scallop, x - scallop.width / 2, y - scallop.height / 2);
        image(mask, x - mask.width / 2, y - mask.height / 2);
    }

    this.draw = function () {
        background(200, 200, 240);
        // this.genMooncake(frameCount);
        this.drawMooncake(mouseX, mouseY);
    }
}