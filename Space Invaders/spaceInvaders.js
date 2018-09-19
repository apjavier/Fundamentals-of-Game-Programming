
const WIDTH = 700
const HEIGHT = 700

var screen = document.createElement('canvas');
var screenCtx = screen.getContext('2d');
screen.height = HEIGHT;
screen.width = WIDTH;
document.body.appendChild(screen);

var backBuffer = document.createElement('canvas');
var backBufferCtx = screen.getContext('2d');
backBuffer.height = HEIGHT;
backBuffer.width = WIDTH;

var start = null;
var currentInput = {
  space: false,
  left: false,
  right: false,
  up: false,
  down: false
}
var priorInput = {
  space: false,
  left: false,
  right: false,
  up: false,
  down: false
}
var x = 0;
var y = 0;
var bullets = [];
var eX = 0;
var eY = 0;
var score = 0;
var health = 3;
var gameOver = false;
var flagDown = false;
var flagLeft = false;
var flagRight = true;

//boolean array to hold enemies
var enemies = 28;
var enemiesAr = [
  [, , , ],
  [, , , ],
  [, , , ],
  [, , , ],
  [, , , ],
  [, , , ],
  [, , , ]
];
for(var i = 0; i < 7; i++){
  for(var j = 0; j < 4; j++){
    enemiesAr[i][j] = new Enemy(i*100+eX+30, j*50+eY+10, true);
  }
}

function handleKeydown(event) {
  switch(event.key) {
    case ' ':
      currentInput.space = true;
      break;
    case 'ArrowUp':
    case 'w':
      currentInput.up = true;
      break;
    case 'ArrowDown':
    case 's':
      currentInput.down = true;
      break;
    case 'ArrowLeft':
    case 'a':
      currentInput.left = true;
      break;
    case 'ArrowRight':
    case 'd':
      currentInput.right = true;
      break;
  }
}
window.addEventListener('keydown', handleKeydown);

function handleKeyup(event) {
  switch(event.key) {
    case ' ':
      currentInput.space = false;
      break;
    case 'ArrowUp':
    case 'w':
      currentInput.up = false;
      break;
    case 'ArrowDown':
    case 's':
      currentInput.down = false;
      break;
    case 'ArrowLeft':
    case 'a':
      currentInput.left = false;
      break;
    case 'ArrowRight':
    case 'd':
      currentInput.right = false;
      break;
  }
}
window.addEventListener('keyup', handleKeyup);

function gameLoop(timestamp) {
  if(!start) start = timestamp;
  var elapsedTime = timestamp - start;
  start = timestamp;
  update(elapsedTime);
  render(backBufferCtx);
  copyInput();
  screenCtx.drawImage(backBuffer, 0, 0);
  if(gameOver) {
    endGame();
    return;
  }
  window.requestAnimationFrame(gameLoop);
}

function endGame() {
  if(health === 0){
    alert("Game Over! You Died! Press the button to play again.");
  }
  else if(enemies === 0){
    alert("Congratulations you won! Press the button to play again.");
  }
  else {
    alert("Game Over! The Invaders reached the bottom! Press the button to play again.");
  }
  return;
}

function copyInput() {
  priorInput = JSON.parse(JSON.stringify(currentInput));
}

function update(elapsedTime) {
  if(currentInput.space && !priorInput.space) {
    bullets.push(new Bullet(x+340, y+649, 2, "p"));
  }
  if(currentInput.up) {
    y -= 0.15 * elapsedTime;
    //prevents the player from moving off the top
    if (y < -650){
      y = -650;
    }
  }
  if(currentInput.down) {
    y += 0.15 * elapsedTime;
    //prevents the player from moving off the bottom
    if (y > 30){
      y = 30;
    }
  }
  if(currentInput.left) {
    x -= 0.15 * elapsedTime;
    //prevents the player from moving off the left
    if (x < -330){
      x = -330;
    }
  }
  if(currentInput.right) {
    x += 0.15 * elapsedTime;
    //prevents the player from moving off the right
    if (x > 350){
      x = 350;
    }
  }
  //generate enemy bullets
  for (var i = 0; i < 7; i++){
    var lowestEnemy = null;
    if (enemiesAr[i][3].alive){
      lowestEnemy = enemiesAr[i][3];
    }
    else if(enemiesAr[i][2].alive){
      lowestEnemy = enemiesAr[i][2];
    }
    else if(enemiesAr[i][1].alive){
      lowestEnemy = enemiesAr[i][1];
    }
    else if(enemiesAr[i][0].alive){
      lowestEnemy = enemiesAr[i][0];
    }
    var randNum = Math.floor((Math.random() * 200) + 1);

    if (randNum === 1 && lowestEnemy != null){
      bullets.push(new Bullet(lowestEnemy.x+10, lowestEnemy.y+21, 2, "e"));
    }
  }

  //move all bullets
  bullets.forEach(function(bullet, index){
    bullet.update(elapsedTime);
    bullet.hit(enemiesAr, x+330, y+640, index);
    if(bullet.y > HEIGHT + bullet.r || bullet.y < 0 + bullet.r ) bullets.splice(index, 1);
  });

  //move enemies
  //hit the right wall
  if(flagRight && eX >= 40){
    flagDown = true;
  }
  //hit the left wall
  else if(flagLeft && eX <= -20){
    flagDown = true;
  }
  //inbetween
  else{
    if(flagLeft){
      eX -= .1 * elapsedTime;
      for(var i = 0; i < 7; i++){
        for(var j = 0; j < 4; j++){
          enemiesAr[i][j].x -= .1 * elapsedTime;
        }
      }
    }
    else if(flagRight){
      eX += .1 * elapsedTime;
      for(var i = 0; i < 7; i++){
        for(var j = 0; j < 4; j++){
          enemiesAr[i][j].x += .1 * elapsedTime;
        }
      }
    }
  }
  //moving down
  if(flagDown){
    eY += .5 * elapsedTime;
    for(var i = 0; i < 7; i++){
      for(var j = 0; j < 4; j++){
        enemiesAr[i][j].y += .7 * elapsedTime;
      }
    }
    if(flagRight){
      flagLeft = true;
      flagRight = false;
      flagDown = false;
    }
    else if(flagLeft){
      flagRight = true;
      flagLeft = false;
      flagDown = false;
    }
  }
}

