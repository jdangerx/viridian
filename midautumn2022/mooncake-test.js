class Cloud {
    constructor(x, y, xRadius, yRadius) {
        this.x = x;
        this.y = y;
        this.xRadius = xRadius;
        this.yRadius = yRadius;
    }
}

NEW_CLOUDS = true;
SAVE_CLOUDS = false;

function MooncakeTest() {
    // just testing importing of mooncakes stuff for now
    this.setup = () => {
        this.bgImage = loadImage('images/clouds.png')

        // pink ish palette
        //this.bgColor = color(242, 201, 222);
        //this.bgCloudFillColor = color(255);
        //this.bgCloudStrokeColor = color(255, 210, 210);

        // blue ish palette
        this.bgColor = color(141, 208, 255);
        this.bgCloudFillColor = color(255);
        this.bgCloudStrokeColor = this.bgColor;

        // (255, 255, 255) * 0.5 + (200, 0, 0) * 0.5 => (228, 128, 128)
        // could maybe make a more robust alpha calculator
        // just using rgba(255, 255, 255, 0.5)leads to lots of little intersections that have been double-drawn

        this.t = millis();
        this.delta = 1000 / 60;
        let radius = grid * 0.8;
        this.engine = Matter.Engine.create();
        this.orbs = [];
        const orbOpts = {
            restitution: 0.9,
            friction: 0.8,
            frictionAir: 0.15
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

        this.activeClouds = [];

        const nClusters = 3;
        for (let i = 0; i < nClusters; i++) {
            const unit = width / nClusters;
            const jitter = noise(unit * i);
            const clusterCenter = { x: unit * i + jitter * unit, y: grid * 8 + jitter * grid };
            const cluster = this.cloudCluster(clusterCenter.x, clusterCenter.y, grid * 2.0, grid * 1.5, 2);
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

        if (NEW_CLOUDS) {
            bgClouds = this.newBackground();
            this.bgClouds = bgClouds;
        }
        if (SAVE_CLOUDS) {
            background(this.bgColor);
            bgClouds.forEach((cloud) => {
                this.drawCloud(cloud, grid * 0.3, this.bgCloudFillColor, this.bgCloudStrokeColor);
            });
            // after saving, have to move 'clouds.png' to images subdir
            save('clouds.png');
            // need to toggle this because otherwise we double-save as a side-effect of this.enter();
            SAVE_CLOUDS = false;
        }
    }

    this.newBackground = () => {
        const bgClusters = 5;
        const bgClouds = [];

        for (let i = 0; i < 2; i++) {
            const unit = width / bgClusters;
            const jitter = noise(unit * i);
            const clusterCenter = { x: unit * i + jitter * unit, y: grid * (3 + i) + jitter * grid };
            const cluster = this.cloudCluster(clusterCenter.x, clusterCenter.y, grid * 3, grid * 2, 2);
            bgClouds.push(...cluster);
        }
        for (let i = 0; i < 4; i++) {
            const unit = width / bgClusters;
            const jitter = noise(unit * i);
            const clusterCenter = { x: unit * i + jitter * unit, y: grid * (4 + i * 2) + jitter * grid };
            const cluster = this.cloudCluster(clusterCenter.x, clusterCenter.y, grid * 3, grid * 2, 2);
            bgClouds.push(...cluster);
        }

        for (let i = 0; i < bgClusters; i++) {
            const unit = width / bgClusters;
            const jitter = noise(unit * i);
            const clusterCenter = { x: unit * i + jitter * unit, y: grid * 6 + jitter * grid };
            const cluster = this.cloudCluster(clusterCenter.x, clusterCenter.y + i, grid * 3, grid * 2, 2);
            bgClouds.push(...cluster);
        }
        return bgClouds;
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
            for (let i = 0; i < 2; i++) {
                decay = random(0.7, 0.9);
                const xOffset = xRadius * random(0.6, 0.9) * Math.pow(-1, i);
                const yOffset = yRadius * random(-0.2, 0.5);
                clouds.push(...this.cloudCluster(
                    x + xOffset,
                    y + yOffset,
                    xRadius * decay,
                    yRadius * decay,
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
        if (NEW_CLOUDS) {
            background(this.bgColor);
            this.bgClouds.forEach((cloud) => {
                this.drawCloud(cloud, grid * 0.3, this.bgCloudFillColor, this.bgCloudStrokeColor);
            });
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

        this.activeClouds.forEach((cloud) => {
            this.drawCloud(cloud, grid * 0.3, this.bgCloudFillColor, this.bgCloudStrokeColor);
        });

    }
}
