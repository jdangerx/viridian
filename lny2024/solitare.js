function Solitare() {
    const Y_AXIS = 1;
    const X_AXIS = 2;
    var n = 4;
    let logo1;
    let logoCopy;
    let colorBG = color(23, 44.2, 94.1, 255);



    this.setup = () => {
        noStroke();
        logo1 = loadImage('images/Dusse_Logo_wCross_horizontal.png');
        logoCopy = createGraphics(1000, 1000);
        background(0);
}

    this.draw = () => {        
        // (ctx, x, y, color, glowStrokeWidth, size)
        logoCopy.image(logo1, 0, 0, logo1.width*0.1, logo1.height*0.1);
        logoCopy.tint(0);

        let locX = frameCount;
        let locY = sin(frameCount*0.1) * 150;

        utils.drawWithOutline(logoCopy, locX, locY, colorBG, 10, logoCopy.width, logoCopy.height);
        //utils.drawWithOutline(logo1, 0, 0, colorBG, 10, logo1.width * 0.1, logo1.height * 0.1);
    }
}
