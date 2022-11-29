/*
 *Animates connected nodes about a grid
 *-------------------------------------  
 *@date:      19th April, 2020  
 *@email:     redutron@protonmail.com
 */  
//set up the gridworm
class GridWorm
{ 
    constructor(point,interval,pointsList,screenWidth,screenHeight)
    {      
        this.radius  = 2;     
        this.xCoord  = point.x; 
        this.yCoord  = point.y; 
        this.interval= interval;
        this.color = this.getColor(1,true);//get random color object
        this.mainColor = this.color.color;//color of the head and body of the girdworm
        this.mainColorIndex = this.color.index;
        this.nColor = this.getColor(1,true);//get another random color object
        this.arrowHeadColor = this.nColor.color;//color of the arrrow points at the head of the gridworm
        this.arrowHeadColorIndex = this.nColor.index; 
        this.pointsList = pointsList;  
        this.screenWidth = screenWidth; 
        this.screenHeight= screenHeight; 
        this.speed   = 5;//the magnitude of the velocity
        this.velocity= this.getVelocity(); 
        this.junctionMemory = [{point:point,velocity:this.velocity}];//memory of each junction visited(helps to construct the worm)
        //the maximum number of junctions a gridworm can keep in memory(this determines how long the gridworm will be)
        this.junctionMemoryLength = 6; 
    } 
    getColor(opacity,isRandom = true,index = 0) 
    { 
        if(opacity < 0 || opacity > 1 || opacity === null || isNaN(opacity))//if opacity is incorrect
        {
            opacity = 1; 
        }
        var colors = 
        [
            `rgba(0,0,0,${opacity})`,`rgba(192,192,192,${opacity})`/*silver*/,`rgba(128,128,128,${opacity})`/*gray*/,`rgba(128,0,0,${opacity})`/*maroon*/,
            `rgba(255,0,0,${opacity})`/*red*/,`rgba(0,255,0,${opacity})`/*lime*/,`rgba(0,0,255,${opacity})`/*blue*/,`rgba(255,0,255,${opacity})`/*fuchsia*/,
            `rgba(128,128,0,${opacity})`/*olive*/,`rgba(0,128,0,${opacity})`/*green*/,`rgba(128,0,128,${opacity})`/*purple*/,
            `rgba(0,128,128,${opacity})`/*teal*/,`rgba(0,0,128,${opacity})`/*navy*/,`rgba(138,57,0,${opacity})`/*brown*/, `rgba(205,133,63,${opacity})`, 
            `rgba(244,164,96,${opacity})`,`rgba(139,105,30,${opacity})`,`rgba(165,42,42,${opacity})`,`rgba(178,34,34,${opacity})`,
            `rgba(220,20,60,${opacity})`,`rgba(255,140,0,${opacity})`,`rgba(255,165,0,${opacity})`,`rgba(255,215,0,${opacity})`,`rgba(184,134,11,${opacity})`,
            `rgba(218,165,32,${opacity})`,`rgba(218,165,32,${opacity})`,`rgba(238,232,170,${opacity})`,`rgba(189,183,107,${opacity})`,`rgba(240,230,140,${opacity})`,  
            `rgba(0,100,0,${opacity})`, `rgba(34,139,34,${opacity})`,`rgba(32,178,170,${opacity})`,`rgba(47,79,79,${opacity})`, 
            `rgba(0,139,139,${opacity})`,`rgba(95,158,160,${opacity})`,`rgba(70,130,180,${opacity})`,`rgba(25,25,112,${opacity})`,
            `rgba(0,0,128,${opacity})`,`rgba(0,0,139,${opacity})`,`rgba(72,61,139,${opacity})`,`rgba(75,0,130,${opacity})`,`rgba(139,0,139,${opacity})`, 
            `rgba(0,0,0,${opacity})`,`rgba(105,105,105,${opacity})`, `rgba(169,169,169,${opacity})` 
        ];
        if(isRandom)
        {
            let index = Math.floor(this.getRandomNumber(0,colors.length-1)); 
            let color = colors[index];
            return {color:color,index:index}; 
        }
        else//if specific
        {
            if(index >=0 && index < colors.length)
            {
                return colors[index];
            } 
            return colors[0];
        } 
    }
    getVelocity() 
    {
        let x,y;
        //flip a coin to decide if gridworm moves vertically or horizontally
        if( Math.random() > 0.5)//if gridworm moves vertically
        {
            x = 0;//no horizontal movement
            y = Math.random() > 0.5? -this.speed: this.speed;//flip a coin to decide if gridworm moves upwards or downwards
        }
        else//if gridworm moves horizontally
        {
            x = Math.random() > 0.5? -this.speed: this.speed;//flip a coin to decide if gridworm moves left or right
            y = 0;//no vertical movement
        } 
        return {x:x, y:y};
    }
    /**
    * Returns a random number between min (inclusive) and max (exclusive)
    * @param  {number} min The lesser of the two numbers. 
    * @param  {number} max The greater of the two numbers.  
    * @return {number} A random number between min (inclusive) and max (exclusive)
    */
    getRandomNumber(min, max) 
    {
        return Math.random() * (max - min) + min;
    }
    drawCircle(x,y,circleradius,ctx,colorIndex) 
    {
        for(let i = 0; i < 3; i++)
        {
            let color   = '';  
            let radius = 0; 
            switch(i)//create three circles with same center
            {
                case 0: 
                    radius  =circleradius;//smallest circle
                    color   = this.getColor(1,false,colorIndex); 
                    break; 
                case 1: 
                    radius  =circleradius *   2;//bigger circle 
                    color   = this.getColor(0.5,false,colorIndex);             
                    break; 
                case 2: 
                    radius  =circleradius *   6;//biggest circle 
                    color   = this.getColor(0.2,false,colorIndex); 
                    break; 
            }
            //draw the node
            ctx.beginPath(); 
            ctx.arc(x,y,radius,0,2*Math.PI);
            ctx.fillStyle = color; 
            ctx.fill(); 
            ctx.strokeStyle = color;
            ctx.stroke();
        }
    }
    drawArrowHead(x,y,circleradius,ctx,colorIndex) 
    { 
        let points = [];  
        if(this.velocity.x === 0)//if gridworm is moving vertically
        {
            if(this.velocity.y > 0)//if gridworm is moving down
            {
                points.push({x:x+this.interval/3,y:y});//point to the right
                points.push({x:x-this.interval/3,y:y});//point to the left 
                points.push({x:x,y:y+this.interval/3});//point below 
            }
            else//if gridworm is moving up
            {
                points.push({x:x+this.interval/3,y:y});//point to the right
                points.push({x:x-this.interval/3,y:y});//point to the left
                points.push({x:x,y:y-this.interval/3});//point above  
            }
        }
        else//if gridworm is moving horizontally
        {
            if(this.velocity.x > 0)//if gridworm is moving right
            {
                points.push({x:x+this.interval/3,y:y});//point to the right 
                points.push({x:x,y:y-this.interval/3});//point above
                points.push({x:x,y:y+this.interval/3});//point below 
            }
            else//if gridworm is moving left
            {     
                points.push({x:x-this.interval/3,y:y});//point to the left
                points.push({x:x,y:y-this.interval/3});//point above
                points.push({x:x,y:y+this.interval/3});//point below 
            }
        }
        //draw a circle about the points that make the arrow head
        for(let i = 0; i < points.length;i++)
        {
            let point = points[i];
            this.drawCircle(point.x,point.y,circleradius/2,ctx,colorIndex); 
        } 
        this.drawTriangle(points[0],points[1],points[2],ctx);//draw the arrow head 
    }
    drawTriangle(point1,point2,point3,ctx)
    {
        ctx.beginPath();
        ctx.moveTo(point1.x, point1.y);
        ctx.lineTo(point2.x, point2.y);
        ctx.lineTo(point3.x, point3.y);  
        ctx.fillStyle = 'rgba(0,0,0,0.1)';//transparent black  
        ctx.fill();   
    }
    draw(ctx)
    {    
        //draw the head of the gridworm 
        this.drawCircle(this.xCoord,this.yCoord,this.radius/2,ctx,this.mainColorIndex); 
        this.drawArrowHead(this.xCoord,this.yCoord,this.radius/2,ctx,this.arrowHeadColorIndex); 
        //draw circles and squares at every visited junctions in the gridworm's memory(not RAM)
        for(let i = 0; i < this.junctionMemory.length; i++)
        {   
            let junction = this.junctionMemory[this.junctionMemory.length -(i+1)];
            //draw a circle at each junction point
            this.drawCircle(junction.point.x, junction.point.y,this.radius/2,ctx,this.mainColorIndex);  
            //draw painted squares at every junction point
            ctx.fillStyle   = this.getColor(0.1,false,this.mainColorIndex); 
            ctx.fillRect(junction.point.x,junction.point.y,this.interval,this.interval);
            
        } 
        //draw the line connecting head to body
        ctx.strokeStyle = 'black';
        ctx.lineWidth = this.radius; 
        ctx.beginPath(); 
        ctx.moveTo(this.xCoord,this.yCoord); 
        //draw a line to link all the visited junctions in the gridworm's memory(not RAM)
        for(let i = 0; i < this.junctionMemory.length; i++)
        {   //starting from the most recent to the least recent(LIFO)[NB: more like a stack data structure]
            let junction = this.junctionMemory[this.junctionMemory.length -(i+1)]; 
            ctx.lineTo(junction.point.x, junction.point.y);   
        } 
        ctx.stroke(); 
        ctx.closePath(); 
    } 
    update(deltaTime)
    {       
        this.junctionMemoryLength = this.junctionMemoryLength < 1? 1: this.junctionMemoryLength; 
        //keep the gridworm moving in its current direction  
        this.xCoord += this.velocity.x;//if gridworm is going left or right, keep it going
        this.yCoord += this.velocity.y;//if gridworm is going up or down, keep it going   
        if(this.xCoord <= this.interval)//if gridworm reaches the leftmost point 
        {
            this.xCoord = this.interval;
            this.velocity.x  = -this.velocity.x;//move right 
            this.xCoord += this.velocity.x * 3;//nudge it a bit away from the edge
        }
        if(this.xCoord >= this.screenWidth - this.interval)//if gridworm reaches the rightmost point
        {
            this.xCoord = this.junctionMemory[this.junctionMemory.length-1].point.x; 
            this.velocity.x  = -this.velocity.x;//move left 
            this.xCoord += this.velocity.x * 3;//nudge it a bit away from the edge
        }
        if(this.yCoord <= this.interval)//if gridworm reaches the topmost most point
        {
            this.yCoord  = this.interval; 
            this.velocity.y  = -this.velocity.y; //move down
            this.yCoord  += this.velocity.y * 3;//nudge it a bit away from the edge
        }
        if(this.yCoord >= this.screenHeight - this.interval)//if gridworm reaches the lowest point) 
        {
            this.yCoord  = this.junctionMemory[this.junctionMemory.length-1].point.y; 
            this.velocity.y  = -this.velocity.y;//move up
            this.yCoord  += this.velocity.y * 4;//nudge it a bit away from the edge
        }
        let currentCoord    = {x:this.xCoord,y:this.yCoord}; 
        let latestJunction  = this.getJunctionReached(currentCoord); 
        if(latestJunction !== currentCoord)
        {   
            let originalVelocity = this.velocity; 
            let newVelocity = this.getVelocity();//flip a coin to decide to move up and down or right and left  
            if(originalVelocity.y === 0 )//if gridworm is moving horizontally
            {
                this.velocity = newVelocity;
                if(newVelocity.y === 0 && newVelocity.x === -originalVelocity.x )//if it continues the horizontal movement in the opposite direction
                {
                    //don't add the new junction to the memory queue
                }
                else 
                {
                    let memory = {point:latestJunction,velocity:this.velocity}; 
                    if(!this.isInMemory(memory))
                    {
                        this.junctionMemory.push(memory);//add new memory to the queue
                    }
                    //this.junctionMemory.push({point:latestJunction,velocity:this.velocity});//add new memory to the queue
                }
                //nudge it a bit away from the junction
                this.xCoord += this.velocity.x * 3; //not complete yet. Don't make it too much or too little.  
            }
            else //if gridworm is moving vertically 
            {
                this.velocity = newVelocity;
                if(newVelocity.x === 0 && newVelocity.y === -originalVelocity.y )//if it continues the verticalal movement in the opposite direction
                {
                    //don't add the new junction to the memory queue
                }
                else 
                {
                    let memory = {point:latestJunction,velocity:this.velocity}; 
                    if(!this.isInMemory(memory))
                    {
                        this.junctionMemory.push(memory);//add new memory to the queue
                    } 
                }
                //nudge it a bit away from the junction
                this.yCoord += this.velocity.y * 3; //not complete yet. Don't make it too much or too little. 
            } 
        }
        if(this.junctionMemory.length > this.junctionMemoryLength)//if memory is too long
        {
            this.junctionMemory.shift();//remove the first memory
        } 
    }  
    isInMemory(memory)//check if a junction is in memory
    { 
        this.junctionMemory.some(function(mem)
        {
            if(mem.point === memory.point)
            { 
                return true;//junction is in memory
            }
            return mem.point === memory.point; 
        }); 
        return false;//junction is NOT in memory
    }
    getJunctionReached(currentCoord)
    {
        for(let i = 0; i < this.pointsList.length; i++)
        {
            let point = this.pointsList[i];
            //if point(junction) is too far away, ignore it 
            if(Math.abs(currentCoord.x - point.x) > (2 * this.interval) || Math.abs(currentCoord.y - point.y) > (2 *this.interval) )
            {
                continue; 
            }
            let distance = this.getDistance(currentCoord,point);  
            if(distance <= (this.radius))//if gridworm head is close enough to a junction
            {  
                return point;  
            }
        } 
        return currentCoord;  
    }     
    getDistance(p1,p2)//the distance between two points, p1 and p2
    {
        let dx = p1.x - p2.x; 
        let dy = p1.y - p2.y; 
        let distance = Math.sqrt(dx*dx + dy*dy);
        return distance; 
    }
    
    
    /**
    * Let node correspond to window resizing.
    * @param  {number} screenHeight The height of the screen. 
    * @param  {number} screenWidth  The width of the screen.  
    * @param  {number} dy           The percentage change in browser window height 
    * @param  {number} dx           The percentage change in browser window width  .  
    */
    refreshScreenSize(screenHeight,screenWidth,dx,dy,points)
    {     
        
    }   
}

