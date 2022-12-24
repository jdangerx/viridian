function WhiteRabbit() {
    this.setup = () => {
        background(255, 255, 240);

    };
    this.draw = () => {
        fill(0, 0, 180);
        rect(0, 0, width, 0.15 * height);
        rect(0, 0.85 * height, width, 0.15 * height);

    };
}