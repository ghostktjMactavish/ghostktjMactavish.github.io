var flocksim = function(p)
{
  p.canvas;

  p.flocks=[];
  
  p.w = 800;
  p.h = 600;
  p.slidex = 180;
  p.alignSlider, p.cohesionSlider, p.separationSlider, p.perceptionSlider, p.maxSpeedSlider, p.maxForceSlider;
  p.perception = 50;
  p.maxForce = 0.2 ;
  p.maxSpeed = 1;

  class Boid
  {
    constructor()
    {
      this.position = p.createVector(p.random(p.width),p.random(p.height));
      this.velocity = p5.Vector.random2D();
      this.velocity.setMag(p.random(1.5,2.5));
      this.accl = p.createVector();
      //this.maxForce = 0.2;
      //this.maxSpeed = 1;
      this.color = [p.random(0,255),p.random(0,255),p.random(0,255)];
    }
    
    align(boids)
    {
      //let perception = 50;
      let steering = p.createVector();
      let cohesion = p.createVector();
      let separation = p.createVector();
      let avr = 0;
      let avg = 0;
      let avb = 0;
      let total = 0;
      for (let other of boids)
        {
          let d = p.dist(this.position.x,this.position.y,other.position.x,other.position.y);
          if(d < p.perception && other !=this )
          {
            let diff = p5.Vector.sub(this.position,other.position);
            diff.div(d);
            steering.add(other.velocity);
            cohesion.add(other.position);
            separation.add(diff);
            avr+= other.color[0];
            avg+= other.color[1];
            avb+= other.color[2];
            total++;
          }
        }
      if(total > 0)
        {
          separation.div(total);
          separation.setMag(p.maxSpeed);
          separation.sub(this.velocity);
          separation.limit(p.maxForce);
          
          cohesion.div(total);
          cohesion.sub(this.position);
          cohesion.setMag(p.maxSpeed);
          cohesion.sub(this.velocity);
          cohesion.limit(p.maxForce);
          
          steering.div(total);
          steering.setMag(p.maxSpeed);
          steering.sub(this.velocity);
          steering.limit(p.maxForce);
          
          avr = avr/total;
          avg = avg/total;
          avb = avb/total;
        }
        let vals = [steering,cohesion,separation,avr,avg,avb];
        return vals;
    }
    
    flock(boids)
    {
      let vals = this.align(boids);
      
      let steering = vals[0];
      let cohesion = vals[1];
      let separation = vals[2];
      
      separation.mult(p.separationSlider.value());
      steering.mult(p.alignSlider.value());
      cohesion.mult(p.cohesionSlider.value());
      this.accl.add(steering);
      this.accl.add(cohesion);
      this.accl.add(separation);
      this.color[0] = vals[3] > 140 ? vals[3] : p.random(255);
      this.color[1] = vals[4] > 100 ? vals[4] : p.random(255);
      this.color[2] = vals[5] > 100 ? vals[5] : p.random(255);
    }
    
    edges()
    {
      if (this.position.x > p.width)
        this.position.x = 0;
      else if (this.position.x < 0)
        this.position.x = p.width;
      
      if (this.position.y > p.height)
        this.position.y = 0;
      else if (this.position.y < 0)
        this.position.y = p.height;
    }
    
    show()
    {
      p.stroke(this.color[0],this.color[1],this.color[2]);
      p.strokeWeight(8);
      //stroke(255);
      p.ellipse(this.position.x,this.position.y,8);
    }
    
    update()
    {
       this.position.add(this.velocity);
       this.velocity.add(this.accl);
       this.velocity.limit(this.maxSpeed);
       this.accl.mult(0);
    }

  }

  p.setup = function()
  {
    p.canvas = p.createCanvas(p.w, p.h);
    console.log(p.canvas);
    // p.canvas.parent('FlockSim');


    p.buttonA = p.createButton("Align");
    p.buttonA.position(p.w+90,200+260)
    p.buttonC = p.createButton("Cohesion");
    p.buttonC.position(p.w+90,200+330)
    p.buttonS = p.createButton("Separation");
    p.buttonS.position(p.w+90,200+400)
    p.buttonP = p.createButton("Perception");
    p.buttonP.position(p.w+90,200+470)
    p.buttonSpeed = p.createButton("MaxSpeed");
    p.buttonSpeed.position(p.w+90,200+540)
    p.buttonForce = p.createButton("MaxForce");
    p.buttonForce.position(p.w+90,200+610)
    
    p.alignSlider = p.createSlider(0,5,1,0.1);
    p.alignSlider.position(p.w+260,200+275);
    p.alignSlider.style('border','2px solid')
    p.cohesionSlider = p.createSlider(0,5,1,0.1);
    p.cohesionSlider.position(p.w+260,200+345);
    p.cohesionSlider.style('border','2px solid');
    p.separationSlider = p.createSlider(0,5,1,0.1);
    p.separationSlider.position(p.w+260,200+415);
    p.separationSlider.style('border','2px solid');
    p.perceptionSlider = p.createSlider(10,100,60);
    p.perceptionSlider.position(p.w+260,200+485);
    p.perceptionSlider.style('border','2px solid');
    p.maxSpeedSlider = p.createSlider(0.1,5,1,0.1);
    p.maxSpeedSlider.position(p.w+260,200+555);
    p.maxSpeedSlider.style('border','2px solid');
    p.maxForceSlider = p.createSlider(0.1,1,0.2,0.1);
    p.maxForceSlider.position(p.w+260,200+625);
    p.maxForceSlider.style('border','2px solid');
    
    for(i=0;i<100;i++)
    {
      p.flocks.push(new Boid());
    }
  };

  p.draw = function()
  {
    p.background(0);
    p.perception = p.perceptionSlider.value();
    p.maxSpeed = p.maxSpeedSlider.value();
    p.maxForce = p.maxForceSlider.value();
    for(let boid of p.flocks)
      {
        boid.edges();
        boid.flock(p.flocks);
        boid.update();
        boid.show();
      }
  };

};

var FlockSim = new p5(flocksim,'FlockSim');