/*
 打飞机游戏
 * 1.创建一个游戏引擎
 * 2.我方飞机和敌方飞机  -> 建立一个飞机类（父类）-> 我方飞机类 敌方飞机类 ->我方 和 敌方
 * 3.子弹类->各种不同类型的子弹->对应不同形式及攻击力等的子弹
 * 4.子弹打敌方飞机  敌机销毁 根据生命值   敌方飞机和我方飞机只要发生碰撞 游戏结束
 * 5.碰撞的实现方式等等
 * */

function getById(id){
	return document.getElementById(id);
}

function Engine(){
	this.content = document.getElementById("content");
	this.startArea = document.getElementById("start");
	this.beginBtn = document.getElementById("begin");
	this.mainArea = document.getElementById("main");
	this.score = document.getElementById("score");
	this.label = document.getElementById("label");
	this.endArea = document.getElementById("end");
	this.planeScore = document.getElementById("planeScore");
	this.reloadBtn = document.getElementById("reload");
	
	this.init = function(){
		this.beginBtn.onclick = ()=>{
			this.startArea.style.display = "none";
			this.mainArea.style.display = "block";
			this.score.style.display = "block";
			this.start();
		}
		
	}
	
	this.init();
}

Engine.prototype.start = function(){
	var count = 0;
	var num1 = 0;
	var num2 = 0;
	var num3=0;
	var enemyArr = [];
	var bulletArr = [];
	
	var timer = setInterval(()=>{
		count++;
		num1++;
		this.mainArea.style.backgroundPositionY =  count + "px";
		
		if(num1==50){
			num2++;
			enemyArr.push(new Enemy("image/enemy1_fly_1.png",Math.floor(Math.random()*286),-24,3,1,"image/小飞机爆炸.gif",100,false,20));
			if(num2%5==0){
				enemyArr.push(new Enemy("image/enemy3_fly_1.png",Math.floor(Math.random()*274),-60,2,3,"image/中飞机爆炸.gif",300,false,40));	
			}
			if(num2%10==0){
				enemyArr.push(new Enemy("image/enemy2_fly_1.png",Math.floor(Math.random()*210),-164,1,5,"image/大飞机爆炸.gif",500,false,60));	
			}
			num1 = 0;
		}
		
		if(num1%10==0){
			bulletArr.push(new Bullet("image/bullet1.png",myplane.planeNode.offsetLeft + myplane.planeNode.offsetWidth/2-3,myplane.planeNode.offsetTop - 10));
		}
		
		
		for(var i = 0; i < enemyArr.length; i++){
			enemyArr[i].move();
			if(enemyArr[i].planeNode.offsetTop >= engine.mainArea.offsetHeight - enemyArr[i].planeNode.offsetHeight){
				engine.mainArea.removeChild(enemyArr[i].planeNode);
				enemyArr.splice(i,1);
			}
				
			if(myplane.planeNode.offsetLeft + myplane.planeNode.offsetWidth >enemyArr[i].planeNode.offsetLeft &&
enemyArr[i].planeNode.offsetLeft + enemyArr[i].planeNode.offsetWidth  > myplane.planeNode.offsetLeft){
				if(myplane.planeNode.offsetTop < enemyArr[i].planeNode.offsetTop+enemyArr[i].planeNode.offsetHeight&&
			myplane.planeNode.offsetTop + myplane.planeNode.offsetHeight > enemyArr[i].planeNode.offsetTop){
					clearInterval(timer);
					myplane.planeNode.src="image/本方飞机爆炸.gif";
					myplane.die=true
					engine.endArea.style.display="block"
					engine.planeScore.innerHTML=num3
					
				}
			}
			
			
			
			if(enemyArr[i].die){
				enemyArr[i].dieTime--;
					if(enemyArr[i].dieTime== 0){
						engine.mainArea.removeChild(enemyArr[i].planeNode);
						enemyArr.splice(i,1);
					}
			}
		}
		
		for(var j = 0; j < bulletArr.length; j++){
			bulletArr[j].move();
			if(bulletArr[j].bulletNode.offsetTop <= 0){
				engine.mainArea.removeChild(bulletArr[j].bulletNode);
				bulletArr.splice(j,1);
			}
		}
		
		for(var m = 0; m < bulletArr.length; m++){
			for(var n = 0; n < enemyArr.length; n++){
				if(bulletArr[m].bulletNode.offsetLeft + bulletArr[m].bulletNode.offsetWidth >enemyArr[n].planeNode.offsetLeft &&
enemyArr[n].planeNode.offsetLeft + enemyArr[n].planeNode.offsetWidth  > bulletArr[m].bulletNode.offsetLeft){
			if(bulletArr[m].bulletNode.offsetTop < enemyArr[n].planeNode.offsetTop+enemyArr[n].planeNode.offsetHeight&&
			bulletArr[m].bulletNode.offsetTop + bulletArr[m].bulletNode.offsetHeight > enemyArr[n].planeNode.offsetTop){
				engine.mainArea.removeChild(bulletArr[m].bulletNode);
				bulletArr.splice(m,1);
				enemyArr[n].health--;
				if(enemyArr[n].health == 0){
					enemyArr[n].die = true;
					enemyArr[n].planeNode.src = enemyArr[n].boomImgSrc;
					num3+=enemyArr[n].scores
					engine.label.innerHTML=num3
				}
				break;
			}
}
			}
		}
	},20);
}





