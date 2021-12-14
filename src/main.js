let cnv, ctx, height, width, frames = 0, velocity = 6, canRestart = false;


var animating = true;
const ground = {
    y: 550,
    height: 50,
    color: "#eee",

    draw: function(){
        ctx.fillStyle = this.color;
        ctx.fillRect(0, this.y, width, this.height);
    }
};

let player = {
    x: 50,
    y: 50,
    height: 30,
    width: 30,
    color: "#f00",

    gravityForce: 1,
    velocity: 0,
    jumpForce: 15,

    applyGravity: function(){
        this.velocity += this.gravityForce;
        this.y += this.velocity;

        if(this.y > ground.y - this.height){
            this.y = ground.y - this.height;
        }else if(this.y < 0){
            this.y = 0;
        }
    },

    jump: function(){
            this.velocity = -this.jumpForce;
    },

    draw: function() {
        ctx.fillStyle = this.color;

        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
};
let pontos = {
    cont: 0,
    draw: function(){
        ctx.font = '50px arial';
        ctx.fillStyle = "#fff";
        ctx.fillText(this.cont, 500, 50);
    }
}
let obstacle = {
    obsArr: [],
    colors: ["#ffbc1c","#ff1c1c","#ff85e1","#6b0036","#78ff5d"],
    insertTime: 0,

    insert: function (){
        let down = {
            x: width,
            y: null,
            width: 50 + Math.floor(20 * Math.random()),
            height: Math.floor(350 * Math.random()),
            color: this.colors[Math.floor(5 * Math.random())],
        };
        let up = {
            x: down.x,
            width: down.width,
            height: ((350 - down.height)) ,
            y: 0,
        }
        this.obsArr.push({
            down,
            up
        });
        this.insertTime = 50;
    },

    update: function(){
        if(this.insertTime == 0){
            this.insert();
        }else{
            this.insertTime--;
        }
        for(let i = 0; i < this.obsArr.length; i++){
            var obs = this.obsArr[i];

            obs.down.x -= velocity;
            obs.up.x -= velocity;

            if(obs.down.x <= -obs.down.width){
                this.obsArr.splice(i, 1);
                pontos.cont++;
            }
        }
    },

    draw: function(){
        for(let i = 0; i < this.obsArr.length; i++){
            var obs = this.obsArr[i];
            obs.down.y = (ground.y - obs.down.height);
            ctx.fillStyle = obs.down.color;
            ctx.fillRect(obs.down.x, obs.down.y, obs.down.width, obs.down.height);
            ctx.fillRect(obs.up.x, obs.up.y, obs.up.width, obs.up.height);
        }
    }
}

function reset(){
    pontos.cont = 0;
    while(obstacle.obsArr.length){
        obstacle.obsArr.pop();
    }
}

function collider(player, objArr){
    if(player.x + player.width > objArr[0].down.x && player.y > objArr[0].down.y){
        return true
    }else if(player.x + player.width > objArr[0].up.x && player.y < objArr[0].up.height){
        return true
    }
}

function click(e){
   player.jump();
}
function main(){
    canRestart = false;
    width = window.innerWidth;
    height = window.innerHeight;

    if(width >= 500){
        width = 600;
        height = 600;
    }

    cnv = document.createElement("canvas");
    cnv.width = width;
    cnv.height = height;
    cnv.style.border = "1px solid #000";

    ctx = cnv.getContext("2d");

    document.body.appendChild(cnv);
    document.addEventListener("mousedown", click);

    run();
}
function run(){
    update();
    draw();
    var anime = window.requestAnimationFrame(run);
    if(collider(player, obstacle.obsArr)){
        reset();
        cancelAnimationFrame(anime);
        canRestart = true;
    }
}
function restart(){
    if(canRestart){
        main();
    }
}
function update(){
    frames++;
    player.applyGravity();
    obstacle.update();
}
function draw(){
    ctx.fillStyle = "#50beff";
    ctx.fillRect(0, 0, width, height);

    ground.draw();

    obstacle.draw();

    player.draw();

    pontos.draw();
}

main();