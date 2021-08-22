

var fourier = function(p)
{
  p.time = {t:[]};
  p.canvas2;
  p.wave = [];
  p.path = [];
  p.signal_x = [];
  p.signal_y = [];
  p.slider;
  p.fourierY = [];
  p.fourierX = [];
  p.angle = 0;
  p.font;
  p.words = ["*Happy*", "*B'Day*", "*Chunmun*"];
  p.points = [];
  p.done = 0;
  p.canvas;

  p.preload = function()
  {
    p.font = p.loadFont('glitter.ttf');
  };

  p.setup = function()
  {
    p.canvas = p.createCanvas(1000, 800);
    // canvas.parent('fourier');
    p.canvas2 = p.createGraphics(1000,800);
    p.canvas2.clear();
    
    p.textFont(p.font);
    p.textSize(128);
    p.fill(255);
    p.noStroke();
    //text('train',100,200);
    for (let i = 0; i < p.words.length; i++) {
      p.points[i] = p.font.textToPoints(p.words[i], 100, 200, 200);
      p.time.t[i] = 0;
    }

    for (let i = 0; i < p.points.length; i++) {
      //angle = map(i,0,200,0,TWO_PI)
      p.signal_x[i] = [];
      p.signal_y[i] = [];
      for (let j = 0; j < p.points[i].length; j++) {
        p.signal_x[i][j] = p.points[i][j].x;
        p.signal_y[i][j] = p.points[i][j].y;
      }
    }
    
    for (let i = 0; i < p.signal_x.length; i++) {
      p.fourierX[i] = p.dft(p.signal_x[i]);
      p.fourierY[i] = p.dft(p.signal_y[i]);
      //console.log(fourierY);
      //slider = createSlider(1, 10, 1);
      p.fourierX[i].sort((a, b) => b.amp - a.amp);
      p.fourierY[i].sort((a, b) => b.amp - a.amp);
    }
  };

  p.draw = function()
  {
    if( p.done<3)
    {
      p.background(0);
      p.image( p.canvas2,0,0);
      //translate(-100, 200);
      //text('*Happy*Birthday*',100,200);
      //translate(100, 200);
      //points = font.textToPoints('Trainx', 100, 200);


      p.x0 = -100;
      p.y0 = 200;
      p.x1 = 600;
      p.y1 = 20;

      p.Anim( p.x0, p.y0+180* p.done, p.x1, p.y1+180* p.done, p.done, p.time);  
    }
    else
    {
      p.background(0);
      p.image( p.canvas2,0,0);
    }
  };

  p.Anim = function(x0,y0,x1,y1,idx,time)
  {
    vx = p.epicycle(x0, y0, 0, p.fourierX[idx],idx);
    vy = p.epicycle(x1, y1-50, p.HALF_PI, p.fourierY[idx],idx);
    v = p.createVector(vx.x, vy.y)
    p.path.unshift(v);
    //wave.unshift(y);
    //translate(200, 0);
    p.stroke(200);
    p.line(vx.x, vx.y, v.x, v.y);
    p.line(vy.x, vy.y, v.x, v.y);
    p.canvas2.beginShape();
    p.canvas2.noFill();
    
    r = p.random(0, 255);
    
    for (let i = 0; i < p.path.length; i++) {
      p.canvas2.stroke(p.random(0, 255), p.random(0, 255), p.random(0, 255));
      p.canvas2.ellipse(p.path[i].x, p.path[i].y, 1);
    }
    p.canvas2.endShape();
  
    dt = p.TWO_PI / p.fourierY[idx].length;
    p.time.t[idx] += dt;
    if(p.time.t[idx] > p.TWO_PI)
    {
      p.done++;
    }
  
    p.beginShape();
    for (let i = 0; i < p.points[idx].length; i++) {
      let q = p.points[idx][i];
      p.stroke(200, 0, 0);
      //ellipse(p.x,p.y,2);
    }
    p.endShape(p.CLOSE);
  };

  p.epicycle = function(x, y, rotation, fourier,idx)
  {
    for (let i = 0; i < fourier.length; i++) {


      let prevX = x;
      let prevY = y;
  
      let n = fourier[i].freq;
      let radius = fourier[i].amp;
      let phase = fourier[i].phase + rotation;
  
      p.stroke(p.random(0, 255), p.random(0, 255), p.random(0, 255), 40);
      p.noFill();
      p.ellipse(prevX, prevY, radius * 2);
  
      x += radius * p.cos(n * p.time.t[idx] + phase);
      y += radius * p.sin(n * p.time.t[idx] + phase);
  
      p.stroke(p.random(0, 255), p.random(0, 255), p.random(0, 255), 100);
      p.strokeWeight(3);
      p.fill(100);
      p.line(prevX, prevY, x, y);
      p.ellipse(x, y, 1);
    }
    return p.createVector(x, y);
  };

  p.dft = function(x)
  {
    let X = [];
    const N = x.length;
  
    for (let k = 0; k < N; k++) {
      let re = 0;
      let im = 0;
      for (let n = 0; n < N; n++) {
        const phi = (2 * p.PI * n * k) / N;
        re += x[n] * p.cos(phi);
        im -= x[n] * p.sin(phi);
      }
      re = re / N;
      im = im / N;
  
      let freq = k;
      let amp = p.sqrt(re * re + im * im);
      let phase = p.atan2(im, re);
      //console.log(im,re,phase);
  
      X[k] = {
        re,
        im,
        freq,
        amp,
        phase
      };
    }
  
    return X;
  };
  
};


var FourierViz = new p5(fourier,'FourierViz');