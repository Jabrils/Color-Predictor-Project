// for red, green, and blue color values
var r, g, b, diameter, choices = 2;
var predictor = [0,100], colorsPer = [0,15], generation = 0, colorsL = colorsPer[1];

var button = [[180,300],[540,300]]
var hL = [], G = [], Guesses = [], theAnswer;
var colorPredictor = [], scores = [];

function setup() {
    canv = createCanvas(700,500);
    canv.parent("sketcher");
    diameter = 200;

    for ( var i = 0; i < predictor[1]; i++)
{
    scores[i] = 0;
}    
    
    // Randomize a color
    ColorRandomizer();

    // Initialize our Hidden Layer
    for ( var i = 0; i < predictor[1]; i++)
    {
        colorPredictor[i] = IniNetwork();
    }

    print(colorPredictor);

    // Does a forward pass in our network & returns a proper guess, 0 or 1
    GetGuess();

}

function GetGuess()
{
    // 
    Guesses[0] = 0;
    Guesses[1] = 0;

    for ( var i = 0; i < predictor[1]; i++)
    {

    // now let's define hL of our Hidden Layer :D
    hL[0] = reLU((InpEncoder(r)*colorPredictor[i][0][0][0]) + (InpEncoder(g)*colorPredictor[i][0][0][1]) + (InpEncoder(b)*colorPredictor[i][0][0][2]) + (colorPredictor[i][0][0][3]));
    hL[1] = reLU((InpEncoder(r)*colorPredictor[i][0][1][0]) + (InpEncoder(g)*colorPredictor[i][0][1][1]) + (InpEncoder(b)*colorPredictor[i][0][1][2]) + (colorPredictor[i][0][1][3]));
    hL[2] = reLU((InpEncoder(r)*colorPredictor[i][0][2][0]) + (InpEncoder(g)*colorPredictor[i][0][2][1]) + (InpEncoder(b)*colorPredictor[i][0][2][2]) + (colorPredictor[i][0][2][3]));

    // now let's define the Guess of our Network :D
    G[0] = (hL[0] * colorPredictor[i][1][0][0]) + (hL[1] * colorPredictor[i][1][0][1]) + (hL[2] * colorPredictor[i][1][0][2]) + (colorPredictor[i][1][0][3]);
    G[1] = (hL[0] * colorPredictor[i][1][1][0]) + (hL[1] * colorPredictor[i][1][1][1]) + (hL[2] * colorPredictor[i][1][1][2]) + (colorPredictor[i][1][1][3]);
    

    // makes the guess a comparible answer
    var gg = softmax(G)[0] > softmax(G)[1] ? 0 : 1;

    // Add a score to the predictor
    if(gg==theAnswer)
    {
        scores[i]+=softmax(G)[gg];
    }

    // Returns a proper guess, 0 or 1, left or right, black or white depending on how each voted
    Guesses[gg]++;
    }

}

function IniNetwork()
{
var allWeights = [[[[]]],[[[]]]];

// These are defining our layers that will hold weights, specifically the hidden Layer & Output layer.
        allWeights[0] = [[],[],[]];
        allWeights[1] = [[],[]];
        
        // Let's populate the hidden layer with weights!
        for ( var j = 0; j < allWeights[0].length; j++)
        {    
            for ( var i = 0; i < 4; i++)
            {  
                // the weights are set here randomly  
        allWeights[0][j][i] = random();
        }
        }
    
            // Let's populate the output layer with weights!
            for ( var j = 0; j < allWeights[1].length; j++)
            {    
                for ( var i = 0; i < 4; i++)
                {  
                    // the weights are set here randomly  
            allWeights[1][j][i] = random();
            }
            }

        return allWeights;
}

// 
function draw() {
    background(0);
    
    textSize(30);
    textAlign(CENTER, CENTER);
    fill(255);
    text("Does White or Black look better over this color?", 350,50);

    textAlign(LEFT, CENTER);    
    textSize(12);
    text("Gen: "+generation+"\nColorsLeft: " + colorsL, 16,95);

    // Plop stores the fitness of all predictors, but this information needs to be presented in a better way
    var plop = "";
    for ( var i = 0; i < scores.length; i++)
    {
        plop+=(Math.round(scores[i]*10))/10 + ((i!=scores.length-1) ? "," : ""  );
    }    
    textAlign(CENTER, CENTER);    
    textSize(6);
    text(plop, 350,455);

    DrawDisplayer(0);
    DrawDisplayer(1);

    fill(255);
    ellipse(button[Guesses[0] > Guesses[1] ? 0 : 1][0], 150, 50, 50);
}

