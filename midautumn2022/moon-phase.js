function Phases()
{
    // x and y to calculate the coordinates of the moon
    let x = 0;
    let y = 0;

    // 1 is the earth and 2 is the moon
    // d is the diameter 
    // a is the angle bewtween the center of the moon and the center of the earth
    let a = 0;

    var c;

    this.setup = function () 
    {
        c = createCanvas(900, 600);
        angleMode(RADIANS);
    }

    this.draw = function ()
    {
        // it's a while loop
        let bg_color = color(62,114,135,255);
        let light_color = color(246,196,66,255);
        background(bg_color);
        
        let d = width / 3;
        noStroke();
        ellipseMode(CENTER);
            
        // moon
        a -= 0.01;
        a %= -Math.PI*2;
            
        x = Math.cos(a) * d/2 * 5/2;
        y = Math.sin(a) * d/2 * 5/2;
        
        // moon pahases
        noStroke();
        let phasex = width/2;
        let phasey = height/2;

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
            color4 = color(0,255,0,0);
            color3 = light_color;
            color1 = bg_color;
            color2 = light_color;
        }

        fill(color1);
        //let widthMoonPhase = map(Math.sin(a), -1, 1, -d2, d2);
        arc(phasex, phasey, d, d, PI/2, 3 * PI/2);
        fill(color2);
        arc(phasex, phasey, d+1, d+1, 3 * PI/2, PI/2);

        let heightPhase = d;
        let widthPhase = map(Math.cos(a), 0, 1, 0, d);

        fill(color3);
        arc(phasex, phasey, widthPhase - 2, heightPhase + 1, PI/2, 3 * PI/2);
        fill(color4);
        arc(phasex, phasey, widthPhase - 2, heightPhase + 1, 3 * PI/2, PI/2)
    }
}