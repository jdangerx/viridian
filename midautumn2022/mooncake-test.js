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
        this.bgImage = loadImage('images/clouds.png');
        this.bgTexture = loadImage('images/parchment.jpg');

        // blue ish palette
        this.bgFill = color(141, 208, 255);
        this.bgStroke = color(138, 205, 252);
        this.cloudFill = color(230, 240, 255);
        this.cloudStroke = color(191, 218, 255);

        this.t = millis();
        this.delta = 1000 / 60;
        let radius = grid * 0.8;
        this.engine = Matter.Engine.create();
        this.orbs = [];
        const orbOpts = {
            restitution: 0.9,
            friction: 100,
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
            const y = -(i - 1) * 2 * grid; // line em up so we come in in a stream
            orb = Matter.Bodies.polygon(x, y, 12, radius * 1.30, orbOpts);
            orb.resets = 0;
            this.orbs.push(orb);
        }

        const cloudOpts = {
            restitution: 0.7,
            friction: 100,
            collisionFilter: { category: 0x01, mask: 0x10 },
            label: 'cloud'
        };

        const activeClusterCenters = [
            { x: 1.5, y: 4.5, w: 3.1, h: 2.1 },
            { x: 14, y: 8.0, w: 3.3, h: 2.4 },
            { x: 28, y: 7.5, w: 3.0, h: 1.9 },
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
                    stiffness: 0.02,
                    damping: 1.0,
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
            background(this.bgFill);
            this.bgClusters.forEach(this.drawCluster);
            // after saving, have to move 'clouds.png' to images subdir
            save('clouds.png');
            // need to toggle this because otherwise we double-save as a side-effect of this.enter();
            SAVE_CLOUDS = false;
        }


        // debug renderer

        this.render = Matter.Render.create({
            element: document.body,
            engine: this.engine,
            options: {
                width: 32 * grid,
                height: 9 * grid
            }
        });
        Matter.Render.run(this.render);
        console.log(this.render);

    }

    this.genClusters = (clusterCenters) =>
        clusterCenters.map(({ x, y, w, h }) =>
            this.cloudCluster(grid * x, grid * y, grid * w, grid * h, 3)
        );

    this.newBackground = () => {
        clusterCenters = [
            { x: 1, y: 3, w: 3, h: 2.5 },
            { x: 2, y: 7, w: 3, h: 2.5 },
            { x: 7, y: 6, w: 3, h: 2.5 },
            { x: 7, y: 9, w: 3, h: 2.5 },
            { x: 15, y: 7, w: 3.5, h: 2.7 },
            { x: 23, y: 7, w: 3, h: 2.0 },
            { x: 29, y: 6, w: 3, h: 2.0 },
            { x: 29, y: 9, w: 3, h: 2.0 },
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
        if (this.render) {
            this.render.canvas.remove();

        }
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

    this.drawCloud = (cloud, stepSize, fillColor, strokeColor, weightRatio) => {
        push();
        stroke(strokeColor);
        weight = weightRatio !== undefined ? stepSize * weightRatio : stepSize * 0.12;
        strokeWeight(weight);
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
            this.drawCloud(
                cloud,
                grid * 0.7,
                this.cloudFill,
                this.cloudStroke,
                0.12
            );
        });
    }

    this.orientalTexture = (radius) => {
        const rowHeight = radius * sin(TAU / 12);
        const nRows = height / rowHeight + 1;
        const nCols = width / radius + 1;
        for (let i = 0; i < nRows; i++) {
            for (let j = 0; j < nCols; j += 2) {
                const y = i * rowHeight;
                const x = (j + i % 2) * radius;
                const cloud = new Cloud(x, y, radius, radius);
                this.drawCloud(cloud, 0.4 * radius, this.bgFill, this.bgStroke, 0.2);
            }
        }
    }

    this.draw = () => {
        if (NEW_CLOUDS) {
            background(this.bgFill);
            this.orientalTexture(1.0 * grid);
            // utils.gridLines();

            this.bgClusters.forEach(this.drawCluster);
        } else {
            image(this.bgImage, 0, 0, width, height);
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
            translate(orb.position.x + this.mc.contexts.side.width * 0.03, orb.position.y + this.mc.contexts.side.width * 0.05);
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