function render(ctx) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  //draw the player
  ctx.fillStyle = 'red';
  ctx.fillRect(330+x,650+y,20,20);
  //draw the enemies
  ctx.fillStyle = 'black';
  for(var i = 0; i < 7; i++){
    for(var j = 0; j < 4; j++){
      if(enemiesAr[i][j]){
        ctx.fillRect(enemiesAr[i][j].x,enemiesAr[i][j].y,20,20)
        //checks if an enemy has reached the bottom
        if(enemiesAr[i][j].y > HEIGHT){
          gameOver = true;
          return;
        }
      }
    }
  }

  //draw all bullets
  bullets.forEach(function(bullet){
    bullet.render(ctx);
  });

  document.getElementById('score').innerHTML = "Score: " + score;
  document.getElementById('health').innerHTML = "Health: " + health;
}

function startup() {
  bullets = [];
  x = 0;
  y = 0;
  eX = 0;
  eY = 0;
  flagDown = false;
  flagLeft = false;
  flagRight = true;
  gameOver = false;
  score = 0;
  health = 3;
  start = null;
  enemies = 28;
  for(var i = 0; i < 7; i++){
    for(var j = 0; j < 4; j++){
      enemiesAr[i][j] = new Enemy(i*100+eX+30, j*50+eY+10, true);
    }
  }
  window.requestAnimationFrame(gameLoop);
}

var button = document.getElementById('btn');
button.addEventListener('click', function(event) {
  event.preventDefault();
  button.innerHTML = "Reset"
  startup();
})

function Bullet(x, y, r, type){
  this.x = x;
  this.y = y;
  this.r = r;
  this.type = type;
}
Bullet.prototype.update = function(deltaT){
  if(this.type === "p"){
    this.y -= deltaT * 0.5;
  }
  else if(this.type === "e"){
    this.y += deltaT * 0.5;
  }
}
Bullet.prototype.render = function(context){
  context.beginPath();
  context.fillStyle = 'black';
  context.arc(this.x - this.r, this.y - this.r, 2*this.r, 2*this.r, 0, 2 * Math.pi);
  context.fill();
}
Bullet.prototype.hit = function(enemiesAr, playerX, playerY, index){
  var rx = this.x.clamp(playerX, playerX + 20);
  var ry = this.y.clamp(playerY, playerY + 20);
  var distSquared = Math.pow(rx - this.x, 2) + Math.pow(ry - this.y, 2);
  //check if bullet hit player
  if(distSquared < Math.pow(this.r,2) && this.type === "e") {
      //hit player
      health--;
      bullets.splice(index, 1);
      if(health === 0){
        gameOver = true;
      }
      return;
  }
  //check if bullet hit enemy
  for(var i = 0; i < 7; i++){
    for(var j = 0; j < 4; j++){
      rx = this.x.clamp(enemiesAr[i][j].x, enemiesAr[i][j].x + 20);
      ry = this.y.clamp(enemiesAr[i][j].y, enemiesAr[i][j].y + 20);
      distSquared = Math.pow(rx - this.x, 2) + Math.pow(ry - this.y, 2);
      if(distSquared < Math.pow(this.r,2) && this.type === "p") {
          //hit enemy
          enemiesAr[i][j]= false;
          bullets.splice(index, 1);
          score += 100;
          enemies--;
          if(enemies === 0){
            gameOver = true;
          }
          return;
      }
    }
  }
}
//clamp a number to the max or min of an object
Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

function Enemy(x, y, alive){
  this.x = x;
  this.y = y;
  this.alive = alive;
}
