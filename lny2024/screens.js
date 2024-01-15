function Screens() {
    const Y_AXIS = 1;
    const X_AXIS = 2;
    var n = 4;

    let locX = 0;
    let locY = 0;
    let z = -100;
    let t = 0;


    this.setup = () => {
        const size = 8;
        this.pattern = createGraphics(width, height, WEBGL);
        this.pattern.background(0);

        locX = -width/2
        locY = -height/2;
        background(0);

        noStroke();
        background(50,50,200);
    }

    this.draw = () => {

        t = sin(frameCount*0.002);
        t = (t + 1) * 0.5;
        t = utils.getGain(t, 0.1);
        t = (t * 2) - 1;
        t = fract(t + (0.5));
        background(50,50,200);
        
        if (t > 0)
        {
            for (var i=0; i < 20; ++i)
            {
                for (var j=0; j < 10; ++j)
                {
                    var size =100;
                    makeCircle(i*size, j*size, size); //clip with just the main canvas!      
                }
            }
            }
        else
            {
            for (var i=0; i < 20; ++i)
            {
                for (var j=0; j < 10; ++j)
                {
                    var size =100;
                    makeCircle(i*size-size/2, j*size-size/2, size); //clip with just the main canvas!      
                }
            }
        }      
    }

// I discovered that you don't need multiple canvases!  You can use push and pop around the clipping; pop turns off the clipping.
    function makeCircle(x, y, size)
    {  
        var r = size*0.5;
        push();
        noStroke();
        translate(x, y);
        rotate(t*PI/2);
        translate(-x, -y);
        fill(50,50,200);
        circle(x,y,size);
        canvas.getContext("2d").clip();
        fill(200,50,150)
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
