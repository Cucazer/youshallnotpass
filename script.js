var canvas;
var stopGame=false;

//Global parameters
var	wallWidth = 50;
var	wallGapWidth = 100;
var t = 5000;
var score = 0;

//Array of scene objects
var objects = new Array();
function init() {
	//Initial parameters
	step = 2;
	score = 0;
	
	//Creating main character
	objects[0] = jc.rect(25,225,50,50,'#dc0a0a',true);
	
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
	
	//Score counter
	jc.text({string:"Score: 0",
		x:canvas.width-120,
		y:25,
		color:"#0000FF"
		}).id('counter')
		.font("25px Comic Sans MS");
}

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
}

function main()
{
	setTimeout(mainLoop,20000);
}

//Input handling

var keysPressed = [];

function moveCharacter()
{
	//Positive - move upwards, negative - downwards
	var direction=0;
	if (keysPressed[87]||keysPressed[38]) direction++; //w or up
	if (keysPressed[83]||keysPressed[40]) direction--; //s or down
	
	var curY=objects[0].position().y;
	var minY=0;
	var maxY=canvas.height-objects[0].getRect().height;
	
	switch (direction) {
		case 1:
			objects[0].animate({y:minY},(curY-minY)*1.5);
			break;
		case (-1):
			objects[0].animate({y:maxY},(maxY-curY)*1.5);
			break;
		default:
			objects[0].stop();
		}
}

addEventListener("keydown", function (e) {
	keysPressed[e.keyCode] = true;
	moveCharacter();
}, false);

addEventListener("keyup", function (e) {
	delete keysPressed[e.keyCode];
	moveCharacter();
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