//sets up and controls all points and gridworms on the canvas 
class Painter
{
    constructor(screenWidth,screenHeight)
    {      
        this.screenWidth    = screenWidth;
        this.screenHeight   = screenHeight;   
        this.interval       = 40;//interval from one point to the next 
        this.points         = this.createPoints(); //coordinates of the vertices of all squares when the canvas is partitioned
        this.gridWorms      = this.createGridWorms(); 
        this.color          = this.getRandomColor(0.1);
        document.addEventListener('click',(event)=>//when user clicks on the canvas
        {   
            this.points     = this.createPoints();
            this.gridWorms  = this.createGridWorms();//spawn new gridworms
            this.color          = this.getRandomColor(0.1);
        });
    } 
    createGridWorms() 
    {
        let gridworms = [],
            numOfGridWorms = 30; 
        for(var i = 0; i < numOfGridWorms; i++)
        { 
            let point = this.points[Math.floor(this.getRandomNumber(0,this.points.length-1))];//randomly select a point
            gridworms.push(new GridWorm(point,this.interval,this.points,this.screenWidth,this.screenHeight));
        }
        return gridworms; 
    }
    createPoints()//divide the canvas into squares 
    {
        let points = [], 
            interval = this.interval;//interval from one point to the next 
        for(var y = interval; y < this.screenHeight; y+=interval)//get all points in the grid, starting from the top to the bottom
        { 
            if(y+interval > this.screenHeight)//if the next point is beyond the right edge of the canvas
            {
                continue; //skip
            } 
            for(var x = interval; x < this.screenWidth; x+=interval)//all the while, getting all the horizontal points at each level 
            { 
                if(x+interval > this.screenWidth)//if the next point is beyond the bottom edge of the canvas
                { 
                    continue; //skip
                } 
                points.push({x:x,y:y}); 
            } 
        }
        return points;  
    }  
    getRandomColor(opacity)
    {
        var colors = [
            `rgba(255,0,0,      ${opacity})`,//red
            `rgba(255, 242,0,   ${opacity})`,//yellow, 
            `rgba(0,0,255,      ${opacity})`,//blue
            `rgba(255,255,0,    ${opacity})`,//yellow
            `rgba(0,255,255,    ${opacity})`,//cyan
            `rgba(255,0,255,    ${opacity})`,//magenta/fuchsia
            `rgba(192,192,192,  ${opacity})`,//silver
            `rgba(128,128,128,  ${opacity})`,//gray 
            `rgba(128,0,0,      ${opacity})`,//maroon
            `rgba(128,128,0,    ${opacity})`,//olive
            `rgba(0,128,0,      ${opacity})`,//green
            `rgba(128,0,128,    ${opacity})`,//purple 
            `rgba(0,128,128,    ${opacity})`,//teal
            `rgba(0,0,128,      ${opacity})`,//navy 
            `rgba(0, 255, 0,    ${opacity})`,//green
            `rgba(77, 0, 255,   ${opacity})`,//blue
            `rgba(255, 0, 140,  ${opacity})`,//purple
            `rgba(0,255,0,      ${opacity})`//lime
        ];
        return colors[parseInt(this.getRandomNumber(0, colors.length))];
    }
    /**
    * Returns a random number between min (inclusive) and max (exclusive)
    * @param  {number} min The lesser of the two numbers. 
    * @param  {number} max The greater of the two numbers.  
    * @return {number} A random number between min (inclusive) and max (exclusive)
    */
    getRandomNumber(min, max) 
    {
        return Math.random() * (max - min) + min;
    } 
    /**
    * Let canvas respond to window resizing.
    * @param  {number} screenHeight The height of the screen. 
    * @param  {number} screenWidth  The width of the screen.  
    */
    refreshScreenSize(screenHeight,screenWidth)
    {   
        if(this.screenHeight !== screenHeight || this.screenWidth !== screenWidth)//if the screen size has changed
        {  
            this.screenHeight   = screenHeight;  
            this.screenWidth    = screenWidth;   
            this.points         = this.createPoints(); //coordinates of the vertices of all squares when the canvas is partitioned
            this.gridWorms      = this.createGridWorms();  
        } 
    }  
    update(deltaTime)
    {     
       this.gridWorms.forEach(function(gridworm)
        {
            gridworm.update(deltaTime); 
        }); 
    }  
    draw(ctx)
    {    
        /*
        for(var i = 0; i < this.points.length; i++)
        {
            let point = this.points[i];
            ctx.fillStyle   = Math.random() > 0.5? this.color:'white';//creates a disco effect 
            ctx.fillRect(point.x,point.y,this.interval,this.interval);
        }
        */
        this.gridWorms.forEach(function(gridworm)
        {
            gridworm.draw(ctx); 
        }); 
    }   
}

