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

    gyrate: (ctx, unitFunc, args, center, iterations, stepSize, callback) => {
        // ctx: a graphics context from createGraphics
        // unitFunc: the func that draws something you want gyrated
        // args: list of any additional args you want to pass to unitFunc
        // center: vector representing where the center of the gyration should be
        // iterations: num iterations
        // stepSize (radians): how big the step size is
        // callback: any post-processing you need to do to args? (TODO: add 
        //   iterations + stepSize to the args before hitting callback)
        ctx.push()
        ctx.translate(center);
        for (let i = 0; i < iterations; i++) {
            ctx.rotate(stepSize);
            if (callback) {
                args = callback(args);
            }
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

    smoothstep: (min, max, value) => {
        var x = Math.max(0, Math.min(1, (value - min) / (max - min)));
        return x * x * (3 - 2 * x);
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

    glow: (glowColor, blurriness, x, y) => {
        drawingContext.shadowBlur = blurriness;
        drawingContext.shadowColor = glowColor;
        drawingContext.shadowOffsetX = x;
        drawingContext.shadowOffsetY = y;
    },

    noGlow: () => {
        drawingContext.shadowBlur = 0;
        drawingContext.shadowOffsetX = 0;
        drawingContext.shadowOffsetY = 0;
    },

    addRotatedImage: (ctx, newImage, rotationAmt) => 
    {
        ctx.push();
        ctx.clear();
        var imageSize = ctx.width/2-10;
        ctx.translate(ctx.width/2, ctx.height/2);
        ctx.rotate(rotationAmt % TAU);
        ctx.image(newImage, -imageSize, -imageSize, imageSize*2, imageSize*2);
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
    }

};