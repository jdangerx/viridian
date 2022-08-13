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
            const y = 20 * grid; // start below the world so we immediately reset with chaos
            this.orbs.push(
                Matter.Bodies.circle(x, y, radius * 1.3, orbOpts),
            )
            this.orbs.push(
                Matter.Bodies.circle(x, y - 200, radius * 1.3, orbOpts),
            )
        }

        this.floor = [];
        const nClusters = 3;

        for (let i = 0; i < nClusters; i++) {
            const unit = width / nClusters;
            const jitter = noise(unit * i);
            const clusterCenter = { x: unit * i + jitter * unit, y: grid * 5 + jitter * grid };
            const cluster = this.cloudCluster(clusterCenter.x, clusterCenter.y, 3);
            this.floor.push(...cluster);
        }
        bodies = [...this.orbs, ...shuffle(this.floor)];
        Matter.Composite.add(this.engine.world, bodies);

        this.mc = new Mooncakes();
        this.mc._setup(2 * radius);

    }

    this.cloudCluster = (x, y, nLevels) => {
        const cloudOpts = { isStatic: true, restitution: 0.7 };
        // bigger clouds in back
        // smaller clouds on side s.t. it will poke out a bit
        xRadius = 2 * grid;
        yRadius = 1.5 * grid;
        decay = 0.9;
        const clouds = [];
        baseCloud = this.matterEllipse(
            x,
            y,
            xRadius,
            yRadius,
            cloudOpts
        );
        clouds.push(baseCloud);
        for (let i = 0; i < 2; i++) {
            ratio = random(0.7, 0.9);
            const xOffset = xRadius * random(0.4, 0.7) * Math.pow(-1, i);
            const yOffset = yRadius * random(-0.2, 0.5);
            const cloud = this.matterEllipse(
                x + xOffset,
                y + yOffset,
                xRadius * Math.pow(decay, i + 2),
                yRadius * ratio * Math.pow(decay, i + 1),
                cloudOpts
            );
            clouds.push(cloud);
        }
        return clouds;
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

    this.drawCloud = (x, y, width, height, stepSize) => {
        push();
        stroke(255);
        strokeWeight(stepSize * 0.1);
        fill(200, 0, 0);
        const numIters = (min(width, height) / stepSize + 0.8) | 0;
        for (let i = 0; i < numIters; i++) {
            ellipse(x, y, width - i * stepSize, height - i * stepSize);
        }
        pop();
    }

    this.draw = () => {
        background(200, 60, 60);

        utils.gridLines('white');

        Matter.Engine.update(this.engine, 1000 / 60);
        this.orbs.forEach((orb) => {
            if (orb.position.y > 12 * grid) {
                Matter.Body.setPosition(orb, createVector(random() * grid * 32, (random() + 0.5) * -4 * grid));
                Matter.Body.applyForce(orb, createVector(grid * 16, 0), createVector(0.4 * (random() - 0.5), 0));
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
            this.drawCloud(cloud.position.x, cloud.position.y, cloud._width, cloud._height, grid * 0.3);
        });
    }
}
