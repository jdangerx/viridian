function MatterTest() {
    // just testing importing of mooncakes stuff for now
    this.setup = () => {
        this.t = millis();
        this.delta = 1000 / 60;
        let radius = grid * 0.5;
        this.engine = Matter.Engine.create();
        this.orbs = [];
        const orbOpts = {
            restitution: 0.9,
            friction: 0.8,
            frictionAir: 0.05
        }
        for (let i = 0; i < 10; i++) {
            const x = (i + 1) * width / 7;
            const y = 200 * noise(x) - 300
            this.orbs.push(
                Matter.Bodies.circle(x, y, radius * 1.3, orbOpts),
            )
            this.orbs.push(
                Matter.Bodies.circle(x, y - 200, radius * 1.3, orbOpts),
            )
        }
        const floorOpts = { isStatic: true, restitution: 0.7 };

        this.floor = [];
        const nClusters = 3;
        for (let i = 0; i < nClusters; i++) {
            const unit = width / nClusters;
            const jitter = noise(unit * i);
            const clusterCenter = { x: unit * i + jitter * unit, y: grid * 8 + jitter * grid };
            for (let j = 0; j < 8; j++) {
                xSize = grid * (1 + random());
                ratio = (0.4 + 0.2 * random());
                const cloud = this.matterEllipse(
                    clusterCenter.x + random() * 2 * grid,
                    clusterCenter.y + random() * grid,
                    xSize,
                    xSize * ratio,
                    floorOpts
                );
                this.floor.push(cloud);
            }
        }

        for (let i = 0; i < nClusters; i++) {
            const unit = width / nClusters;
            const jitter = noise(unit * i);
            const clusterCenter = { x: unit * (i + 0.5) + jitter * unit, y: grid * 5 + jitter * grid };
            for (let j = 0; j < 8; j++) {
                xSize = grid * (1 + random());
                ratio = (0.4 + 0.2 * random());
                const cloud = this.matterEllipse(
                    clusterCenter.x + random() * 2 * grid,
                    clusterCenter.y + random() * grid,
                    xSize,
                    xSize * ratio,
                    floorOpts
                );
                this.floor.push(cloud);
            }
        }
        bodies = [...this.orbs, ...shuffle(this.floor)];
        Matter.Composite.add(this.engine.world, bodies);

        this.mc = new Mooncakes();
        this.mc._setup(2 * radius);

    }

    this.enter = () => {
        Matter.Composite.clear(this.engine.world);
        this.setup();
    }

    this.matterEllipse = (x, y, xRad, yRad, opts) => {
        const circ = Matter.Bodies.circle(x, y, xRad, opts);
        circ._width = xRad * 2;
        circ._height = yRad * 2;
        const yscale = yRad / xRad;
        Matter.Body.scale(circ, 1, yscale);
        return circ;
    }

    this.cloud = (x, y, width, height, stepSize) => {
        push();
        stroke(255);
        strokeWeight(stepSize * 0.1);
        fill(200, 0, 0);
        const numIters = (min(width, height) / stepSize + 1) | 0;
        for (let i = 0; i < numIters; i++) {
            ellipse(x, y, width - i * stepSize, height - i * stepSize);
        }
        pop();
    }

    this.draw = () => {
        background(200, 60, 60);
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
        this.orbs.forEach((orb) => {
            if (orb.position.y > 12 * grid) {
                Matter.Body.setPosition(orb, createVector(random() * grid * 12 + 10 * grid, -4 * grid));
                Matter.Body.applyForce(orb, createVector(grid * 16, 0), createVector(0.3 - random() * 0.6, 0));
            }
        })
        this.orbs.forEach((orb, i) => {
            push();
            translate(orb.position.x, orb.position.y + this.mc.contexts.side.width / 10);
            rotate(orb.angle);
            this.mc.drawSide(0, 0, this.mc.contexts);
            pop();
        });

        this.orbs.forEach((orb, i) => {
            push();
            translate(orb.position.x, orb.position.y);
            rotate(orb.angle);
            // this.mc.genMooncake(this.mc.contexts.pattern, frameCount + 30 * i);
            this.mc.drawMooncake(0, 0, this.mc.contexts);
            pop();
        });

        this.floor.forEach((cloud) => {
            this.cloud(cloud.position.x, cloud.position.y, cloud._width, cloud._height, width * 0.02);
        });
    }
}
