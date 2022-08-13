class Cloud {
    constructor(x, y, xRadius, yRadius, collisionGroup) {
        this.x = x;
        this.y = y;
        this.xRadius = xRadius;
        this.yRadius = yRadius;
        this.collisionGroup = collisionGroup;
    }
}

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

        this.bgClouds = [];
        this.activeClouds = [];
        const bgClusters = 4;

        for (let i = 0; i < bgClusters; i++) {
            const unit = width / bgClusters;
            const jitter = noise(unit * i);
            const clusterCenter = { x: unit * i + jitter * unit, y: grid * 2 + jitter * grid };
            const cluster = this.cloudCluster(clusterCenter.x, clusterCenter.y, grid * 3, grid * 2, null, 2);
            this.bgClouds.push(...cluster);
        }

        const nClusters = 3;
        for (let i = 0; i < nClusters; i++) {
            const unit = width / nClusters;
            const jitter = noise(unit * i);
            const clusterCenter = { x: unit * i + jitter * unit, y: grid * 5 + jitter * grid };
            const cluster = this.cloudCluster(clusterCenter.x, clusterCenter.y, grid * 1.5, grid * 1.0, null, 2);
            this.activeClouds.push(...cluster);
        }

        const cloudOpts = { isStatic: true, restitution: 0.7 };
        const cloudBodies = this.activeClouds.map((cloud) =>
            this.matterEllipse(
                cloud.x,
                cloud.y,
                cloud.xRadius,
                cloud.yRadius,
                cloudOpts
            )
        );


        bodies = [...this.orbs, ...cloudBodies];
        Matter.Composite.add(this.engine.world, bodies);

        this.mc = new Mooncakes();
        this.mc._setup(2 * radius);

    }

    this.cloudCluster = (x, y, xRadius, yRadius, collisionGroup, nLevels) => {
        // bigger clouds in back
        // smaller clouds on side s.t. it will poke out a bit
        const clouds = [];
        baseCloud = new Cloud(
            x,
            y,
            xRadius,
            yRadius,
            collisionGroup
        );
        clouds.push(baseCloud);
        if (nLevels == 0) {
            return clouds;
        } else {
            for (let i = 0; i < 2; i++) {
                decay = random(0.7, 0.9);
                const xOffset = xRadius * random(0.6, 0.9) * Math.pow(-1, i);
                const yOffset = yRadius * random(-0.2, 0.5);
                clouds.push(...this.cloudCluster(
                    x + xOffset,
                    y + yOffset,
                    xRadius * decay,
                    yRadius * decay,
                    collisionGroup,
                    nLevels - 1
                ));
            }
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

    this.drawCloud = (cloud, stepSize, fillColor, strokeColor) => {
        push();
        stroke(strokeColor);
        strokeWeight(stepSize * 0.12);
        fill(fillColor);
        const cloudWidth = cloud.xRadius * 2;
        const cloudHeight = cloud.yRadius * 2;
        const numIters = (min(cloudWidth, cloudHeight) / stepSize + 0.8) | 0;
        for (let i = 0; i < numIters; i++) {
            ellipse(cloud.x, cloud.y, cloudWidth - i * stepSize, cloudHeight - i * stepSize);
        }
        pop();
    }

    this.draw = () => {
        background(200, 60, 60);

        utils.gridLines();

        this.bgClouds.forEach((cloud) => {
            this.drawCloud(cloud, grid * 0.3, color(200, 0, 0), color('rgba(255, 255, 255, 0.5)'));
        });


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

        this.activeClouds.forEach((cloud) => {
            this.drawCloud(cloud, grid * 0.3, color(200, 0, 0), color('rgba(255, 255, 255, 0.9)'));
        });

    }
}
