// for red, green, and blue color values
let nn;
var r, g, b, diameter, choices = 2;
var button = [[180,300],[540,300]]
let inputs, outputs, targets;

function setup() {
    nn = new NeuralNetwork(3, 20, 2,.5);

    canv = createCanvas(700,500);
    canv.parent("sketcher");
    
    ColorRandomizer(false,[0,0]);

    
    diameter = 200;
}

function draw() {
    background(0);
    
    textSize(30);
    textAlign(CENTER, CENTER);
    fill(255);
    text("Does White or Black look better over this color?", 350,50);

    DrawDisplayer(0);
    DrawDisplayer(1);

    fill(255);
    ellipse(button[outputs[0] > outputs[1] ? 0 : 1][0], 150, 50, 50);

}

function DrawDisplayer(loc)
{
    fill(r, g, b);
    ellipse(button[loc][0], button[loc][1], diameter, diameter);
    fill(loc*255);
    textSize(48);
    textAlign(CENTER, CENTER);
    var t = (loc==0) ? "BLACK" : "WHITE";
    text(t,button[loc][0], button[loc][1]);
 } 

function ColorRandomizer(tr,t)
{
    if(tr)
    {
// For training
targets = t;
nn.train(inputs, targets);

// TIPS FROM USING THE TOY NN LIB
// I think the backprop order of operation may need a bit of work? for I can't get the toy NN to converge without overfitting it seems
// however I am out of time & not good enough in JS syntax to add to the high level JS syntax in the lib. xD
// so I suggest using the nn.predict() function on only a small dataset perhaps to get the highest possible accuracy?
// feel free to submit your github request here for the lib! https://github.com/CodingTrain/Toy-Neural-Network-JS
outputs = nn.predict(inputs);
    }
        GrabRandomColAndGuess();
}

function GrabRandomColAndGuess()
{
          // Pick colors randomly
          r = random(255);
          g = random(255);
          b = random(255);

          inputs = [r, g, b];
          // for guessing
          outputs = nn.predict(inputs);
}

function keyPressed() {
    if (keyCode === RIGHT_ARROW) {
      GrabRandomColAndGuess();
    }
  }
  // When the user clicks the mouse
  function mousePressed() {
    // Check if mouse is inside the circle
    var d = [];

    for ( var i = 0; i < choices; i++)
    {    
    d[i] = dist(mouseX, mouseY, button[i][0], button[i][1]);
    }

    if (d[0] < diameter/2) {
      // Pick new random color values
ColorRandomizer(true,[1,0]);
    }
    else if (d[1] < diameter/2) {
      // Pick new random color values
ColorRandomizer(true,[0,1]);
    }
  }
