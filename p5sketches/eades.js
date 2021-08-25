var eades = function(p)
{
    p.n = 55;
    p.w = 800;
    p.h = 800;
    p.graph;
    p.l = 100;
    p.attr = p.l*0.5;
    p.repl = p.l*10;
    p.K = 1000;
    p.thresh = 1000;
    // p.resetButton = p.createButton('Reset');
    // p.resetButton.position(p.w+90,p.h+100);
    // p.buttonA = p.createButton("Align");
    // p.buttonA.position(p.w+90,200+260)
    // p.resetButton.mouseClick(p.resetSketch);
    p.node = function(val,x,y)
    {
        this.value = val;
        this.edges = [];
        this.x = x;
        this.y = y;
        this.visited = false;
        this.parent = null;
    };

    p.node.prototype.addEdge = function(n)
    {
        //Undirected graph
        this.edges.push(n);
        n.edges.push(this);
    };

    p.node.prototype.setPos = function()
    {
        if(this.x<10)
            this.x=10;
        if(this.x>(p.w-10))
            this.x=p.w-10;
        if(this.y<10)
            this.y=10;
        if(this.y>(p.h-10))
            this.y=p.h-10;
    };

    p.Graph = function()
    {
        this.nodes = [];
        this.g = {};
        this.start = null;
        this.end = null;   
    }

    p.Graph.prototype.addNode = function(n)
    {
        this.nodes.push(n);
        this.g[n.value] = n;
    };

    p.Graph.prototype.getNode = function(n)
    {
        return this.g[n];
    };

    p.Graph.prototype.setStart = function(n)
    {
        this.start = n;
        return this.start;
    };

    p.Graph.prototype.setEnd = function(n)
    {
        this.end = n;
        return this.end;
    };

    p.Graph.prototype.showNodes = function()
    {
        for(let i of this.nodes)
        {
            p.stroke(255);
            p.ellipse(i.x,i.y,8);
        }

    };

    p.Graph.prototype.showEdges = function()
    {
        for(let i of this.nodes)
        {
            for(let j of i.edges)
            {
                p.stroke(255);
                p.strokeWeight(1);
                p.line(i.x,i.y,j.x,j.y);
            }
            
        }

    };

    p.Graph.prototype.show = function()
    {
        this.showNodes();
        this.showEdges();
    };

    p.setup = function()
    {
        
        p.graph = new p.Graph();
        var canvas = p.createCanvas(p.w,p.h);
        // canvas.position(100,100);
        p.background(51);
        p.frameRate(20);
        let a = new p.node(p.random(255),p.w/2,p.h/2);
        p.graph.addNode(a);
        for (let i = 0; i<p.n; i++)
        {   let x = p.w/2+150*p.cos(i*p.TWO_PI/p.n);
            let y = p.w/2+150*p.sin(i*p.TWO_PI/p.n);
            let b = new p.node(p.random(255),p.random(p.w-10),p.random(p.h-10));
            // b.addEdge(a);
            if(p.random(2) && p.graph.nodes.length>2)
            {
                let r = p.floor(p.random(p.graph.nodes.length));
                b.addEdge(p.graph.nodes[r]);
            }
            p.graph.addNode(b);
        }
        p.graph.show();
    };

    p.force_draw = function(epsilon,K)
    {
        let l = 80;
        let eps = 0.0000001;
        let F_netx = [];
        let F_nety = [];
        let delta = 0.9 -(1000-K)/1000;
        //exp(-0.001*K);
        let max = 0;
        let min = 1000000000;

        for(let i = 0;i<p.graph.nodes.length;i++)
        {
            let F_attrx = 0;
            let F_attry = 0;
            let F_replx = 0;
            let F_reply = 0;
            let n = p.graph.nodes[i];
            //attractive force
            for(let m of n.edges)
            {

                let d = p.dist(n.x,n.y,m.x,m.y)+eps;
                let f = p.attr*p.log(d/l)-p.repl/(d*d);

                F_attrx += f*(m.x-n.x)/d;
                F_attry += f*(m.y-n.y)/d;
                
            }
            for(let j=0;j<p.graph.nodes.length;j++)
            {
                if(j!=i)
                {
                    let m = p.graph.nodes[j];
                    let d = p.dist(n.x,n.y,m.x,m.y)+eps;
                    let f = p.repl/(d*d);
                    F_replx += f*(n.x-m.x)/d;
                    F_reply += f*(n.y-m.y)/d;
                }
            }
            let Fx = F_attrx+F_replx;
            let Fy = F_attry+F_reply;
            F_netx.push(Fx);
            F_nety.push(Fy);
            let Fn = p.dist(Fx,Fy,0,0);
            console.log(p.dist(F_replx,F_reply,0,0) + "  " +p.dist(F_attrx,F_attry,0,0) );
            if(Fn>max)
                max=Fn;
            if(Fn<min)
                min=Fn;
        }
            for(let i=0;i<p.graph.nodes.length;i++)
            {
                let n = p.graph.nodes[i];
                n.x += delta*F_netx[i];
                n.y += delta*F_nety[i];
                n.setPos();
            }
    };
    p.draw = function()
    {
        p.background(51);
        if(p.K>0)
        {
            p.force_draw(1,p.K);
            p.K--;
        }
        p.graph.show();
    };

    p.resetSketch = function()
    {
        p.K = 1000;
        p.setup();
    };


};

