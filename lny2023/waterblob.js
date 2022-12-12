function WaterBlob() {
    this.setup = () => {
        const size = 8;
        this.pattern = createGraphics(32 * size, 9 * size, WEBGL);
        this.pattern.background(0);
        this.pattern.noStroke();
        this.bunny = this.pattern.loadModel("images/bunny.obj");
        // todo: try blurring the pixels - you'll need a whole nother graphics context I think
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
        console.log(pixelValues.length);
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
        background(200, 150, 150);
        const pixVals = this.getPixelValues(pattern);
        noStroke();
        let phase, imageLoc;
        const numRows = 22;
        const barWidth = width / pattern.width | 0;
        for (let j = numRows; j > 0; j--) {
            for (let i = 0; i < width; i += barWidth) {
                phase = (i + frameCount) * 0.02 + 0.1;
                imageX = (1 - i / width) * pattern.width | 0;
                // if we have a bigger picture, what happens?
                yloc = (j - (0.5 + 0.5 * sin(phase))) / numRows;
                imageY = ((yloc * pattern.height) - 1) | 0;
                imageVal = pixVals[imageY][imageX];
                ysize = 0.005 + (0.04 * imageVal) + 0.002 * sin(phase * 2);
                fill(255);
                rect(i, height * (yloc - ysize / 2), barWidth, height * ysize);
            }
        }
    }

    this.draw = () => {

        const pattern = this.pattern;
        pattern.push();
        pattern.clear();
        pattern.pointLight(255, 255, 255, 0, 0, 20);
        pattern.strokeWeight(1);

        pattern.push();
        pattern.translate(0, -pattern.height / 4);
        pattern.translate(-0.2 * pattern.width, 0);
        pattern.scale(250);
        pattern.model(this.bunny);
        pattern.pop();

        pattern.push();
        pattern.translate(0, -pattern.height / 4);
        pattern.translate(0.2 * pattern.width, 0);
        pattern.scale(250);
        pattern.model(this.bunny);
        pattern.pop();

        pattern.pop();

        this.render(this.pattern);
        push();
        rotate(PI);
        image(pattern, width / 2, height / 2, this.pattern.width, this.pattern.height);
        pop();

    }
}
