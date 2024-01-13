function Screens() {
    const Y_AXIS = 1;
    const X_AXIS = 2;
    var n = 4;

    let locX = 0;
    let locY = 0;
    let z = -100;

    this.setup = () => {
        const size = 8;
        this.pattern = createGraphics(32 * size, 9 * size, WEBGL);
        this.pattern.background(0);
        this.pattern.noStroke();

        locX = -width/2
        locY = -height/2;
    }

    this.draw = () => {           
        rect (100, 100, 100, 100);    
        // add point light to showcase specular material
        this.pattern.push();

        let locX = frameCount*2-width/2;
        let locY = sin(frameCount*0.1) * 150;
        this.pattern.clear();
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
        z += 2;
        this.pattern.pop();   
        
        image(this.pattern, -width / 2, -height / 2, this.pattern.width, this.pattern.height);
    }
}
