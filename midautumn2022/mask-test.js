function MaskTest() {
    let myImage;
    this.setup = () => {

        myImage = loadImage('paper.jpg');
        createCanvas(400, 400);      
        circleMask = createGraphics(128, 128);
    }

    this.enter = () => {
    }
      
    this.draw = () => {
        background(0);
      
        circleMask.fill('rgba(0, 0, 0, 1)');
      
        circleMask.circle(64, 64, 128);
      
        myImage.mask(circleMask);
      
        image(myImage, -64, -64, 128, 128);

    }

    this.drawMoon = function (x, y, a, light_color, dark_color) {
        noStroke();

        let color1 = color(0, 25, 25, 0); //red
        let color2 = color(0, 25, 25, 0); //gray
        let color3 = color(0, 25, 25, 0); //blue
        let color4 = color(0, 25, 25, 0); //green

        if (-Math.PI / 2 < a && a < 0) {
            color3 = light_color;
            color4 = light_color;
            color1 = light_color;
            color2 = dark_color;
        } else if (-Math.PI < a && a < -Math.PI / 2) {
            color1 = light_color;
            color3 = dark_color;
            color4 = dark_color;
            color2 = dark_color;
        } else if (-3 * Math.PI / 2 < a && a < -Math.PI) {
            color4 = dark_color;
            color2 = light_color;
            color1 = dark_color;
            color3 = dark_color;
        } else if (-2 * Math.PI < a && a < -3 * Math.PI / 2) {
            color4 = light_color;
            color3 = light_color;
            color1 = dark_color;
            color2 = light_color;
        } else {
            color3 = light_color;
            color4 = light_color;
            color1 = light_color;
            color2 = dark_color;
        }

        fill(color1);
        arc(x, y, d, d, PI / 2, 3 * PI / 2);
        fill(color2);
        arc(x, y, d + 1, d + 1, 3 * PI / 2, PI / 2);

        let heightPhase = d;
        let widthPhase = map(Math.cos(a), 0, 1, 0, d);

        fill(color3);
        arc(x, y, widthPhase - 2, d + 1, PI / 2, 3 * PI / 2);
        fill(color4);
        arc(x, y, widthPhase - 2, d + 1, 3 * PI / 2, PI / 2)
    }
}
