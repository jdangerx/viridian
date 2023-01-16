const utils = {
    addHoldTime: (t, prehold, duration) => {
        // take a time from 0 to 1 and give it hold value on both sides:
        //             _
        // from / to _/

        // for smooth looping we may need to apply almostIdentity here from IQ's functions page
        return min(max(0, (t - prehold) / duration), 1);
    },

    frameToTime: (frame, loopFrames, prehold, duration) => {
        // we take this total duration, and renormalize each frameCount within it
        // to a range [0, 1] - this converts frame count to 'time', where the unit of
        // time is 'one loop'.
        t = utils.addHoldTime(frame % loopFrames / loopFrames, prehold, duration)
        return t;
    },

    gyrate: (ctx, unitFunc, args, center, iterations, stepSize, opts) => {
        // ctx: a graphics context from createGraphics
        // unitFunc: the func that draws something you want gyrated
        // args: list of any additional args you want to pass to unitFunc
        // center: vector representing where the center of the gyration should be
        // iterations: num iterations
        // stepSize (radians): how big the step size is
        // opts: so far the only opt is 'angularOffset'
        ctx.push()
        ctx.translate(center);
        if (opts && opts.angularOffset) {
            ctx.rotate(opts.angularOffset);
        }
        for (let i = 0; i < iterations; i++) {
            ctx.rotate(stepSize);
            unitFunc.apply(null, args);
        }
        ctx.pop()
    },

    // rachel found these easing functions somewhere, I forget where. Perlin?
    getBias: (time, bias) => {
        return (time / ((((1.0 / bias) - 2.0) * (1.0 - time)) + 1.0));
    },

    getGain: (time, gain) => {
        if (time < 0.5)
            return utils.getBias(time * 2.0, gain) / 2.0;
        else
            return utils.getBias(time * 2.0 - 1.0, 1.0 - gain) / 2.0 + 0.5;
    },

    getGainWindow: (time, windowMin, windowMax, gain) => {
        const width = windowMax - windowMin;
        const normalizedTime = Math.min(Math.max(0, time - windowMin), width) / width;
        return utils.getGain(normalizedTime, gain);
    },

    smoothstep: (min, max, value) => {
        var x = Math.max(0, Math.min(1, (value - min) / (max - min)));
        return x * x * (3 - 2 * x);
    },

    smoothsteps: (steps, width, t) => {
        const bias = 0.1;
        const sum = (steps.map(step => [step - width / 2, step + width / 2])
            .map(([min, max]) => utils.getGainWindow(t, min, max, bias))
            .reduce((acc, cur) => acc + cur, 0));
        //return 0.25;
        return sum / steps.length;
    },

    // https://www.iquilezles.org/www/articles/functions/functions.htm
    cubicPulse: (center, width, x) => {
        x = abs(x - center);
        if (x > width) {
            return 0.0;
        }
        x /= width;
        return 1.0 - x * x * (3.0 - 2.0 * x);
    },

    widePulse: (start, end, transition, x) => {
        /**
         * Looks like a gaussian but with a pause at the top.
         *
         * start: [0, 1]
         *   When to start going up.
         * end: [start, 1]
         *   When to start going back down.
         * transition: [0, end - start]
         *   How long it should take to get to the top after we start going up.
         *   (same for the way down too.)
         * x: [0, 1]
         *   The actual input - usually your `t` value.
         */
        return utils.smoothstep(start, start + transition, x) - utils.smoothstep(end, end + transition, x);
    },

    glow: (glowColor, blurriness, x, y, ctx) => {
        if (ctx !== undefined) {
            ctx.drawingContext.shadowBlur = blurriness;
            ctx.drawingContext.shadowColor = glowColor;
            ctx.drawingContext.shadowOffsetX = x;
            ctx.drawingContext.shadowOffsetY = y;
        }
        drawingContext.shadowBlur = blurriness;
        drawingContext.shadowColor = glowColor;
        drawingContext.shadowOffsetX = x;
        drawingContext.shadowOffsetY = y;
    },

    noGlow: (ctx) => {
        if (ctx !== undefined) {
            ctx.drawingContext.shadowBlur = 0;
            ctx.drawingContext.shadowOffsetX = 0;
            ctx.drawingContext.shadowOffsetY = 0;
        }
        drawingContext.shadowBlur = 0;
        drawingContext.shadowOffsetX = 0;
        drawingContext.shadowOffsetY = 0;
    },

    addRotatedImage: (ctx, newImage, rotationAmt) => {
        ctx.push();
        ctx.clear();
        var imageSize = ctx.width / 2 - 10;
        ctx.translate(ctx.width / 2, ctx.height / 2);
        ctx.rotate(rotationAmt % TAU);
        ctx.image(newImage, -imageSize, -imageSize, imageSize * 2, imageSize * 2);
        ctx.pop();
    },

    addRotatedImageOffset: (ctx, newImage, rotationAmt, pivotY) => {
        ctx.push();
        var imageSize = ctx.width / 5;
        ctx.translate(ctx.width / 2, ctx.height / 2);
        ctx.fill(255, 0, 0);
        ctx.circle(0, 0, 5);
        ctx.rotate(rotationAmt % TAU);
        ctx.image(newImage, -imageSize, -imageSize + pivotY, imageSize * 2, imageSize * 2);
        ctx.pop();
    },

    gridLines: (color) => {
        push();
        if (color === undefined) {
            color = 'rgba(255, 255, 255, 0.5)';
        }
        stroke(color);
        for (let i = 0; i < 32; i++) {
            line(i * grid, 0, i * grid, height);
        }
        for (let i = 0; i < 9; i++) {
            line(0, i * grid, width, i * grid);
        }
        pop();
    },

    roundUpNearest10: (num) => {
        return Math.ceil(num / 10) * 10;
    },

    drawWithOutline: (ctx, x, y, xSize, ySize, color, glowStrokeWidth) => {
        utils.glow(color, 0, glowStrokeWidth, 0);
        image(ctx, x, y, xSize, ySize);
        utils.glow(color, 0, -glowStrokeWidth, 0);
        image(ctx, x, y, xSize, ySize);
        utils.glow(color, 0, 0, glowStrokeWidth);
        image(ctx, x, y, xSize, ySize);
        utils.glow(color, 0, 0, -glowStrokeWidth);
        image(ctx, x, y, xSize, ySize);
    },

    lightTest: () => {
        push();
        // blendMode(OVERLAY);
        const red = color('rgba(240, 0, 80, 0.3)')
        const purple = color('rgba(200, 0, 255, 0.3)')
        const light = lerpColor(red, purple, 0.5 * (1 + sin(frameCount * 0.01)))
        background(light);
        // background('rgba(255, 255, 255, 0.5)');
        // blendMode(BLEND);
        document.getElementsByTagName('body')[0].style.background = `rgb(${light.levels[0]}, ${light.levels[1]}, ${light.levels[2]})`
        pop();
    },

    origin: (ctx) => {
        if (ctx === undefined) {
            push();
            fill("red");
            circle(0, 0, 10);
            pop();
        } else {
            ctx.fill("red");
            ctx.circle(0, 0, 10);
        }
    },

    applyTexture: (drawTo, textureCtx, baseTexture, blendMode = BLEND) => {
        textureCtx.clear();
        // draw the base texture into the texture context
        textureCtx.drawingContext.globalCompositeOperation = "source-over";
        textureCtx.image(baseTexture, 0, 0, textureCtx.width, textureCtx.height);
        // draw the existing shape onto the texture context, clipping to shape
        textureCtx.drawingContext.globalCompositeOperation = "destination-in";
        textureCtx.image(drawTo, 0, 0, drawTo.width, drawTo.height);

        // put the texture back into the drawn context
        drawTo.push();
        drawTo.blendMode(blendMode);
        drawTo.image(textureCtx, 0, 0, drawTo.width, drawTo.height);
        drawTo.pop();
    },

    createBaseTexture: (textureImage, ...tintArgs) => {
        ctx = createGraphics(width, height);
        ctx.tint(...tintArgs);
        ctx.image(textureImage, 0, 0, width, textureImage.height / textureImage.width * width);
        return ctx;
    }
};