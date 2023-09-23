var canvas,context;
var scoreCanvas,scoreContext;
var stopGame=false;
var requestID;

// A cross-browser requestAnimationFrame and cancelAnimationFrame
// See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
var requestAnimFrame = (function(){
		return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback){
			return window.setTimeout(callback, 1000 / 60);
		};
	})();
	
var cancelAnimFrame = (function(){
		return window.cancelAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(){
			window.clearTimeout(requestID);
		};
	})();

var wall = function(x){
	this.x = x;
	this.lastx = x;
	this.width = 50;
	this.gapWidth = 100;
	this.upperBorder = Math.floor(Math.random()*375) + 25;
	this.lowerBorder = this.upperBorder + this.gapWidth;
	this.lowerHeight = 500 - this.lowerBorder;

	this.renew = function(){
		context.fillStyle = "white";
		context.fillRect(0,0,Math.round(this.lastx + this.width),500);
		this.x += 1250;
		this.lastx = this.x;
		this.upperBorder = Math.floor(Math.random()*375) + 25;
		this.lowerBorder = this.upperBorder + this.gapWidth;
		this.lowerHeight = 500 - this.lowerBorder;
		step = step * 1.2;
		score++;
		scoreContext.clearRect(650,0,150,100);
		var scoreText = "Score: "+score.toString();
		scoreContext.fillText(scoreText,650,25);
		};

	this.move = function(step){
		this.lastx = this.x;
		this.x -= step;
		if (this.x <= -this.width){
			this.renew();
		};
	}
};

function collision(me,obj){
		if ((me.x<=obj.x+obj.width) && (me.x+me.width>=obj.x) && ((me.y<=obj.upperBorder) || (me.y+me.height>=obj.lowerBorder))){
			return true;
		} else{
		return false;
	}
}

//Array of scene objects
var objects = new Array();
var step, score;
function init() {
	step = 2;
	score = 0;
	//Creating main character
	objects[0] = {
		x : 25,
		dx : 0,
		y : 225,
		dy : 0,
		height: 50,
		width: 50,
		myStep: 0,
		move : function(step){
			if (this.y+step<=450 && this.y+step>=0){
				this.y += step;
				this.dy = step;
			};
		}
	};
	//Creating walls
	for (i=1;i<=5;i++){
		objects[i] = new wall(i*250);
	};
}

function updateScene(dt){
	for (i=1;i<=5;i++){
		objects[i].move(step);
	};
	//i'll leave it here for the first time
	objects[0].myStep = 0;
	if (38 in keysPressed) objects[0].myStep -= 150;
	if (40 in keysPressed) objects[0].myStep += 150;
	//Crappy...
	objects[0].move(Math.round(step*0.9*objects[0].myStep*dt));
}

/**
 * Draws rectangle on ctx by given coordinates of opposite vertices
 **/   
function drawRectXY(ctx,x1,y1,x2,y2)
{
	ctx.beginPath();
	ctx.moveTo(Math.round(x1),Math.round(y1));
	ctx.lineTo(Math.round(x1),Math.round(y2));
	ctx.lineTo(Math.round(x2),Math.round(y2));
	ctx.lineTo(Math.round(x2),Math.round(y1));
	ctx.closePath();
}

/**
 * Draws rectangle on ctx by given coordinates of opposite vertices and fills it with color
 **/   
function drawRectXYFill(ctx,x1,y1,x2,y2,color)
{
	ctx.fillStyle = color;
	drawRectXY(ctx,x1,y1,x2,y2);
	ctx.fill();
}

function drawObjectsInit(c){
	//Clear canvas
	c.clearRect(0,0,800,500);
	scoreContext.clearRect(0,0,800,500);

	//Main character
	drawRectXYFill(c,objects[0].x,objects[0].y,objects[0].x + objects[0].width,objects[0].y + objects[0].height,"red");

	//Walls
	for (i=1;i<=5;i++){
		drawRectXYFill(c,objects[i].x,0,objects[i].x + objects[i].width,objects[i].upperBorder,"black");
		drawRectXYFill(c,objects[i].x,objects[i].lowerBorder,objects[i].x + objects[i].width,500,"black");
	}

	//Score
	scoreContext.fillStyle = "blue";
	scoreContext.font = "25px Comic Sans MS";
	var scoreText = "Score: "+score.toString();
	scoreContext.fillText(scoreText,650,25);
};

function drawObjects(c){	
	//Walls redrawing
	for (i=1;i<=5;i++){
		drawRectXYFill(c,objects[i].x + objects[i].width,0,objects[i].lastx + objects[i].width,objects[i].upperBorder,"white");
		drawRectXYFill(c,objects[i].x,0,objects[i].lastx,objects[i].upperBorder,"black");
		drawRectXYFill(c,objects[i].x + objects[i].width,objects[i].lowerBorder,objects[i].lastx + objects[i].width,500,"white");
		drawRectXYFill(c,objects[i].x,objects[i].lowerBorder,objects[i].lastx,500,"black");
	}
	
	//Main character to be drawn ontop
	if (objects[0].dy > 0)
	{
	    //down
	    drawRectXYFill(c,objects[0].x,objects[0].y-objects[0].dy,objects[0].x + objects[0].width,objects[0].y,"white");
	    drawRectXYFill(c,objects[0].x,objects[0].y+objects[0].height-objects[0].dy,objects[0].x + objects[0].width,objects[0].y + objects[0].height,"red");
	}
	else
	{
		if (objects[0].dy < 0)
		{
			//up
			drawRectXYFill(c,objects[0].x,objects[0].y+objects[0].height-objects[0].dy,objects[0].x + objects[0].width,objects[0].y + objects[0].height,"white");
			drawRectXYFill(c,objects[0].x,objects[0].y-objects[0].dy,objects[0].x + objects[0].width,objects[0].y,"red");
		}
	}
};

var lastTime;
function mainLoop(){
	if (stopGame) return true;

	var now = Date.now();
    var dt = (now - lastTime) / 1000.0;

	updateScene(dt);
	drawObjects(context);
	for (i=0;i<=5;i++){
		if (collision(objects[0],objects[i])) {
			context.fillStyle = "#FF0000";
			context.font = "30px Comic Sans MS";
			context.fillText("Game Over!",350,250);
			return true;
		}
	}
	if (score>2000) {
		context.fillStyle = "#00FF00";
		context.font = "30px Comic Sans MS";
		context.fillText("Congrats, you've passed it",350,250);
		return true;
	}
	lastTime=now;
	requestID = requestAnimFrame(mainLoop);
}

//Input handling

var keysPressed = {};

addEventListener("keydown", function (e) {
	keysPressed[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysPressed[e.keyCode];
}, false);

window.onload = function(){
canvas = document.getElementById('canvas');
context = canvas.getContext("2d");
scoreCanvas = document.getElementById('ScoreCanvas');
scoreContext = scoreCanvas.getContext("2d")
document.getElementById("stop").onclick = function(){stopGame = true};
document.getElementById("again").onclick = function(){
	stopGame = true;
	if (requestID) {
       cancelAnimFrame(requestID);
       requestID = undefined;
    }
	init();
	drawObjectsInit(context);
	stopGame = false;
	mainLoop()
};
init();
drawObjectsInit(context);
mainLoop();
}