var Eades = new p5(eades,'Eades');


// let n = 55;
// let w = 800;
// let h = 800;
// let graph;
// let l = 100;
// let attr = l*0.5;
// let repl = l*10;
// let K = 1000;
// let thresh = 1000;
// function node(val,x,y)
// {
//     this.value = val;
//     this.edges = [];
//     this.x = x;
//     this.y = y;
//     this.visited = false;
//     this.parent = null;
// }

// node.prototype.addEdge = function(n)
// {
//     //Undirected graph
//     this.edges.push(n);
//     n.edges.push(this);
// };

// node.prototype.setPos = function()
// {
//     if(this.x<10)
//         this.x=10;
//     if(this.x>(w-10))
//         this.x=w-10;
//     if(this.y<10)
//         this.y=10;
//     if(this.y>(h-10))
//         this.y=h-10;
// };

// function Graph()
// {
//     this.nodes = [];
//     this.g = {};
//     this.start = null;
//     this.end = null;   
// }

// Graph.prototype.addNode = function(n)
// {
//     this.nodes.push(n);
//     this.g[n.value] = n;
// };

// Graph.prototype.getNode = function(n)
// {
//     return this.g[n];
// };

// Graph.prototype.setStart = function(n)
// {
//     this.start = n;
//     return this.start;
// };

// Graph.prototype.setEnd = function(n)
// {
//     this.end = n;
//     return this.end;
// };

// Graph.prototype.showNodes = function()
// {
//     for(let i of this.nodes)
//     {
//         stroke(255);
//         ellipse(i.x,i.y,8);
//     }

// };

// Graph.prototype.showEdges = function()
// {
//     for(let i of this.nodes)
//     {
//         for(let j of i.edges)
//         {
//             stroke(255);
//             strokeWeight(1);
//             line(i.x,i.y,j.x,j.y);
//         }
        
//     }

// };

// Graph.prototype.show = function()
// {
//     this.showNodes();
//     this.showEdges();
// };

// function UB(a)
// {
//     if(a>0&&a>thresh)
//         return thresh;
//     if(a<0&&a<(-thresh))
//         return -thresh;
//     //*a/(abs(a));
//     return a;
// }

// function setup()
// {
    
//     graph = new Graph();
//     var canvas = createCanvas(w,h);
//     canvas.position(100,100);
//     background(51);
//     frameRate(20);
//     let a = new node(random(255),w/2,h/2);
//     graph.addNode(a);
//     for (let i = 0; i<n; i++)
//     {   let x = w/2+150*cos(i*TWO_PI/n);
//         let y = w/2+150*sin(i*TWO_PI/n);
//         let b = new node(random(255),random(w-10),random(h-10));
//         // b.addEdge(a);
//         if(random(2) && graph.nodes.length>2)
//         {
//             let r = floor(random(graph.nodes.length));
//             b.addEdge(graph.nodes[r]);
//         }
//         graph.addNode(b);
//     }
//     graph.show();
// }

// function force_draw(epsilon,K)
// {
//     let l = 80;
//     let eps = 0.0000001;
//     let F_netx = [];
//     let F_nety = [];
//     let delta = 0.6 + 1/(1000-K+3);
//     //exp(-0.001*K);
//     let max = 0;
//     let min = 1000000000;

//     for(let i = 0;i<graph.nodes.length;i++)
//     {
//         let F_attrx = 0;
//         let F_attry = 0;
//         let F_replx = 0;
//         let F_reply = 0;
//         let n = graph.nodes[i];
//         //attractive force
//         for(let m of n.edges)
//         {

//             let d = dist(n.x,n.y,m.x,m.y)+eps;
//             let f = attr*log(d/l)-repl/(d*d);

//             F_attrx += f*(m.x-n.x)/d;
//             F_attry += f*(m.y-n.y)/d;
            
//         }
//         for(let j=0;j<graph.nodes.length;j++)
//         {
//             if(j!=i)
//             {
//                 let m = graph.nodes[j];
//                 let d = dist(n.x,n.y,m.x,m.y)+eps;
//                 let f = repl/(d*d);
//                 F_replx += f*(n.x-m.x)/d;
//                 F_reply += f*(n.y-m.y)/d;
//             }
//         }
//         let Fx = F_attrx+F_replx;
//         let Fy = F_attry+F_reply;
//         F_netx.push(Fx);
//         F_nety.push(Fy);
//         let Fn = dist(Fx,Fy,0,0);
//         console.log(dist(F_replx,F_reply,0,0) + "  " +dist(F_attrx,F_attry,0,0) );
//         if(Fn>max)
//             max=Fn;
//         if(Fn<min)
//             min=Fn;
//     }
//         for(let i=0;i<graph.nodes.length;i++)
//         {
//             let n = graph.nodes[i];
//             n.x += delta*F_netx[i];
//             n.y += delta*F_nety[i];
//             n.setPos();
//         }
// }

// function draw()
// {
//     background(51);
//     if(K>0)
//     {
//         force_draw(1,K);
//         K--;
//     }
//     graph.show();
// }