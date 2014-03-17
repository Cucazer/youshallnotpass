var step = 2;
var myStep = 0;

var wall = function(x){
	this.x = x;
	this.width = 75;
	this.gapWidth = 75;
	this.upperBorder = Math.floor(Math.random()*375) + 25;
	this.lowerBorder = this.upperBorder + this.gapWidth;
	this.lowerHeight = 500 - this.lowerBorder;
	
	this.renew = function(){
		this.x += 1250;
		this.upperBorder = Math.floor(Math.random()*450) + 25;
		this.lowerBorder = this.upperBorder + this.gapWidth;
		this.lowerHeight = 500 - this.lowerBorder;
		step = step * 1.5;
		myStep = myStep * 1.5;
	};
	
	this.move = function(){
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
//Creating main character
objects[0] = {
	x : 25, 
	y : 225,
	height: 50,
	width: 50,
	move : function(step){
		if (this.y+step<=500 && this.y+step>=0){
			this.y += step;
		};
	}
};
//Creating walls
for (i=1;i<=5;i++){
	objects[i] = new wall(i*250);
};

function updateScene(){
	for (i=1;i<=5;i++){
		objects[i].move();
	};
	objects[0].move(myStep);
}

function drawObjects(c){
c.fillStyle = "#FFFFFF";
c.fillRect(0,0,800,500);

c.fillStyle = "#FF0000";
c.fillRect(objects[0].x,objects[0].y,objects[0].width,objects[0].height); 

c.fillStyle = "#000000";
for (i=1;i<=5;i++){
	c.fillRect(objects[i].x,0,objects[i].width,objects[i].upperBorder);
	c.fillRect(objects[i].x,objects[i].lowerBorder,objects[i].width,objects[i].lowerHeight);	
}
};

window.onkeydown = function(event){
	switch (event.keyCode){
		case 38 : myStep = -10;
				break;
		case 40 : myStep = 10;
				break;
		default : myStep = 0;				
	}
};

window.onkeyup = function(event){
	myStep = 0;
}

window.onload = function(){
var canvas = document.getElementById('canvas');
var context = canvas.getContext("2d");
//drawObjects(context);
var id = setInterval(function(){
	updateScene();
	drawObjects(context);
	for (i=0;i<=5;i++){
		if (collision(objects[0],objects[i])) {
			console.log("OOPS! -",i);
			clearInterval(id);
			context.fillStyle = "#FF0000";
			context.font = "30px Comic Sans MS";
			context.fillText("Game Over!",350,250);
		}
	}
}
,20);
document.getElementById("stop").onclick = function(){clearInterval(id)};
}
