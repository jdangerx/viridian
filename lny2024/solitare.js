function Solitare() {
    const Y_AXIS = 1;
    const X_AXIS = 2;
    var n = 4;
    let logo1;
    let logoCopy;
    let buffer;
    let background_pic;
    let colorBG = color(23, 44.2, 94.1, 255);
    let offset1;
    let offset2;


    this.setup = () => {
        noStroke();
        logo1 = loadImage('images/dusse-cross-white-pink-stroke.png');
        background_pic = loadImage('images/filled_screen.png');
        logoCopy = createGraphics(1000, 1000);
        buffer = createGraphics(width*3, height*3); 
        buffer.background(0, 0, 0, 0);
        noiseDetail(2, 1.0);

        offset1 = 0;
        offset2 = 0;     
    }

    this.draw = () => {        
        background(0);
        // (ctx, x, y, color, glowStrokeWidth, size)
        logoCopy.image(logo1, 0, 0, logo1.width*0.1, logo1.height*0.1);
        logoCopy.tint(255);

        var r = 100 + (sin(frameCount*0.001))*height/2;
        var angle = frameCount*0.05;
        var angle2 = (noise(frameCount*0.01)) * 2*PI;
        offset1 += (noise(0.5*angle)-0.5);
        offset2 += (noise(0.5*angle+10)-0.5);

        offset1 = constrain(offset1, -2, 2);
        offset2 = constrain(offset2, -2, 2);

        //var x = r * (sin(angle) + offset1 * 0.2);
        //var y = r * (cos(angle) + offset2 * 0.2);

        var x = r * sin(angle) + r * sin(angle2);
        var y = r * cos(angle) + r * cos(angle2);

        //locX += (noise(0.15 * frameCount) - 0.5) * 30;
        //locY += (noise(0.15 * frameCount + 100) - 0.5) * 30;

        image(background_pic, 0, 0, width, height);
        buffer.image(logoCopy, buffer.width*0.35 + x, buffer.height*0.35 + y, logoCopy.width, logoCopy.height);
        buffer.image(logoCopy, buffer.width*0.35 + width/2 + x, buffer.height*0.35 + y, logoCopy.width, logoCopy.height);
        image(buffer, -width-x, -height-y, width*3, height*3);
        //utils.drawWithOutline(logo1, 0, 0, colorBG, 10, logo1.width * 0.1, logo1.height * 0.1);
    }
}