// 
function DrawDisplayer(loc)
{
    fill(r, g, b);
    ellipse(button[loc][0], button[loc][1], diameter, diameter);
    fill(loc*255);
    textSize(48);
    textAlign(CENTER, CENTER);
    var t = (loc==0) ? "BLACK\n"+Guesses[0] : "WHITE\n"+Guesses[1];
    text(t,button[loc][0], button[loc][1]);
 } 

 // 
function reLU(x)
{
    if(x<0)
    {
        return 0;
    }
    else
    {
        return x;
    }
}

// 
function InpEncoder(x)
{
    return x/255;
}

// 
function softmax(vec) {
    VEC = [];

    //     
    for (var i = 0; i < vec.length; i++) {
        VEC[i] = Math.pow(Math.E, vec[i]) / Summation(vec);
    }

    return VEC
}

// 
function Summation(vec) {
    final = 0;

    for (var i = 0; i < vec.length; i++) {
        final += Math.pow(Math.E, (vec[i]))
    }

    return final;
}

// 
function Handler()
{
    ColorRandomizer();
    GetGuess();
    colorsL--;

// New gen if out of colors
if(colorsL <= 0)
{
    newGen();
}
}

// YOURE GOING TO WANT TO PRETTY MUCH THROW THIS FUNCTION INTO THE TRASH & WRITE A GENETIC ALGORITHM THAT IS A LOT LESS LAZIER!
// I highly reccomend Daniel Shiffmans Nature of Code Chapter 9 on Genetic Algorithms, its very thorough! https://www.youtube.com/watch?v=9zfeTw-uFCw&list=PLRqwX-V7Uu6bJM3VgzjNV5YxVxUwzALHV
function newGen()
{
 
    var topParent = 0, secParent = 0;
    var track = [];

    // this loop will give us first place
    for ( var i = 0; i < scores.length; i++)
    {
        if (scores[i] > topParent)
        {
            topParent = scores[i];
            track[0] = i;
        }
    }    

    // this loop will give us second place
    for ( var i = 0; i < scores.length; i++)
    {
        if (scores[i] > secParent && i!=track[0])
        {
            secParent = scores[i];
            track[1] = i;
        }
    }   
    
    // 
    if(track[0] == null)
    {
        track[0] = Math.floor(random(0,scores.length));
    }
    if(track[1] == null)
    {
        track[1] = Math.floor(random(0,scores.length));
    }    
    
    // THIS IS INCREDIBLY LAZY
    // mate first & second place for entire generation (33)
    for ( var i = 0; i < predictor[1]; i++)
    {
        print(colorPredictor, colorPredictor[track[0]],colorPredictor[track[1]]);
        colorPredictor[i] = MateTime(colorPredictor[track[0]],colorPredictor[track[1]]);
    }

    // repeat all

    generation++;
    colorsL = colorsPer[1];
 
    // 
    for ( var i = 0; i < scores.length; i++)
    {
        scores[i] = 0;
    }   
}

function MateTime(a,b)
{
    // mate top 2, but sometimes randomly not top 2

    var allWeights = [[[[]]],[[[]]]];

    allWeights[0] = [[],[],[]];
    allWeights[1] = [[],[]];

        // Let's populate the hidden layer with weights!
        for ( var j = 0; j < allWeights[0].length; j++)
        {    
            for ( var i = 0; i < 4; i++)
            {  
                var coin = random();
                // the weights are set here randomly  
        allWeights[0][j][i] = ((coin>.5) ? a[0][j][i] : b[0][j][i]) + random(-.5,.5);
        }
        }
    
            // Let's populate the output layer with weights!
            for ( var j = 0; j < allWeights[1].length; j++)
            {    
                for ( var i = 0; i < 4; i++)
                {  
                var coin = random();
                // the weights are set here randomly  
            allWeights[1][j][i] = ((coin>.5) ? a[1][j][i] : b[1][j][i]) + random(-.5,.5);
            }
            }



        return allWeights;

}

//
function keyPressed() {
    if (keyCode === RIGHT_ARROW) {
      ColorRandomizer();
      GetGuess();

    }
  }
  

// 
function ColorRandomizer()
{
          // Pick colors randomly
            r = random(255);
            g = random(255);
            b = random(255);
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
        print("FUNCTION FOR BLACK");
        theAnswer = 0;

      // Pick new random color values
        Handler();
}
else if (d[1] < diameter/2) {
    print("FUNCTION FOR WHITE");
    theAnswer = 1;
    // Pick new random color values
    Handler();
    }
  }