//set everything up 
function getBrowserWindowSize() 
{
    let win = window,
    doc     = document,
    offset  = 20,//
    docElem = doc.documentElement,
    body    = doc.getElementsByTagName('body')[0],
    browserWindowWidth  = win.innerWidth || docElem.clientWidth || body.clientWidth,
    browserWindowHeight = win.innerHeight|| docElem.clientHeight|| body.clientHeight; 
    return {x:browserWindowWidth-offset,y:browserWindowHeight-offset}; 
} 
let browserWindowSize   = getBrowserWindowSize(),
c   = document.getElementById("gridwormCanvas"),
ctx = c.getContext("2d"); 
//set size of canvas
c.width          = browserWindowSize.x; 
c.height         = browserWindowSize.y; 
let SCREEN_WIDTH = browserWindowSize.x,
    SCREEN_HEIGHT= browserWindowSize.y,   
    painter      = new Painter(SCREEN_WIDTH,SCREEN_HEIGHT),  
    lastTime     = 100,  
    windowSize;   
function onWindowResize()//called every time the window gets resized. 
{  
    windowSize     = getBrowserWindowSize();
    c.width        = windowSize.x; 
    c.height       = windowSize.y; 
    SCREEN_WIDTH   = windowSize.x;
    SCREEN_HEIGHT  = windowSize.y;  
}
window.addEventListener('resize',onWindowResize); 
function updateCanvas()
{
    ctx.clearRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);    
    ctx.fillStyle   = 'white';  
    ctx.fillRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
}
function doAnimationLoop(timestamp)
{           
    updateCanvas();
    painter.refreshScreenSize(SCREEN_HEIGHT,SCREEN_WIDTH);//let canvas respond to window resizing  
    let deltaTime  = timestamp - lastTime; 
        lastTime   = timestamp;
    painter.update(deltaTime);   
    painter.draw(ctx);  
    requestAnimationFrame(doAnimationLoop); 
} 
requestAnimationFrame(doAnimationLoop);