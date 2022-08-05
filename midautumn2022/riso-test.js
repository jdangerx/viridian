function Riso()
{
    // x and y to calculate the coordinates of the moon
    let x = 0;
    let y = 0;

    // 1 is the earth and 2 is the moon
    // d is the diameter 
    // a is the angle bewtween the center of the moon and the center of the earth
    let a = 0;
    let d = width / 5;
    let increment = 0.01;

    let bg_color = color(62,114,135,255);
    let light_color = color(246,216,86,255);

    let paperTexture;
    let blueChannel;

    var c;

    this.setup = function () 
    {
        paperTexture = loadImage('paper.jpg');
        c = createCanvas(900, 600);
        angleMode(RADIANS);
        console.log("setup riso scene");
    }

    this.draw = function ()
    {
        console.log("drawing riso scene");

        // it's a while loop
        background(bg_color);

        pixelDensity(1);
        blueChannel = new Riso('black', 100, 100); // instantiate riso object as blue layer
        blueChannel.fill(128); //set opacity
        blueChannel.rect(20, 20, 100, 100); //draw rect to blue layer
        drawRiso(); //draw to screen
        
        noStroke();
        ellipseMode(CENTER);

        a -= increment;    
        a %= -2*Math.PI;    

        this.drawMoon(x, 0, a);

        blendMode(OVERLAY); 
        texture(paperTexture);
        textureMode(IMAGE);

        plane(600, 600);

        for (let i=0; i < (width / (d * 1.5)); ++i)
        {
            var x = -width/2 + i * d*1.5 + d;
            var newA = a - (i * 0.4);
            var newHeight = cos(0.01 * frameCount + i) * height/3

            fill(color(32,74,105,255));
            rectMode(CORNERS);
            rect(x-d/2, newHeight, x+d/2, height);

            //this.drawMoon(x, newHeight, newA);
        }

    }

    this.drawMoon = function(x, y, a)
    {
        // moon
        //a -= 0.01;
        //a = -Math.PI/2 + 1;
        /*
        a = -Math.PI + 1;
        a = -Math.PI + 1;
        a = -Math.PI - 1;
        a = -3*Math.PI/2 - 1;
*/
        //x = Math.cos(a) * d/2 * 5/2;
        //y = Math.sin(a) * d/2 * 5/2;
        noStroke();

        let color1 = color(0,25,25,0); //red
        let color2 = color(0,25,25,0); //gray
        let color3 = color(0,25,25,0); //blue
        let color4 = color(0,25,25,0); //green

        if (-Math.PI/2 < a && a < 0) {
            color3 = light_color;
            color4 = light_color;
            color1 = light_color;
            color2 = bg_color;
        } else if (-Math.PI < a && a < -Math.PI/2) {
            color1 = light_color;
            color3 = bg_color;
            color4 = bg_color;
            color2 = bg_color;
        } else if (-3*Math.PI/2 < a && a < -Math.PI) {
            color4 = bg_color;
            color2 = light_color;
            color1 = bg_color;
            color3 = bg_color;
        } else if (-2*Math.PI < a && a < -3*Math.PI/2) {
            color4 = light_color;
            color3 = light_color;
            color1 = bg_color;
            color2 = light_color;
        } else {
            color3 = light_color;
            color4 = light_color;
            color1 = light_color;
            color2 = bg_color;
        }

        /*
        color1 = color(0);
        color2 = color(100);
        color3 = color(200);
        color4 = color(255);
*/
        fill(color1);
        arc(x, y, d, d, PI/2, 3 * PI/2);
        fill(color2);
        arc(x, y, d+1, d+1, 3 * PI/2, PI/2);

        let heightPhase = d;
        let widthPhase = map(Math.cos(a), 0, 1, 0, d);

        fill(color3);
        arc(x, y, widthPhase - 2, d + 1, PI/2, 3 * PI/2);
        fill(color4);
        arc(x, y, widthPhase - 2, d + 1, 3 * PI/2, PI/2)
    }
}