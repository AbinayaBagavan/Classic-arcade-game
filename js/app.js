var Enemy = function(y) {               //Enemy class
    this.speed=this.calcSpeed();
    this.direction=this.getDirection();         // Variables applied to each of our instances go here,
    if(this.direction==="right")
    {
        this.sprite = 'images/enemy-bug.png';             //image of enemy bugs from left to right
        this.x=-50;
    }  
    else if(this.direction==="left")
    {
        this.sprite= 'images/enemy-bug-left.png';       //image of enemy bugs from right to left
        this.x=450;
    }
    this.y=y*80;
    this.box= {                                         //box around enemy to detect collision with Player
        x:this.x,
        y:this.y+80,
        width:80,
        height:60
    };

    
    return this;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.getDirection=function()                 //for assingning directions randomly left or right
{
    var dirList=["left","right"];
    var direction=dirList[Math.floor(Math.random()*dirList.length)];
    return direction;
};

Enemy.prototype.calcSpeed = function() {                    //to get speed variously
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    var tempSpeed=0;
    tempSpeed=Math.random()*(300-150)+150;
    return tempSpeed;
};

Enemy.prototype.update=function(dt) {               //update the positions to keep bugs moving

    if(this.direction==="right")
    {
        this.x+=(this.speed * dt);
        if(this.x>500)
        {
            //this.x=-50;
            this.resetEnemy();
            //return;
        }    
    }
    else if(this.direction==="left")
    {
        this.x-=(this.speed * dt);
        if(this.x<-50)
        {
            this.resetEnemy();
        }
    }
    
    this.makeBox();
    return;
};

Enemy.prototype.render = function() {                               // Draw the enemy on the screen, required method for game
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
//    this.drawBox(this.box.x,this.box.y,this.box.width,this.box.height,"red");
    //alert("Player render"+Resources.get(this.sprite));
};

Enemy.prototype.makeBox=function() { //update the box info
   this.box.x=this.x;
    this.box.y=this.y+80;
};

Enemy.prototype.drawBox=function(x,y,width,height,color)        //draw box around bug
{
    ctx.beginPath();
    ctx.rect(x,y,width,height);
    ctx.lineWidth=2;
    ctx.strokeStyle=color;
    ctx.stroke();
};

Enemy.prototype.resetEnemy=function() {                     //resets the enemy objects if they gone offscreen
    this.speed=this.calcSpeed();
    this.direction=this.getDirection();
    if(this.direction==="right")
    {
        this.sprite = 'images/enemy-bug.png';
        this.x=-50;
    }    
    else if(this.direction==="left")
    {
        this.sprite= 'images/enemy-bug-left.png';
        this.x=450;
    }
    //this.y=y;
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {                                   //Player class to handle player
    this.sprite = 'images/char-horn-girl.png';              //image of player
    this.x=200;                                             //Initial positions
    this.y=425;
    this.life=5;                                             //Initial lives
    this.box= {                                              //box to detect collision
    width:70,
    height:85,
    boxX:this.x+15,
    boxY:this.y+60
    };
    
    return this;
};

Player.prototype.render=function() {                        //draw player on board
    //alert("Player render"+Resources.get(this.sprite));
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
   // this.drawBox(this.box.boxX,this.box.boxY,this.box.width,this.box.height,"red");
};

Player.prototype.drawBox=function(x,y,width,height,color)       //draw box around player
{
    ctx.beginPath();
    ctx.rect(x,y,width,height);
    ctx.lineWidth=2;
    ctx.strokeStyle=color;
    ctx.stroke();
};

Player.prototype.update=function() {                //to keep player moving inside the canvas alone
    if(this.x<0)                                        //to avoid moving of player offscreen 
    {
        this.x=0;
    }
    else if(this.x>405)
    {
        this.x=405;
    }
    else if(this.y<0)
    {
        this.y=0;
    }
    else if(this.y>425)
    {
        this.y=425;
    }
    else if(this.y===0)                         //checking whether the player reached the Water area
    {
        //alert("You won");
        this.winner();
        return;
    }
    this.makeBox();                     
    this.collisionCheck();
    //this.winner();
    return;
};

Player.prototype.makeBox=function()         //update box info at changing player positions
{
    this.box.boxX=this.x+15;
    this.box.boxY=this.y+60;

};

Player.prototype.handleInput=function(code) {       //handle the keyboard inputs to move player

    switch(code)
    {
        case 'left':
            this.x-=50;
            break;
        case 'right':
            this.x+=50;
            break;
        case 'up':
            this.y-=50;
            break;
        case 'down':
            this.y+=50;
            break;
        default:
            break;
    }
    this.update();

}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies=[];
var player=new Player();
var total=3;
//var enemy=new Enemy(200,400);
for(let i=0;i<total;i++)
{
    var enemyObject=new Enemy(i+1);
    allEnemies.push(enemyObject);
    //alert(allEnemies[i].box);
}

Player.prototype.collisionCheck=function()          //collision detection functions
{
    var playerBox;
    var enemyBox;
    if(allEnemies.length>0)
    {
        for(let i=0;i<allEnemies.length;i++)
    {
        playerBox=this.box;
        //console.log("Collision"+playerBox.width);
        enemyBox=allEnemies[i].box;
        if(playerBox.boxX<enemyBox.x+enemyBox.width &&                      //checking the collision of player and enemy boxes
            playerBox.boxX+playerBox.width>enemyBox.x && 
            playerBox.boxY<enemyBox.y+enemyBox.height && 
            playerBox.height+playerBox.boxY>enemyBox.y)
        {
            //alert("collision occurs");
            this.life-=1;                                                   //reduce life if collision occurs
            var attempt=document.querySelector('life');
            attempt.innerText=this.life;
           // console.log(this.life);
            if(this.life>0)                                                 //if life exists
            {
                    setTimeout(this.reset(),1000);                          //reset player to initial position
            }
            else if(this.life<0)                                            //no more life condition
            {
                this.lose();                                                //game over function
                attempt.innerText=0;
                return;
            }
            
        }    
    }    
    }
    

}

Player.prototype.reset=function() {                 //resets player to initial position
    this.x=200;
    this.y=425;
    this.box.boxX=this.x+18;
    this.box.boxY=this.y+61;
};

Player.prototype.winner=function() {                    //winner declaration if player wins
    //this.resetEnemy();
    var canvas=document.querySelector('canvas');
    var winner=document.querySelector('.winner');
    //alert(canvas.outerHTML);
    canvas.outerHTML=" ";
    this.y=425;
    winner.classList.toggle('hidden');
    return;
};

Player.prototype.lose=function()                    //gameover declaration if player lose
{
    var canvas=document.querySelector('canvas');
    var loss=document.querySelector('.lose');
    //alert(canvas.outerHTML);
    canvas.outerHTML=" ";
    this.y=425;
    loss.classList.toggle('hidden');
    return;  
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