var engine = new Engine();

//创建飞机类
function Plane(imgSrc,x,y,speed,health,boomImgSrc,score,die,dieTime){
	this.imgSrc = imgSrc;
	this.posX = x;
	this.posY = y;
	this.speed = speed;
	this.health = health;
	this.boomImgSrc = boomImgSrc;
	this.scores = score;
	this.die = die;
	this.dieTime = dieTime;
	
	this.init = function(){
		this.planeNode = document.createElement("img");
		this.planeNode.src = this.imgSrc;
		this.planeNode.style.left = this.posX + "px";
		this.planeNode.style.top = this.posY + "px";
		engine.mainArea.appendChild(this.planeNode);
	}
	
	this.init();
}

Plane.prototype.move = function(){
	
}

function inherit(Super,Sub){
	Sub.prototype = Object.create(Super.prototype);
	Sub.prototype.constructor = Sub;
}


function Enemy(imgSrc,x,y,speed,health,boomImgSrc,score,die,dieTime){
	Plane.call(this,imgSrc,x,y,speed,health,boomImgSrc,score,die,dieTime);
}

inherit(Plane,Enemy);

Enemy.prototype.move = function(){
	//考虑难易等级
	var engineScore = engine.label.innerHTML;
	if(engineScore < 10000){
		this.planeNode.style.top = this.planeNode.offsetTop + this.speed + "px";
	}else if(engineScore >= 10000 && engineScore <= 20000){
		this.planeNode.style.top = this.planeNode.offsetTop + this.speed + 2 + "px";
	}else{
		this.planeNode.style.top = this.planeNode.offsetTop + this.speed + 4 + "px";
	}

}


function myPlane(imgSrc,x,y,die){
	Plane.call(this,imgSrc,x,y);
	this.die = die;
}

inherit(Plane,myPlane);

myPlane.prototype.move = function(){
	engine.mainArea.onmousemove = (e)=>{
		var evt = e || event;
		var x = evt.pageX - engine.content.offsetLeft - 33;
		var y = evt.pageY -engine.content.offsetTop - 40;
		
		if(x <= 0){
			x = 0;
		}
		if(x >= engine.mainArea.offsetWidth - this.planeNode.offsetWidth){
			x = engine.mainArea.offsetWidth - this.planeNode.offsetWidth;
		}
		if(y <= 0){
			y = 0;
		}
		if(y >= engine.mainArea.offsetHeight - this.planeNode.offsetHeight){
			y = engine.mainArea.offsetHeight - this.planeNode.offsetHeight;
		}
		
		this.planeNode.style.left = x + "px";
		this.planeNode.style.top = y + "px";
		
	}
}

var myplane = new myPlane("image/我的飞机.gif",127,488,false);
myplane.move()



//定义子弹类
function Bullet(imgSrc,x,y){
	this.imgSrc = imgSrc;
	this.posX = x;
	this.posY = y;
	
	this.init = function(){
		this.bulletNode = document.createElement("img");
		this.bulletNode.src = this.imgSrc;
		this.bulletNode.style.left = this.posX + "px";
		this.bulletNode.style.top = this.posY + "px";
		engine.mainArea.appendChild(this.bulletNode);
	}
	
	this.init();
}
Bullet.prototype.move = function(){
	this.bulletNode.style.top =  this.bulletNode.offsetTop - 10 + "px";
}

//检测碰撞  子弹和敌机  敌机和我机



//重新开始
//engine.reloadBtn.onclick=function(){
//	engine.startArea.style.display="block"
//	engine.mainArea.style.display = "none";
//	engine.score.style.display = "none";
//}
