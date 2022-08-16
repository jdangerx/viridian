class Cloud {
    constructor(x, y, xRadius, yRadius) {
        this.position = { x: x, y: y };
        this.xRadius = xRadius;
        this.yRadius = yRadius;
    }
}

NEW_CLOUDS = true;
// set SAVE_CLOUDS to true in the console and re-enter the scene to trigger cloud-save
SAVE_CLOUDS = false;

function MooncakeTest() {
    // just testing importing of mooncakes stuff for now
    this.setup = () => {
        this.bgImage = loadImage('images/clouds.png')

        // blue ish palette
        this.bgColor = color(141, 208, 255);
        this.bgCloudFillColor = color(240, 240, 255);
        this.bgCloudStrokeColor = color(171, 198, 245);

        this.t = millis();
        this.delta = 1000 / 60;
        let radius = grid * 0.8;
        this.engine = Matter.Engine.create();
        this.orbs = [];
        const orbOpts = {
            restitution: 0.9,
            friction: 10,
            frictionAir: 0.15,
            collisionFilter: {
                category: 0x10,
                mask: 0x11,
            },
            label: 'mooncake',
            density: 0.01,
        }
        nOrbs = 8;
        for (let i = 0; i < nOrbs; i++) {
            const x = random(2 * grid, 30 * grid);
            const y = -i * 5 * grid; // line em up so we come in in a stream
            orb = Matter.Bodies.circle(x, y, radius * 1.3, orbOpts);
            orb.resets = 0;
            this.orbs.push(orb);
        }

        const cloudOpts = {
            restitution: 0.7,
            friction: 10,
            collisionFilter: { category: 0x01, mask: 0x10 },
            label: 'cloud'
        };

        const activeClusterCenters = [
            { x: 3, y: 5.5, w: 2.9, h: 1.9 },
            { x: 15.5, y: 7.5, w: 3.1, h: 2.2 },
            { x: 28, y: 6.5, w: 2.8, h: 1.7 },
        ]
        const activeClusters = this.genClusters(activeClusterCenters);
        this.activeClusters = activeClusters.map((cluster) =>
            cluster.map((cloud) =>
                this.matterEllipse(cloud.position.x,
                    cloud.position.y,
                    cloud.xRadius,
                    cloud.yRadius,
                    cloudOpts
                )
            )
        );

        // maybe we don't need the flatmap if all the constraints live *inside* the cluster ;)
        cloudBodies = this.activeClusters.flatMap((x) => x);

        const cloudSprings = cloudBodies.flatMap((body) => {
            const dxs = [body.xRadius * 0.5, body.xRadius * -0.5];
            return dxs.map((dx) =>
                Matter.Constraint.create({
                    bodyA: body,
                    pointA: Matter.Vector.create(dx, 0),
                    pointB: Matter.Vector.create(body.position.x + dx, body.position.y),
                    stiffness: 0.05,
                    damping: 0.5,
                }))
        });

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


        // debug renderer

        const render = Matter.Render.create({
            element: document.body,
            engine: this.engine,
            options: {
                width: 32 * grid,
                height: 9 * grid
            }
        });
        Matter.Render.run(render);

    }

    this.genClusters = (clusterCenters) =>
        clusterCenters.map(({ x, y, w, h }) =>
            this.cloudCluster(grid * x, grid * y, grid * w, grid * h, 3)
        );

    this.newBackground = () => {
        clusterCenters = [
            // { x: 2, y: 5, w: 2, h: 1.5 },
        ];
        return this.genClusters(clusterCenters);
    }

    this.cloudCluster = (x, y, xRadius, yRadius, nLevels) => {
        const clouds = [];
        let yOffset = 0;
        for (let i = 0; i < nLevels; i++) {
            let xOffset = xRadius * random(0.6, 0.8);
            for (let j = 0; j <= i; j++) {
                const decay = random(0.86, 0.91) ** i;
                const xStart = x - xOffset * i * decay;
                cloud = new Cloud(
                    xStart + xOffset * 2 * j * decay,
                    y + yOffset * random(0.9, 1.1),
                    xRadius * decay,
                    yRadius * decay
                );
                clouds.push(cloud);
            }
            yOffset += yRadius * (random(0.2, 0.25));
        }
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
            this.drawCloud(cloud, grid * 0.3, this.bgCloudFillColor, this.bgCloudStrokeColor);
        });
    }

    this.draw = () => {
        if (NEW_CLOUDS) {
            background(this.bgColor);
            this.bgClusters.forEach(this.drawCluster);
        } else {
            image(this.bgImage, 0, 3 * grid, width, height);
        }


        Matter.Engine.update(this.engine, 1000 / 60);
        this.orbs.forEach((orb) => {
            if (orb.position.y > 12 * grid) {
                orb.resets += 1;
                if (orb.resets > Infinity) {
                    Matter.Composite.remove(this.engine.world, orb);
                }
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
