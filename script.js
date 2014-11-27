var canvas,context,stage;
var stopGame=false;

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

/*
var circle = new createjs.Shape();
circle.graphics.beginFill("red").drawCircle(0, 0, 50);
circle.x = 100;
circle.y = 100;
stage.addChild(circle);
*/
var wall = function(x){
	this.width = 50;
	this.gapWidth = 100;
	this.upperBorder = Math.floor(Math.random()*375) + 25;
	this.lowerBorder = this.upperBorder + this.gapWidth;
	this.lowerHeight = 500 - this.lowerBorder;

	//CreateJS visualisation
	this.shapeUpper = new createjs.Shape();
	this.shapeUpper.x = x;
	this.shapeUpper.y = 0;
	this.shapeUpper.graphics.beginFill("black").drawRect(0,0,this.width,this.upperBorder);
	stage.addChild(this.shapeUpper);
	this.shapeLower = new createjs.Shape();
	this.shapeLower.x = x;
	this.shapeLower.y = this.lowerBorder;
	this.shapeLower.graphics.beginFill("black").drawRect(0,0,this.width,this.lowerHeight);
	stage.addChild(this.shapeLower);

	this.renew = function(){
		this.shapeUpper.x += 1250;
		this.shapeLower.x += 1250;
		this.upperBorder = Math.floor(Math.random()*375) + 25;
		this.lowerBorder = this.upperBorder + this.gapWidth;
		this.lowerHeight = 500 - this.lowerBorder;
		this.shapeUpper.graphics.beginFill("black").drawRect(0,0,this.width,this.upperBorder);
		this.shapeLower.graphics.beginFill("black").drawRect(0,0,this.width,this.lowerHeight);
		step = step * 1.2;
		score++;
		};

	this.move = function(step){
		this.shapeUpper.x -= step;
		this.shapeLower.x -= step;
		if (this.shapeUpper.x <= -this.width){
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




//here to createjs__



var step, score;
function init() {
	step = 2;
	score = 0;
	//Creating main character
	objects[0] = {
		width : 50,
		height : 50
	};
	objects[0].shape = new createjs.Shape();
	objects[0].shape.x = 25;
	objects[0].shape.y = 225;
	objects[0].move = function(step){
			if (this.shape.y+step<=450 && this.shape.y+step>=0){
				this.shape.y += step;
			};
		}
	objects[0].shape.graphics.beginFill("red").drawRect(0,0,50,50);
	stage.addChild(objects[0].shape);

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
	myStep = 0;
	if (38 in keysPressed) myStep -= 150;
	if (40 in keysPressed) myStep += 150;
	//Crappy...
	objects[0].move(step*0.9*myStep*dt);
}

function drawObjects(c){
	//Clean canvas
	c.fillStyle = "#FFFFFF";
	c.fillRect(0,0,800,500);

	//Main character
	/*c.fillStyle = "#FF0000";
	c.fillRect(objects[0].x,objects[0].y,objects[0].width,objects[0].height);
*/
	//Walls
	/*
	c.fillStyle = "#000000";
	for (i=1;i<=5;i++){
		c.fillRect(objects[i].x,0,objects[i].width,objects[i].upperBorder);
		c.fillRect(objects[i].x,objects[i].lowerBorder,objects[i].width,objects[i].lowerHeight);
	}*/
	stage.update();

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
/*
	var circle = new createjs.Shape();
	circle.graphics.beginFill("red").drawCircle(0, 0, 50);
	circle.x = 100;
	circle.y = 100;
	stage.addChild(circle);*/
//	stage.update();

	for (i=0;i<=5;i++){
		if (collision(objects[0],objects[i])) {
			context.fillStyle = "#FF0000";
			context.font = "30px Comic Sans MS";
			context.fillText("Game Over!",350,250);
			return true;
		}
	}

	lastTime=now;
	requestAnimFrame(mainLoop);
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
canvas = document.getElementById("canvas");
context = canvas.getContext("2d");
//CreateJS
stage = new createjs.Stage("canvas");
document.getElementById("stop").onclick = function(){stopGame = true};
document.getElementById("again").onclick = function(){
	stopGame = true;
	init();
	stopGame = false;
	mainLoop()
};
init();
mainLoop();
}
