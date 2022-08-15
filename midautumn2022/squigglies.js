function Squigglies() {
    let night = color(51, 51, 102);
    let gold = color(240, 200, 40);
    this.setup = () => {
        background(51, 51, 102);
        noStroke();
        this.cloudTrail();
    }

    this.featherArc = (dx, dy, pivotX, pivotY, radius, start, stop) => {
        push();
        fill(gold);
        arc(pivotX, pivotY, 2 * radius, 2 * radius, start, stop);
        fill(night);
        arc(pivotX, pivotY, 2 * (radius - dx), 2 * (radius - dy), start, stop);
        pop();
    }

    this.cloudTrail = () => {
        // next - there are four directions we *can* go:
        // left/right/up/down
        // and, the edge can be horizontal or vertical
        // and how would we want to do a curlicue?
        // suppose we do mostly just want to define x, y, radius - and then offset in the right way
        const control = [
            {
                x: 12 * grid,
                radius: 0.3 * grid, // make this the same as dyOut to get a nice crisp end
                dx: 0.1 * grid,
                dyOut: 0.3 * grid
            },
            {
                x: 16 * grid,
                radius: 1 * grid,
                dx: 0.1 * grid,
                dyOut: 0.2 * grid
            },
            {
                x: 13 * grid,
                radius: 0.7 * grid,
                dx: 0.1 * grid,
                dyOut: 0.3 * grid
            },
            {
                x: 18 * grid,
                radius: 0.3 * grid,
                dx: 0.1 * grid,
                dyOut: 0.3 * grid
            },
        ]

        const pairs = control
            .map((e, i, arr) => i < arr.length - 1 ? { start: arr[i], end: arr[i + 1] } : null)
            .filter((x) => x !== null)
        console.log(pairs);

        let startY = 2 * grid;
        pairs.forEach(({ start, end }) => {
            push();
            rectMode(CORNERS)
            // top-down, but what about 
            startAngles = start.x < end.x ? [TAU / 4, TAU / 2] : [0, TAU / 4];
            endAngles = start.x < end.x ? [-TAU / 4, 0] : [TAU / 2, -TAU / 4];
            const endY = startY + start.radius + end.radius - start.dyOut;

            this.featherArc(start.dx, start.dyOut, start.x, startY, start.radius, ...startAngles);
            this.featherArc(end.dx, start.dyOut, end.x, endY, end.radius, ...endAngles);

            fill(gold);
            rect(start.x, startY + start.radius - start.dyOut, end.x, endY - end.radius + start.dyOut)
            startY = endY;
            pop();
        });
    }

    this.slot = (centerX, centerY, length, radius) => {
        push();
        rectMode(CENTER);
        rect(centerX, centerY, length, 2 * radius, radius)
        pop();


    }

    this.enter = () => {
    }

    this.draw = function () {
    }
}