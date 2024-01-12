function WaterBlob() {
    this.setup = () => {
        const size = 8;
        this.pattern = createGraphics(32 * size, 9 * size, WEBGL);
        this.pattern.background(0);
        this.pattern.noStroke();
        this.bunny = this.pattern.loadModel("images/dragon.stl", true);
        this.camera = this.pattern.createCamera();
        this.camera.perspective(PI * 0.2);
        // todo: try blurring the pixels - you'll need a whole nother graphics context I think

        this.drawOnce = false;
    }

    this.getPixelValues = (graphics) => {
        const pixDensity = graphics.pixelDensity();
        graphics.loadPixels();
        const w = graphics.width;
        const h = graphics.height;

        let pixelValues = [];
        for (let i = 0; i < graphics.pixels.length; i += 4) {
            pixelValues.push(graphics.pixels[i] + graphics.pixels[i + 1] + graphics.pixels[i + 2]);
        }
        pixelValues = pixelValues.map(x => x / (3 * 255));
        const pixelsChunked = [];
        for (let j = 0; j < h * pixDensity; j++) {
            pixelsChunked.push(pixelValues.slice(j * w * pixDensity, (j + 1) * w * pixDensity));
        }

        const averageEveryX = (arr, x) => {
            return arr.reduce((acc, val, i) => {
                let ret = val;
                ii = i % x;
                if (ii !== 0) {
                    ret = (acc.pop() * ii + val) / (ii + 1)
                }
                acc.push(ret);
                return acc;
            }, []);
        }

        const transpose = (arr) => {
            let xsize = arr[0].length;
            transposed = [];
            for (let i = 0; i < xsize; i++) {
                transposed.push(arr.map(row => row[i]));
            }
            return transposed;
        }

        const xDownsampled = pixelsChunked.map(row => averageEveryX(row, pixDensity));

        return transpose(transpose(xDownsampled).map(row => averageEveryX(row, pixDensity)));
    }

    this.render = (pattern) => {
        const pixVals = this.getPixelValues(pattern);
        noStroke();
        let phase;
        const numRows = 32;
        const barWidth = width / pattern.width | 0;
        for (let j = numRows; j > 0; j--) {
            for (let i = 0; i < width; i += barWidth) {
                phase = ((i + frameCount) * 0.02 + 0.1) * pattern.width / width * 5;
                imageX = (1 - (i + 1) / width) * pattern.width | 0;
                yloc = (j - (0.5 + 0.5 * sin(phase))) / numRows;
                imageY = ((yloc * pattern.height) - 1) | 0;
                imageVal = pixVals[imageY][imageX];
                if (imageVal != 0) {
                    ysize = 0.005 + (0.04 * imageVal) + 0.002 * sin(phase * 2 + 0.5 * sin(5 * yloc + frameCount * 0.05));
                    rect(i, height * (yloc - ysize / 2), barWidth, height * ysize);
                }
            }
        }
    }

    this.draw = () => {
        if (this.drawOnce) {
            // useful for spitting out console logs without overwhelming the browser
            this.draw = () => null
        }

        const pattern = this.pattern;
        this.camera.setPosition(0, 0, 600);
        pattern.push();
        pattern.clear();
        pattern.pointLight(
            80, 80, 80, 1000, pattern.height * 0.5, 300
        );
        pattern.pointLight(
            80, 80, 80, -1000, -pattern.height * 0.5, 300
        );
        pattern.pointLight(
            120, 120, 120, 0, 0, 300
        );
        pattern.strokeWeight(1);

        this.makeBun(
            360,
            0,
            150,
            frameCount * 0.01
        );

        this.makeBun(
            120,
            0,
            150,
            frameCount * 0.01
        );

        this.makeBun(
            -120,
            0,
            150,
            -frameCount * 0.01
        );

        this.makeBun(
            -360,
            0,
            150,
            -frameCount * 0.01
        );

        pattern.pop();

        background(0);
        push();
        translate(-width * 0.0035, -width * 0.0035);
        fill(255, 255, 100);
        this.render(this.pattern);
        pop();

        push();
        translate(width * 0.0035, width * 0.0035);
        fill(255, 100, 255);
        this.render(this.pattern);
        pop();
        push();
        translate(width / 2, height / 2);
        rotate(PI);
        if (!IS_PROD) {
            image(pattern, -width / 2, -height / 2, this.pattern.width, this.pattern.height);
        }
        pop();

    }

    this.makeBun = (x, y, z, zr) => {
        this.pattern.push();
        this.pattern.translate(x, y, z);
        this.pattern.rotateX(-3.14 / 2);
        this.pattern.rotateZ(3.14 / 2);
        this.pattern.rotateZ(zr);
        this.pattern.scale(1);
        this.pattern.model(this.bunny);
        this.pattern.pop();
    }
}
