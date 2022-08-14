class Cloud {
    constructor(x, y, xRadius, yRadius) {
        this.position = { x: x, y: y };
        this.xRadius = xRadius;
        this.yRadius = yRadius;
    }
}

NEW_CLOUDS = false;
// set SAVE_CLOUDS to true in the console and re-enter the scene to trigger cloud-save
SAVE_CLOUDS = false;

function MooncakeTest() {
    // just testing importing of mooncakes stuff for now
    this.setup = () => {
        this.bgImage = loadImage('images/clouds.png')

        // blue ish palette
        this.bgColor = color(141, 208, 255);
        this.bgCloudFillColor = color(240, 240, 255);
        this.bgCloudStrokeColor = this.bgColor;

        this.t = millis();
        this.delta = 1000 / 60;
        let radius = grid * 0.8;
        this.engine = Matter.Engine.create();
        this.orbs = [];
        const orbOpts = {
            restitution: 0.9,
            friction: 0.5,
            frictionAir: 0.15,
            collisionFilter: {
                category: 0x10,
                mask: 0x11,
            },
            label: 'mooncake',
            density: 0.003,
        }
        for (let i = 0; i < 3; i++) {
            const x = (i + 1) * width / 7;
            const y = 20 * grid; // start below the world so we immediately reset with chaos
            this.orbs.push(
                Matter.Bodies.circle(x, y, radius * 1.3, orbOpts),
            )
            this.orbs.push(
                Matter.Bodies.circle(x, y - 200, radius * 1.3, orbOpts),
            )
        }

        this.activeClusters = [];

        clusterX = (t) => 5 * grid + 10 * grid * t + noise(t) * grid;
        clusterY = (t) => 4 * grid + grid * t + 0.5 * noise(t) * grid;
        const nClusters = 3;
        const cloudOpts = {
            restitution: 0.7,
            friction: 0.7,
            collisionFilter: { category: 0x01, mask: 0x10 },
            label: 'cloud'
        };
        for (let i = 0; i < nClusters; i++) {
            const clusterCenter = { x: clusterX(i), y: clusterY(i) };
            const cluster = this.cloudCluster(clusterCenter.x, clusterCenter.y, grid * 2.0, grid * 1.5, 2);
            const bodies = cluster.map((cloud) =>
                this.matterEllipse(cloud.position.x,
                    cloud.position.y,
                    cloud.xRadius,
                    cloud.yRadius,
                    cloudOpts
                )
            );
            this.activeClusters.push(bodies);
        }

        cloudBodies = this.activeClusters.flatMap((x) => x);

        const cloudSprings = cloudBodies.map((body) =>
            Matter.Constraint.create({
                bodyA: body,
                pointB: Matter.Vector.create(body.position.x, body.position.y),
                stiffness: 0.01,
                damping: 0.1
            })
        )


        bodies = [...this.orbs, ...cloudBodies];

        Matter.Composite.add(this.engine.world, bodies);
        Matter.Composite.add(this.engine.world, cloudSprings);

        this.mc = new Mooncakes();
        this.mc._setup(2 * radius);

        if (NEW_CLOUDS) {
            this.bgClusters = this.newBackground();
        }
        if (SAVE_CLOUDS) {
            background(this.bgColor);
            this.bgClusters.forEach(this.drawCluster);
            // after saving, have to move 'clouds.png' to images subdir
            save('clouds.png');
            // need to toggle this because otherwise we double-save as a side-effect of this.enter();
            SAVE_CLOUDS = false;
        }
    }

    this.newBackground = () => {
        const bgClusters = [];

        clusterX = (t) => 3 * grid + 8 * grid * t + noise(t) * grid;
        clusterY = (t) => 2 * grid + grid * t + 0.5 * noise(t) * grid;

        const nClusters = 4;
        for (let i = 0; i < nClusters; i++) {
            const clusterCenter = { x: clusterX(i), y: clusterY(i) };
            const cluster = this.cloudCluster(clusterCenter.x, clusterCenter.y, grid * 3, grid * 2, 2);
            bgClusters.push(cluster);
        }
        return bgClusters;
    }

    this.cloudCluster = (x, y, xRadius, yRadius, nLevels) => {
        // bigger clouds in back
        // smaller clouds on side s.t. it will poke out a bit
        const clouds = [];
        baseCloud = new Cloud(
            x,
            y,
            xRadius,
            yRadius
        );
        clouds.push(baseCloud);
        if (nLevels == 0) {
            return clouds;
        } else {
            const xOffset = xRadius * random(0.6, 0.9);
            const yOffset = yRadius * (random(-0.2, 0.3) + nLevels * 0.15);
            for (let i = 0; i < 2; i++) {
                decay = random(0.8, 0.9);
                clouds.push(...this.cloudCluster(
                    x + xOffset * Math.pow(-1, i),
                    y + yOffset,
                    xRadius * decay,
                    yRadius * decay,
                    nLevels - 1
                ));
            }
        }
        clouds.sort((c1, c2) => c1.y - c2.y);
        return clouds;
    }

    this.enter = () => {
        Matter.Composite.clear(this.engine.world);
        this.setup();
    }

    this.matterEllipse = (x, y, xRad, yRad, opts) => {
        const circ = Matter.Bodies.circle(x, y, xRad, opts);
        circ.xRadius = xRad;
        circ.yRadius = yRad;
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
            ellipse(cloud.position.x, cloud.position.y, cloudWidth - i * stepSize, cloudHeight - i * stepSize);
        }
        pop();
    }

    this.drawCluster = (cluster) => {
        cluster.forEach((cloud) => {
            // pull the shadow into its own forEach if you want to do the shadow on a per-cluster basis
            const shadow = new Cloud(cloud.position.x + grid * 0.08, cloud.position.y + grid * 0.05, cloud.xRadius, cloud.yRadius);
            this.drawCloud(shadow, grid * 0.3, color('rgba(160, 160, 200, 0.5)'), color('rgba(160, 160, 200, 0.5)'));
            this.drawCloud(cloud, grid * 0.3, this.bgCloudFillColor, this.bgCloudStrokeColor);
        });
    }

    this.draw = () => {
        if (NEW_CLOUDS) {
            background(this.bgColor);
            this.bgClusters.forEach(this.drawCluster)
        } else {
            image(this.bgImage, 0, 0, width, height);
        }


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

        this.activeClusters.forEach(this.drawCluster);

    }
}
