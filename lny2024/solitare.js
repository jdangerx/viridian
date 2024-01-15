function Solitare() {
    const Y_AXIS = 1;
    const X_AXIS = 2;
    var n = 4;
    let logo1;
    let logoCopy;
    let buffer;
    let logoBuffer;
    let background_pic;
    let colorBG = color(23, 44.2, 94.1, 255);
    let offset1;
    let offset2;
    let unit = width/32;


    this.setup = () => {
        noStroke();
        //logo1 = loadImage('images/dusse-cross-text-white-pink.png');
        //logo2 = loadImage('images/dusse-all-text-white.png');
        //background_pic = loadImage('images/filled_screen.png');
        logo1 = PRELOADS.solitare.logo1;
        logo2 = PRELOADS.solitare.logo2;

        logoCopy = createGraphics(1000, 1000);
        logoCopy.tint(100, 255, 255);
        logoCopy.image(logo2, 0, 0, unit * 12, (logo1.height/logo1.width) * unit * 12);
        logoCopy.tint(255, 100, 255);
        logoCopy.image(logo1, 0, 0, unit * 12, (logo1.height/logo1.width) * unit * 12);

        logoBuffer = createGraphics(width, height);
//        logoBuffer.tint(255, 100, 255);
        logoBuffer.tint(100, 255, 255);

        logoBuffer.image(logo1, unit*2, unit, unit * 12, (logo1.height/logo1.width) * unit * 12);
        logoBuffer.image(logo1, unit*2+width/2, unit, unit * 12, (logo1.height/logo1.width) * unit * 12);

        buffer = createGraphics(width*3, height*3); 
        buffer.background(0, 0, 0, 0);
        noiseDetail(2, 1.0);

        offset1 = 0;
        offset2 = 0;     
    }

    this.draw = () => {   
        // (ctx, x, y, color, glowStrokeWidth, size)
        //logoCopy.image(logo2, unit * 5, unit * 4, unit * 7, (logo2.height/logo2.width) * unit * 7);

        if (frameCount % 2 == 0)
        {
            return;
        }

        var r = 100 + ((sin(frameCount*0.001)+1)*0.5)*height/4;
        var t = frameCount*0.02;
        var angle = t;
        var angle2 = (noise(t * 0.2)) * 2*PI;
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

        //image(background_pic, 0, 0, width, height);
        buffer.background(0, 0, 0, 15);
        buffer.image(logoCopy, width+unit*2+x, height+unit+y, logoCopy.width, logoCopy.height);
        buffer.image(logoCopy, width+unit*2+ width/2+x, height+unit+y, logoCopy.width, logoCopy.height);
        image(buffer, -width-x, -height-y, width*3, height*3);

        image(logoBuffer, 0, 0, width, height);

        //utils.drawWithOutline(logo1, 0, 0, colorBG, 10, logo1.width * 0.1, logo1.height * 0.1);
    }
}
