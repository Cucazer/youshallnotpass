var canvas,context;
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

function drawObjectsInit(c){
	//Clean canvas
	c.fillStyle = "#FFFFFF";
	c.fillRect(0,0,800,500);

	//Main character
	c.fillStyle = "#FF0000";
	c.fillRect(objects[0].x,objects[0].y,objects[0].width,objects[0].height);

	//Walls
	c.fillStyle = "#000000";
	for (i=1;i<=5;i++){
		c.fillRect(objects[i].x,0,objects[i].width,objects[i].upperBorder);
		c.fillRect(objects[i].x,objects[i].lowerBorder,objects[i].width,objects[i].lowerHeight);
	}

	//Score
	c.fillStyle = "#0000FF";
	c.font = "25px Comic Sans MS";
	var scoreText = "Score: "+score.toString();
	c.fillText(scoreText,680,25);
};

function drawObjects(c){
	//Clean canvas
	//c.fillStyle = "#FFFFFF";
	//c.fillRect(0,0,800,500);

	//Main character
	if (objects[0].dy > 0)
	{
	    //down
	    c.fillStyle = "#FFFFFF";
	    c.fillRect(objects[0].x,objects[0].y-objects[0].dy,objects[0].width,objects[0].dy);
	    c.fillStyle = "#FF0000";
	    c.fillRect(objects[0].x,objects[0].y+objects[0].height-objects[0].dy,objects[0].width,objects[0].dy);
	}
	else
	{
		if (objects[0].dy < 0)
		{
			//up
			c.fillStyle = "#FFFFFF";
			c.fillRect(objects[0].x,objects[0].y+objects[0].height-objects[0].dy,objects[0].width,objects[0].dy);
			c.fillStyle = "#FF0000";
			c.fillRect(objects[0].x,objects[0].y-objects[0].dy,objects[0].width,objects[0].dy);
		}
	}
	/*c.fillRect(objects[0].x,objects[0].y,objects[0].width,objects[0].height);
	c.fillStyle = "#FF0000";
	c.fillRect(objects[0].x,objects[0].y,objects[0].width,objects[0].height);*/

	//Walls
	c.fillStyle = "white";
	for (i=1;i<=5;i++){
		c.beginPath();
		c.moveTo(Math.round(objects[i].x + objects[i].width),0);
		c.lineTo(Math.round(objects[i].x + objects[i].width),objects[i].upperBorder);
		c.lineTo(Math.round(objects[i].lastx + objects[i].width),objects[i].upperBorder);
		c.lineTo(Math.round(objects[i].lastx + objects[i].width),0);
		c.fill();
		c.beginPath();
		c.moveTo(Math.round(objects[i].x + objects[i].width),objects[i].lowerBorder);
		c.lineTo(Math.round(objects[i].x + objects[i].width),500);
		c.lineTo(Math.round(objects[i].lastx + objects[i].width),500);
		c.lineTo(Math.round(objects[i].lastx + objects[i].width),objects[i].lowerBorder);
		c.fill();
		//c.fillRect(Math.round(objects[i].x+objects[0].width),0,Math.round(objects[i].lastx-objects[i].x),objects[i].upperBorder);
		//c.fillRect(Math.round(objects[i].x+objects[0].width),objects[i].lowerBorder,Math.round(objects[i].lastx-objects[i].x),objects[i].lowerHeight);
	}
	c.fillStyle = "black";
	for (i=1;i<=5;i++){
		c.beginPath();
		c.moveTo(Math.round(objects[i].x),0);
		c.lineTo(Math.round(objects[i].x),objects[i].upperBorder);
		c.lineTo(Math.round(objects[i].lastx),objects[i].upperBorder);
		c.lineTo(Math.round(objects[i].lastx),0);
		c.fill();
		c.beginPath();
		c.moveTo(Math.round(objects[i].x),objects[i].lowerBorder);
		c.lineTo(Math.round(objects[i].x),500);
		c.lineTo(Math.round(objects[i].lastx),500);
		c.lineTo(Math.round(objects[i].lastx),objects[i].lowerBorder);
		c.fill();
		//c.fillRect(objects[i].x,0,Math.round(objects[i].lastx-objects[i].x),objects[i].upperBorder);
		//c.fillRect(objects[i].x,objects[i].lowerBorder,Math.round(objects[i].lastx-objects[i].x),objects[i].lowerHeight);
	}

	//Score
	c.fillStyle = "#0000FF";
	c.font = "25px Comic Sans MS";
	var scoreText = "Score: "+score.toString();
	c.fillText(scoreText,680,25);
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
