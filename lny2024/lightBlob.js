function LightBlob() {
    this.setup = () => {
        // to log stuff in console once:
        // this.realDraw(0);

        const scale3d = 8;
        this.ctx3d = createGraphics(32 * scale3d, 9 * scale3d, WEBGL);
        this.ctx3d.background(0);
        this.ctx3d.noStroke();
        this.model = this.ctx3d.loadModel("images/dragon.stl", true);
        this.camera = this.ctx3d.createCamera();
        // TODO: mess with the camera draw distance?
        this.camera.perspective(PI * 0.2);
        this.camera.setPosition(0, 0, 600);
    }

    this.draw = () => {
        const ctx3d = this.ctx3d;
        ctx3d.push();
        ctx3d.clear();

        ctx3d.pointLight(
            80, 80, 80, 1000, ctx3d.height * 0.5, 300
        );
        ctx3d.pointLight(
            80, 80, 80, -1000, -ctx3d.height * 0.5, 300
        );
        ctx3d.pointLight(
            120, 120, 120, 0, 0, 300
        );
        ctx3d.strokeWeight(1);

        this.addModel(
            ctx3d,
            360,
            0,
            150,
            frameCount * 0.005
        );
        this.addModel(
            ctx3d,
            120,
            0,
            150,
            frameCount * -0.005
        );
        this.addModel(
            ctx3d,
            -120,
            0,
            150,
            frameCount * 0.005
        );
        this.addModel(
            ctx3d,
            -360,
            0,
            150,
            frameCount * -0.005
        );
        ctx3d.pop();

        background(0);
        push();
        translate(-width * 0.0035, -width * 0.0035);
        fill(255, 255, 100);
        this.render(this.ctx3d);
        pop();

        push();
        translate(width * 0.0035, width * 0.0035);
        fill(255, 100, 255);
        this.render(this.ctx3d);
        pop();
        push();
        translate(width / 2, height / 2);
        rotate(PI);
        if (!IS_PROD) {
            //image(ctx3d, -width / 2, -height / 2, this.ctx3d.width, this.ctx3d.height);
        }
        pop();

    }

    this.addModel = (ctx, x, y, z, zr) => {
        ctx.push();
        ctx.translate(x, y, z);
        ctx.rotateX(-PI / 2);
        ctx.rotateZ(PI / 2);
        ctx.rotateZ(zr);
        ctx.scale(1);
        ctx.model(this.model);
        ctx.pop();
    }

    this.getPixelBrightness = (ctx) => {
        const pixDensity = ctx.pixelDensity();

        // this looks like a flat list of all the rgba values, so we iterate
        // across them 4 at a time, summing all RGB values for one pixel & then
        // normalizing them
        ctx.loadPixels();

        const w = ctx.width;
        const h = ctx.height;
        let pixelValues = [];
        for (let i = 0; i < ctx.pixels.length; i += 4) {
            pixelValues.push(ctx.pixels[i] + ctx.pixels[i + 1] + ctx.pixels[i + 2]);
        }
        pixelValues = pixelValues.map(x => x / (3 * 255));
        // go from 1D array to 2D array based on our width/height and pixDensity
        const pixelsChunked = [];
        for (let j = 0; j < h * pixDensity; j++) {
            pixelsChunked.push(pixelValues.slice(j * w * pixDensity, (j + 1) * w * pixDensity));
        }

        // due to pixel density funkiness, we may have to downsample.

        // this takes [1, 2, 3, 4] ==> [1.5, 3.5]
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

        // downsample the rows first, then transpose and downsample the
        // columns. then re-transpose to get back to original shape.

        const xDownsampled = pixelsChunked.map(row => averageEveryX(row, pixDensity));

        return transpose(transpose(xDownsampled).map(row => averageEveryX(row, pixDensity)));
    }

    this.render = (ctx) => {
        // Take a graphics context and draw boxes based on pixel brightness
        const pixBrightness = this.getPixelBrightness(ctx);
        noStroke();
        let phase;
        const numRows = 32;
        const barWidth = width / ctx.width | 0;
        for (let j = numRows; j > 0; j--) {
            for (let i = 0; i < width; i += barWidth) {
                phase = ((i + frameCount) * 0.02 + 0.1) * ctx.width / width * 5;
                imageX = (1 - (i + 1) / width) * ctx.width | 0;
                yloc = (j - (0.5 + 0.5 * sin(phase))) / numRows;
                imageY = ((yloc * ctx.height) - 1) | 0;
                brightness = pixBrightness[imageY][imageX];
                if (brightness != 0) {
                    ysize = 0.005 + (0.04 * brightness) + 0.002 * sin(phase * 2 + 0.5 * sin(5 * yloc + frameCount * 0.05));
                    rect(i, height * (yloc - ysize / 2), barWidth, height * ysize);
                }
            }
        }
    }

}
