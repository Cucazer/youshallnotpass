//Global declarations
var canvas,context,stage;
var objects; //Array of scene objects
var stopGame=false;

var wall = function(x){
	this.x = x;
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
		this.x += 1250;
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
		this.x -= step;
		this.shapeUpper.x -= step;
		this.shapeLower.x -= step;
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

//here to createjs__

var step, score;
function init() {
	step = 2;
	score = 0;
	stage.removeAllChildren();
	objects = new Array();
	
	//Creating main character
	objects[0] = new createjs.Shape();
	objects[0].width = 50,
	objects[0].height = 50
	objects[0].x = 25;
	objects[0].y = 225;
	objects[0].move = function(step){
			if (this.y+step<=450 && this.y+step>=0){
				this.y += step;
			};
		}
	objects[0].graphics.beginFill("red").drawRect(0,0,50,50);
	stage.addChild(objects[0]);

	//Creating walls
	for (i=1;i<=5;i++){
		objects[i] = new wall(i*250);
	};
	createjs.Ticker.addEventListener("tick",mainLoop);
	createjs.Ticker.setFPS(60);
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

	for (i=1;i<=5;i++){
		if (collision(objects[0],objects[i])) {
			stopGame = true;
			context.fillStyle = "#FF0000";
			context.font = "30px Comic Sans MS";
			context.fillText("Game Over!",350,250);
			return true;
		}
	}

	lastTime=now;
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
