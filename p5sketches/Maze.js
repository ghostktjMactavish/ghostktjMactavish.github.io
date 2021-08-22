var MazeGen = function(p)
{
    p.cols,p.rows;
    p.w = 40;
    p.grid = [];
    p.curr;
    p.stack = [];
    p.stacklen = 0;
    p.cr = p.random(255);
    p.cg = p.random(255);
    p.cb = p.random(255);

    class Q
    {
        constructor()
        {
            this.items = [];
        }

        enque(x)
        {
            this.items.push(x);
        }

        len()
        {
            return this.items.length;
        }

        isEmpty()
        {
            return (this.len()>0) ? false : true;
        }

        deque()
        {
            if(this.isEmpty())
                return this.items;
            return this.items.shift();
        }

        printQ()
        {
            for(let item of this.items)
                console.log(item);
        }

    }

    class Cell
    {

        // walls = [];
        constructor(i,j)
        {
            this.i = i;
            this.j = j;
            this.walls = [true,true,true,true];
            this.visited = false;
            this.highlight = false;
            this.x = this.i*p.w;
            this.y = this.j*p.w;
        }

        show()
        {
            p.stroke(255);
            if(this.walls[0])
            {
                // Top wall
                p.line(this.x,    this.y, this.x + p.w,   this.y);
            }
            if(this.walls[1])
            {
                // Right p.wall
                p.line(this.x+p.w,    this.y, this.x + p.w,   this.y+p.w);
            }
            if(this.walls[2])
            {
                // Bottom Wall
                p.line(this.x+p.w,    this.y+p.w, this.x ,   this.y+p.w);
            }
            if(this.walls[3])
            {
                // Left Wall
                p.line(this.x,    this.y+p.w, this.x,   this.y);
            }

            if(this.visited)
            {
                
                p.fill(p.cr,p.cg*(1-p.int(this.highlight)),0,100);
                p.noStroke();
                p.rect(this.x,this.y,p.w,p.w);
            }

        }

    }
    p.qu = new Q();

    p.showgrid = function()
    {
        for(let i = 0 ; i < p.cols ; i++)
            for(let j = 0; j < p.rows; j++)
                p.grid[i][j].show();
    }

    p.getNeighbors = function(curr)
    {
        // returns unvisited neighbors of current cell
        var i = curr.i;
        var j = curr.j;
        var nbrs = [];
        if((i-1)>=0)
            if(!p.grid[i-1][j].visited)
                nbrs.push(p.grid[i-1][j]);
        if((i+1)<p.cols)
            if(!p.grid[i+1][j].visited)
                nbrs.push(p.grid[i+1][j]);
        if((j-1)>=0)
            if(!p.grid[i][j-1].visited)
                nbrs.push(p.grid[i][j-1]);
        if((j+1)<p.rows)
            if(!p.grid[i][j+1].visited)
                nbrs.push(p.grid[i][j+1]);
        if(nbrs.length == 0)
            return [];
        
        return nbrs; //nbrs.sort( ()=>Math.random()-0.5 );    
    }

    p.nnbrs = function(curr)
    {
        var nbrs = p.getNeighbors(curr);
        return nbrs.length;
    }

    p.step = function(next,curr) 
    {
        // randomly choos a nbr
        // unhighlight current cell
        curr.highlight = false;
        // move to next cell
        curr = next;
        // visit next cell
        curr.visited = true;
        // highlight next cell
        curr.highlight = true;
        
        return curr;
    }

    p.bfs = function(curr)
    {
        var nbrs = p.getNeighbors(curr);
        if(nbrs.length>0)
        {
            for( let nb of nbrs)
            {
                p.qu.enque(nb);
            }
        }
        if(p.qu.len()>0)
        {
            var top = p.qu.deque();
            while(top.visited)
                top = p.qu.deque(); 
            curr = step(top,curr);
            return curr;
        }
        else
        {
            // console.log("End");
            p.noLoop();
            return curr;
        }
    }

    p.dfs = function(curr)
    {
        var nbrs = p.getNeighbors(curr);
        if(nbrs.length>0)
        {
            for( let nb of nbrs)
            {
                p.stack.push(nb);
            }
        }
        if(p.stack.length>0)
        {
            var top = p.stack.pop();
            while(top.visited)
                top = p.stack.pop();
            curr = p.step(top,curr);
            return curr;
        }
        else
        {
            // console.log("End");
            p.noLoop();
            return curr;
        }
    }


    p.random_move = function(curr)
    {
        var nbrs = p.getNeighbors(curr);
        var l = nbrs.length;
        if( l > 0 )
        {
            var r = p.floor(p.random(0,l));
            curr.highlight = false;
            curr = nbrs[r];
            curr.visited = true;
            curr.highlight = true;
        }
        return curr;
    }

    p.removeWalls = function(next,curr)
    {
        var top = curr.i - next.i;
        var right = curr.j - next.j;
        if(top == 0)
        {
            if(right>0)
            {
                // Along the same x co-ordinate moving up
                curr.walls[0] = false;
                next.walls[2] = false;
                
            }
            else
            {
                curr.walls[2] = false;
                next.walls[0] = false;
            }
        }
        else if(right == 0)
        {
            if(top>0)
            {
                curr.walls[3] = false;
                next.walls[1] = false;
            }
            else
            {
                curr.walls[1] = false;
                next.walls[3] = false;
            }
        }
    }

    p.backtrack = function(curr)
    {
        
        var nbrs = p.getNeighbors(curr);
        var l = nbrs.length;
        if(l>0)
        {
            p.stack.push(curr);
            p.stacklen+=1;
            // randomly select a nbr and proceed
            var r = p.floor(p.random(0,l));
            p.removeWalls(nbrs[r],curr);
            curr = p.step(nbrs[r],curr);
        }
        else
        {
            if(p.stack.length>0)
            {
                var top = p.stack.pop();
                curr = p.step(top,curr);
                
            }
            if(p.stacklen==0)
            {   
                // console.log("End");
                p.noLoop();
                return undefined;
            }
        }

        return curr;
    }

    p.setup = function()
    {
        p.createCanvas(800, 800);
        p.cols = p.floor(p.width  / p.w );
        p.rows = p.floor(p.height / p.w) ;
        // console.log(cols + " " + rows);
        // console.log(height + " " + width);
        // frameRate(5);
        for(let i = 0 ; i < p.cols ; i++)
        {
            p.grid.push([]); 
            // console.log(typeof grid[i]);
            for(let j = 0; j < p.rows; j++)
            {
                cell = new Cell(i,j);
                p.grid[i].push(cell);
            }
        }

        p.curr = p.grid[5][5];
        p.curr.visited = true;
        p.curr.highlight = true;
        
    }



    p.draw = function()
    {
        p.background(51);
        p.showgrid();
        p.curr = p.backtrack(p.curr);
    }

};


var Maze = new p5(MazeGen,'MazeGen');