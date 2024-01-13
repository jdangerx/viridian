function Solitare() {
    const Y_AXIS = 1;
    const X_AXIS = 2;
    var n = 4;
    let logo1;

    this.setup = () => {
        noStroke();
        logo1 = loadImage('images/Dusse_Logo_wCross_horizontal.png');

    }

    this.draw = () => {        
        background(0);
        image(logo1, 0, 0, logo1.width * 0.1, logo1.height * 0.1);

    }
}
