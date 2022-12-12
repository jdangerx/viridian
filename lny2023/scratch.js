function Scratch() {
    this.setup = () => {
        this.pattern = createGraphics(128, 36, WEBGL);
        this.pattern.background(0);
        this.pattern.noStroke();
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
                imageX = i / width * pattern.width | 0;
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
        pattern.pointLight(250, 250, 250, 50, 50, 50)
        pattern.pointLight(250, 250, 250, -50, -20, 0)
        pattern.strokeWeight(0.5);
        pattern.clear();
        pattern.background(10 + 10 * (1 + sin(frameCount * 0.1)));
        pattern.fill(255);
        pattern.rotateX(Math.PI * sin(frameCount * 0.01));
        pattern.rotateY(Math.PI * sin(frameCount * 0.01));
        pattern.torus(16, 4, 12, 8);
        pattern.pop();

        this.render(this.pattern);
        image(pattern, 0, 0, 128, 36);

    }
}
