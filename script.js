var canvas;
var stopGame=false;

//Global parameters
var	wallWidth = 50;
var	wallGapWidth = 100;
var t = 5000;

// A cross-browser requestAnimationFrame
// See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
var requestAnimFrame = (function(){
		return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback){
			window.setTimeout(callback, 1000 / 60);
		};
	})();

var wall = function(x){
	this.width = 50;
	this.gapWidth = 100;
	this.upperBorder = Math.floor(Math.random()*375) + 25;
	this.lowerBorder = this.upperBorder + this.gapWidth;
	this.lowerHeight = 500 - this.lowerBorder;
	this.upperShape = jc.rect(x,0,this.width,this.upperBorder,true);
	this.lowerShape = jc.rect(x,this.lowerBorder,this.width,this.lowerHeight,true);

	this.renew = function(){
		this.upperShape.x += 1250;
		this.lowerShape.x += 1250;
		this.upperBorder = Math.floor(Math.random()*375) + 25;
		this.lowerBorder = this.upperBorder + this.gapWidth;
		this.lowerHeight = 500 - this.lowerBorder;
		step = step * 1.2;
		score++;
		};

	this.move = function(step){
		this.x -= step;
		if (this.x <= -this.width){
			this.renew();
		};
	}
};

//Array of scene objects
var objects = new Array();
var step, score;
function init() {
	//Initial parameters
	step = 2;
	score = 0;
	
	//Creating main character
	objects[0] = jc.rect(25,225,50,50,'#dc0a0a',true);
	objects[0].move = function(step){
		if (this._y+step<=450 && this._y+step>=0){
			this._y += step;
		};
	};
	
	//Creating walls
	for (i=1;i<=5;i++){
		//Wall parameters
		x=i*250;
		upperHeight = Math.floor(Math.random()*375) + 25;
		lowerBorder = upperHeight + wallGapWidth;
		lowerHeight = canvas.height - lowerBorder;
		
		//Creating pair of rects - upper and lower parts of the wall
		//upper first
		objects[i*2-1] = jc.rect(x,0,wallWidth,upperHeight,'#000000',true);
		objects[i*2] = jc.rect(x,lowerBorder,wallWidth,lowerHeight,'#000000',true);
	};
}

function updateScene(dt){
	for (i=1;i<=5;i++){
		objects[i].move(step);
	};
	//i'll leave it here for the first time
	myStep = 0;
	if (38 in keysPressed) myStep -= 150;
	if (40 in keysPressed) myStep += 150;
	//Crappy...
	objects[0].move(step*0.9*myStep*dt);
}

function drawObjects(c){
	//Clean canvas
	/*
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
*/
	//Score
	c.fillStyle = "#0000FF";
	c.font = "25px Comic Sans MS";
	var scoreText = "Score: "+score.toString();
	c.fillText(scoreText,680,25);
};

function checkCanvasOut(obj)
{
	if (obj.position().x<=-wallWidth)
	{
		var newx = obj.position().x + 1250;
		obj.animate({x:newx});
		return true; //need to increase animation speed
	}
	return false
}

function collision(me,obj){
	
	var x1 = me.getRect().x;
	var x2 = x1 + me.getRect().width;
	var y1 = me.getRect().y;
	var y2 = y1 + me.getRect().height;
	return obj.isPointIn(x1,y1) || obj.isPointIn(x1,y2) 
		|| obj.isPointIn(x2,y1) || obj.isPointIn(x2,y2);
}

function checkCollisions()
{
	var isCollision=false
	for(i=1;i<=10;i++) isCollision = isCollision || collision(objects[0],objects[i]);
	return isCollision;
}

function checkEverything()
{
	var increaseSpeed = false;
	for (i=1;i<=10;i++) increaseSpeed = increaseSpeed || checkCanvasOut(objects[i]);
	if (increaseSpeed) {
		t *= 0.97;
		for (i=1;i<=10;i++) {
			objects[i].stop();
			objects[i].animate({x:objects[i].position().x-500},t);
			}
		}
	if(checkCollisions()) {
		for (i=0;i<=10;i++) {
			objects[i].stop();
		}
	}
}

var lastTime;
function mainLoop(){
	if (stopGame) return true;

	var now = Date.now();
    var dt = (now - lastTime) / 1000.0;

	//updateScene(dt);
	//drawObjects(context);

	for(i=1;i<=10;i++) objects[i].animate({x:objects[i].position().x-500},t);
	
	setInterval(checkEverything,50);
/*
	for (i=1;i<=5;i++){
		if (collision(objects[0],objects[i])) {
			context.fillStyle = "#FF0000";
			context.font = "30px Comic Sans MS";
			context.fillText("Game Over!",350,250);
			return true;
		}
	}
*/
	lastTime=now;
}

function main()
{
	setTimeout(mainLoop,2000);
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
//JcanvaScript with animation
jc.start('canvas',true);
document.getElementById("stop").onclick = function(){stopGame = true};
document.getElementById("again").onclick = function(){
	stopGame = true;
	init();
	stopGame = false;
	mainLoop()
};
init();
main();
}
