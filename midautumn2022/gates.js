function Gates() {
    // just testing importing of mooncakes stuff for now
    this.setup = () => {
        this.mc = new Mooncakes();
        // this is kind of janky to keep a whole Mooncakes 
        this.mc.setup();
    }

    this.draw = () => {
        background(40);
        this.mc.genMooncake(this.mc.contexts.pattern, frameCount);
        this.mc.drawMooncake(mouseX, mouseY, this.mc.contexts);

        this.mc.genMooncake(this.mc.contexts.pattern, frameCount * 2);
        this.mc.drawMooncake(mouseX - 100, mouseY - 100, this.mc.contexts);
    }
}