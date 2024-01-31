// TODO scoot all text over by 1 half, use the negative edge

function Screens() {
    const Y_AXIS = 1;
    const X_AXIS = 2;
    var n = 4;

    let locX = 0;
    let locY = 0;
    let z = -100;
    let t = 0;
    let unit = width/32;
    let loop = 0;


    this.setup = () => {
        this.pattern = createGraphics(width, height, WEBGL);

        locX = -width/2
        locY = -height/2;
        background(0);

        background(50,50,200);
    }

    this.enter = () => {
        this.fonts = PRELOADS.screens.fonts;
    }

    this.checkCoordinates = (i, j, x, y) =>
    {
        if (i == x && j == y)
        {
            return true;
        }
        return false;
    }

    this.isAChosenOne = (i, j) =>
    {        
        if (loop == 2) {
            return this.checkCoordinates(i, j, 11, 2)
                || this.checkCoordinates(i, j, 12, 2)
                || this.checkCoordinates(i, j, 13, 2)
                || this.checkCoordinates(i, j, 14, 2);
        }
        if (loop == 1) {
            return this.checkCoordinates(i, j, 2, 2)
                || this.checkCoordinates(i, j, 3, 2)
                || this.checkCoordinates(i, j, 4, 2)
                || this.checkCoordinates(i, j, 5, 2);
        }
        if (loop == 3) {
            return this.checkCoordinates(i, j, 1, 3)
                || this.checkCoordinates(i, j, 2, 3)
                || this.checkCoordinates(i, j, 3, 3)
                || this.checkCoordinates(i, j, 4, 3)
                || this.checkCoordinates(i, j, 5, 3)
                || this.checkCoordinates(i, j, 6, 3)
                || this.checkCoordinates(i, j, 7, 3)
                || this.checkCoordinates(i, j, 8, 3)
                || this.checkCoordinates(i, j, 9, 3);
        }
        if (loop == 0) {
            return this.checkCoordinates(i, j, 15, 4)
                || this.checkCoordinates(i, j, 14, 4)
                || this.checkCoordinates(i, j, 13, 4)
                || this.checkCoordinates(i, j, 4, 4)
                || this.checkCoordinates(i, j, 5, 4)
                || this.checkCoordinates(i, j, 6, 4)
                || this.checkCoordinates(i, j, 7, 4)
                || this.checkCoordinates(i, j, 8, 4)
                || this.checkCoordinates(i, j, 9, 4)
                || this.checkCoordinates(i, j, 10, 4)
                || this.checkCoordinates(i, j, 11, 4)
                || this.checkCoordinates(i, j, 12, 4);
        }
    }

    /*
    this.textDiamond("CHÚC MỪNG NĂM MỚI", 0.76 * g, "vn"),
            this.textDiamond("HAPPY NEW YEAR", 0.9 * g, "vn"),
            this.viridianDiamond,
            this.textDiamond("新年快乐", 1.1 * g, "cn"),
            this.textDiamond("새해 복 많이 받으세요", 0.76 * g, "kr"),
*/
    this.text = (ctx, text, textSize = 20, x, y, lang = "cn") => {
        const greeting = text;
        ctx.textSize(textSize);
        ctx.textFont(this.fonts[lang]);
        //const bbox = this.fonts[lang].textBounds(greeting, 0, 0, textSize);
        //ctx.fill(0,205,85);
        fill(255);
        ctx.text(greeting, x, y);
    }

    this.draw = () => {
        stroke(255);
        this.pattern.clear();
        blendMode(BLEND);

        strokeWeight(3);
        t = sin(frameCount*0.01);
        t = (t + 1) * 0.5;
        t = utils.getGain(t, 0.1);
        t = (t * 2) - 1;
        background(50,50,200);


        var edge = 0.5;
        var size =unit*2;
        
        if (t > 0)
        {
            for (var i=0; i < 40; ++i)
            {
                for (var j=0; j < 10; ++j)
                {
                    //fill(50,50,200);
                    fill(255,50,170);
                    circle(i*size, j*size, size);

                    if (t < -edge)
                    {
                        if (this.isAChosenOne(i, j))//noise(i, j) > 0.8)
                        {
                            fill(50,50,200);
                            circle(i*size, j*size, size);        
                            continue;
                        }
                    }
                    makeCircle(i*size, j*size, size); //clip with just the main canvas!      

                    noFill();
                    circle(i*size, j*size, size);   
                }
            }
        }
        else
        {
            for (var i=0; i < 40; ++i)
            {
                for (var j=0; j < 10; ++j)
                {
                    fill(255,50,170);
                    //fill(50,50,200);
                    circle(i*size-size/2, j*size-size/2, size);
                    
                    if (t < -edge)
                    {
                       if (this.isAChosenOne(i, j)) // noise(i, j) > 0.75)
                        {
                            fill(50,50,200);
                            circle(i*size-size/2, j*size-size/2, size);        
                            continue;
                        }
                    }
                    makeCircle(i*size-size/2, j*size-size/2, size); //clip with just the main canvas!  
                    
                    noFill();
                    circle(i*size-size/2, j*size-size/2, size);   
                }
            }
        }      

    if (t < -edge)
    {
        this.writeText(i);
    }
    else if (t < -edge)
    {
        this.writeText(i);
    }
    
    if (frameCount % 100 == 0)
    {
        loop = (loop+1) % 4;
    }

}

this.writeText = () => {
    blendMode(LIGHTEST);
    fill(255);

    var xOffset = -unit * 1.0;
    var yOffset = -unit * 1.0;
    if (loop == 1)
    {
        this.text(this.pattern, "新   年   快   乐", 1.44 * unit, -unit*12.6+xOffset, unit*0.09+yOffset, "cn");
        image(this.pattern, 0, 0, width, height);        
    }
    else if (loop == 2)
    {
        this.text(this.pattern, "CHÚC   MỪNG   NĂM     MỚI", 0.78 * unit, unit*5.3+xOffset, -unit*.15+yOffset, "vn");
        image(this.pattern, 0, 0, width, height);        
    }
    else if (loop == 3)
    {
        this.text(this.pattern, "새  해  복  많  이  받  으  세  요", 1.31 * unit, -unit*14.7+xOffset, unit*2.0+yOffset, "kr");
        image(this.pattern, 0, 0, width, height);        
    }
    else if (loop == 0)
    {
        this.text(this.pattern, "H    A    P    P    Y    N    E   W    Y    E    A    R", 1.58 * unit, -unit*8.4+xOffset, unit*4.12+yOffset, "vn");
        image(this.pattern, 0, 0, width, height);        
    }
}

// I discovered that you don't need multiple canvases!  You can use push and pop around the clipping; pop turns off the clipping.
    function makeCircle(x, y, size)
    {  
        var r = size*0.5;
        push();
        noStroke();
        strokeWeight(3);
        stroke(255);
        translate(x, y);
        rotate(t*PI/2);
        translate(-x, -y);
        fill(50,50,200);
        circle(x,y,size);
        canvas.getContext("2d").clip();
        fill(255,50,170)
        circle(x-r, y-r, size);
        circle(x+r, y-r, size);
        circle(x-r, y+r, size);
        circle(x+r, y+r, size);
        pop();  
    }
/*
    this.draw = () => {           
        // add point light to showcase specular material
        this.pattern.push();

        let locX = frameCount-(this.pattern.width/2.0);
        let locY = sin(frameCount*0.1) * 150;
        this.pattern.pointLight(
            80, 80, 80, 1000, this.pattern.height * 0.5, 300
        );
        this.pattern.pointLight(
            80, 80, 80, -1000, -this.pattern.height * 0.5, 300
        );
        this.pattern.pointLight(
            120, 120, 120, 0, 0, 300
        );

        //background(0, 0, 0, 100);
        //ambientMaterial(250, 30, 30);
        this.pattern.translate(locX, locY, z);
        //rotateZ(frameCount * 0.01);
        //rotateX(frameCount * 0.01);
        //rotateY(frameCount * 0.01);
        this.pattern.plane(100);
        z += 1;
        this.pattern.pop();   
        
        image(this.pattern, 0, 0, this.pattern.width, this.pattern.height);
    }*/
}
