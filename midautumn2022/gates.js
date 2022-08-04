function Gates() {
    // just testing importing of mooncakes stuff for now
    this.setup = () => {
        this.size = 100;
        this.mc = new Mooncakes();
        this.mc._setup(this.size);
    }

    this.draw = () => {
        background(40);

        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 5; j++) {
                const x = i * this.size * 1.5;
                const y = j * this.size * 1.5;
                const fc = frameCount + noise(x, y) * 100;
                this.mc.genMooncake(this.mc.contexts.pattern, fc);
                this.mc.drawMooncake(x, y, this.mc.contexts);
            }
        }
    }
}