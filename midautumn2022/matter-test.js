function MatterTest() {
    // just testing importing of mooncakes stuff for now
    this.setup = () => {
        this.t = millis();
        this.delta = 1000 / 60;
        let radius = 50;
        this.engine = Matter.Engine.create();
        this.circles = [];
        const circleOpts = {
            restitution: 0.9,
            friction: 0.8
        }
        for (let i = 0; i < 10; i++) {
            const x = (i - 5) * 100;
            const y = 200 * noise(x) - 300
            this.circles.push(
                Matter.Bodies.circle(x, y, radius * 1.3, circleOpts),
            )
            this.circles.push(
                Matter.Bodies.circle(x, y - 200, radius * 1.3, circleOpts),
            )
        }
        const floorOpts = { isStatic: true, restitution: 0.7 };
        this.floor = [
            Matter.Bodies.rectangle(0, 300, 400, 100, { ...floorOpts, angle: PI / 5 }),
            Matter.Bodies.rectangle(-100, 300, 400, 100, { ...floorOpts, angle: PI / 6 }),
            Matter.Bodies.rectangle(-200, 300, 400, 100, { ...floorOpts, angle: PI / 7 }),
            Matter.Bodies.rectangle(-300, 300, 400, 100, { ...floorOpts, angle: PI / 8 }),
            Matter.Bodies.rectangle(100, 300, 400, 100, { ...floorOpts, angle: -PI / 6 }),
            Matter.Bodies.rectangle(200, 300, 400, 100, { ...floorOpts, angle: -PI / 5 }),
            Matter.Bodies.rectangle(300, 300, 400, 100, { ...floorOpts, angle: -PI / 5 }),
        ];
        bodies = [...this.circles, ...this.floor]
        Matter.World.add(this.engine.world, bodies);
        console.log(bodies);

        this.mc = new Mooncakes();
        this.mc._setup(2 * radius);
        //this.mc.genMooncake(this.mc.contexts.pattern, 1);
    }
    this.enter = () => {
        this.setup();
    }

    this.draw = () => {
        background(40);

        /* all this time/millis math is so the engine uses the right delta to
        update in realtime, but when we're recording, we just want the engine
        to take 1/60 of a second no matter what.

        const newT = millis();
        const newDelta = newT - this.t;
        const correction = newDelta / this.delta;
        this.t = newT;
        this.delta = newDelta;
        */

        Matter.Engine.update(this.engine, 1000 / 60);
        this.circles.forEach((circle, i) => {
            push();
            translate(circle.position.x, circle.position.y);
            rotate(circle.angle);
            // this.mc.genMooncake(this.mc.contexts.pattern, frameCount + 30 * i);
            this.mc.drawMooncake(0, 0, this.mc.contexts);
            pop();
        });

        push();
        noStroke();
        fill(255);
        this.floor.forEach((f) => {
            beginShape();
            f.vertices.forEach((v) => vertex(v.x, v.y))
            endShape();
        });
        pop();
    }
}
