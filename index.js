let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");

ctx.strokeStyle = "black";
let x = 100;
let y = 100;

let previousT = 0;
let deltaT = 0;

let ship = {
    size:20,
    acc:0.005,
    speed:0,
    maxSpeed:0.5,
    rotation:0,
    rotSpeed:0.1,
    accVector:{x:0,y:0},
    velVector:{x:0,y:0},
    posVector:{x:100,y:100}
}


let rocks = [];
    rocks.push({x:100,y:200,size:10,color:"black",rotSpeed:5,speedX:5,speedY:5});
    rocks.push({x:200,y:200,size:10,color:"orange",rotSpeed:2,speedX:1,speedY:0.6});




let inputVector = {x:0,y:0};

document.addEventListener("keydown", (event)=>{
    if (event.key == "w") {
        inputVector.y = 1;
    }
    else if(event.key == "s") {
        inputVector.y = -1;
    }
    else if(event.key == "a") {
        inputVector.x = -1;
    }
    else if (event.key == "d") {
        inputVector.x = 1;
    }
});

document.addEventListener("keyup", (event)=>{
    if(event.key == "w" || event.key =="s"){
        inputVector.y = 0;
    }
    else if(event.key == "a" || event.key == "d"){
        inputVector.x = 0;
    }

});

function update(time) {
    if (previousT != 0) {
        deltaT = time - previousT
    }
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    if(ship.speed < ship.maxSpeed)ship.speed += inputVector.y * ship.acc;
    if(ship.speed < 0)ship.speed = 0;
    if(ship.speed > 0 && inputVector.y == 0) ship.speed-=0.001;
    ctx.translate(x,y);
    ship.rotation += ship.rotSpeed * inputVector.x;
    x += Math.cos(ship.rotation)*ship.speed*deltaT;
    y += Math.sin(ship.rotation)*ship.speed*deltaT;
    ctx.rotate(ship.rotation);
    draw_ship(0, 0, ship.size, "green")
    ctx.resetTransform();
    if(x > canvas.width+size) x = -ship.size;  
    if(x < -size) x = canvas.width + ship.size;
    if(y > canvas.height+size) y = -ship.size;
    if(y < -size) y = canvas.height + ship.size;
    rocks.forEach(r => {
        r.x += r.speedX;
        r.y += r.speedY;
   
        ctx.translate(r.x,r.y);
        r.rotation += r.rotSpeed;
        ctx.rotate(r.rotation);
        
        drawRock(0,0,r.size,r.color); 

        if(r.x > canvas.width+r.size) r.x = -r.size;  
        if(r.x < -r.size) r.x = canvas.width + r.size;
        if(r.y > canvas.height+r.size) r.y = -r.size;
        if(r.y < -r.size) r.y = canvas.height + r.size;

        ctx.resetTransform();
    });



    ctx.resetTransform();
    previousT = time
    window.requestAnimationFrame(update);
}
window.requestAnimationFrame(update);

function draw_ship(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x-size/2, y -size/2);
    ctx.lineTo(x + size * 1.5-size/2, y);
    ctx.lineTo(x-size/2, y + size-size/2);
    ctx.lineTo(x-size/2, y-size/2);
    ctx.fill();
}
function drawRock(x,y,size, color){
    ctx.fillStyle = color;
    ctx.beginPath();    
    ctx.moveTo(x-size/2,y-size/2);
    ctx.lineTo(x+size/2,y-size/2);
    ctx.lineTo(x+size/2,y+size/2);
    ctx.lineTo(x-size/2,y+size/2);
    ctx.lineTo(x-size/2,y-size/2);
    
    ctx.fill();
}
