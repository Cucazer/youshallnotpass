//Global declarations
var canvas,context,stage;
var objects; //Array of scene objects
var stopGame=false;
var scoreText;

var wall = function(x){
	this.x = x;
	this.width = 50;
	this.gapWidth = 100;
	this.upperBorder = Math.floor(Math.random()*375) + 25;
	this.lowerBorder = this.upperBorder + this.gapWidth;
	this.lowerHeight = 500 - this.lowerBorder;

	this.addShapes = function(x){
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
	}
	this.addShapes(x); //part of initialization

	this.renew = function(){
		this.x += 1250;
		stage.removeChild(this.shapeLower,this.shapeUpper);
		this.upperBorder = Math.floor(Math.random()*375) + 25;
		this.lowerBorder = this.upperBorder + this.gapWidth;
		this.lowerHeight = 500 - this.lowerBorder;
		this.addShapes(this.x);
		step = step * 1.1;
		score++;
		scoreText.text = "Score: "+score.toString();
		stage.setChildIndex(scoreText,stage.getNumChildren()-1);
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
	
	scoreText = new createjs.Text("Score: "+score.toString(),"25px Comic Sans MS","blue");
	scoreText.x = 680;
	scoreText.y = 15;
	stage.addChild(scoreText);
	
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

var lastTime;
function mainLoop(){
	if (stopGame) return true;

	var now = Date.now();
    var dt = (now - lastTime) / 1000.0;

	updateScene(dt);
	stage.update();

	for (i=1;i<=5;i++){
		if (collision(objects[0],objects[i])) {
			stopGame = true;
			var gameOverText = new createjs.Text("Game Over!", "40px Comic Sans MS", "red");
			gameOverText.x = 350;
			gameOverText.y = 250;
			stage.addChild(gameOverText);
			stage.update();
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
