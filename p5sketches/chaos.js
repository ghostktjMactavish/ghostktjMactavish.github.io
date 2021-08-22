
var chaos = function(p)
{
    p.x,p.y;
    p.a = 300;
    p.b = 400;
    p.n = 5;
    p.p = 0.6;
    p.fps = [];
    p.clrs = [];
    p.prev = 0;
    p.setup = function() 
    {
        p.createCanvas(800,800);
        p.background(51);
        p.stroke([255,255,255,5]);
        p.strokeWeight(2);
        p.frameRate(10);
        for(let i = 0; i<p.n;i++)
        {
            p.fps.push([p.b+p.a*p.cos(i*p.TWO_PI/p.n),p.b+p.a*p.sin(i*p.TWO_PI/p.n)]);
            p.clrs.push([p.random(50,255),p.random(50,255),p.random(50,255)]);
            p.point(p.fps[i][0],p.fps[i][1]);
        }
        
        p.x = p.floor(p.random(p.width));
        p.y = p.floor(p.random(p.height));

        p.stroke(255,0,255);
        p.point(p.x,p.y);
    };

    p.draw = function()
    {
        
        for(let i = 0; i<100;i++)
        {
            let r = p.floor(p.random(p.n));
            if(r!=p.prev)
            {
                p.x = p.lerp(p.x,p.fps[r][0],p.p);
                p.y = p.lerp(p.y,p.fps[r][1],p.p);
                p.stroke(p.clrs[r]);
                p.point(p.x,p.y);
                p.prev = r;
            }
        
        }
    };
};

var chaosFractal = new p5(chaos,'ChaosFractal');