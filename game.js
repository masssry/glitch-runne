const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const playBtn = document.getElementById('playBtn');
const restartBtn = document.getElementById('restartBtn');
const menu = document.getElementById('menu');
const gameOverScreen = document.getElementById('gameOver');
const finalScore = document.getElementById('finalScore');
const scoreText = document.getElementById('score');
const bestText = document.getElementById('best');
const hud = document.getElementById('hud');

let gameRunning = false;
let score = 0;
let best = localStorage.getItem('best') || 0;
bestText.innerText = best;

let speed = 7;
let gravity = 0.7;

const player = {
  x: 100,
  y: 300,
  width: 50,
  height: 50,
  color: 'cyan',
  dy: 0,
  jumpForce: -15,
  grounded: false
};

let obstacles = [];
let particles = [];

function startGame() {
  menu.style.display = 'none';
  gameOverScreen.style.display = 'none';
  hud.style.display = 'block';

  score = 0;
  speed = 7;
  obstacles = [];
  particles = [];

  player.y = 300;
  player.dy = 0;

  gameRunning = true;

  animate();
}

playBtn.onclick = startGame;
restartBtn.onclick = startGame;

function spawnObstacle() {
  const height = Math.random() * 100 + 50;

  obstacles.push({
    x: canvas.width,
    y: canvas.height - height,
    width: 50,
    height: height,
    color: 'red'
  });
}

setInterval(() => {
  if(gameRunning){
    spawnObstacle();
  }
}, 1200);

function drawPlayer() {
  ctx.shadowBlur = 20;
  ctx.shadowColor = player.color;

  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  ctx.shadowBlur = 0;
}

function drawGround() {
  ctx.fillStyle = '#111';
  ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
}

function updatePlayer() {
  player.dy += gravity;
  player.y += player.dy;

  if(player.y + player.height >= canvas.height - 100){
    player.y = canvas.height - 100 - player.height;
    player.dy = 0;
    player.grounded = true;
  }
}

function drawObstacles() {
  obstacles.forEach((obs, index) => {
    obs.x -= speed;

    ctx.shadowBlur = 20;
    ctx.shadowColor = 'red';

    ctx.fillStyle = obs.color;
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

    ctx.shadowBlur = 0;

    if(obs.x + obs.width < 0){
      obstacles.splice(index, 1);
      score++;
      scoreText.innerText = score;

      if(score > best){
        best = score;
        localStorage.setItem('best', best);
        bestText.innerText = best;
      }

      if(score % 5 === 0){
        speed += 0.5;
      }
    }

    if(
      player.x < obs.x + obs.width &&
      player.x + player.width > obs.x &&
      player.y < obs.y + obs.height &&
      player.y + player.height > obs.y
    ){
      endGame();
    }
  });
}

function createParticles() {
  particles.push({
    x: player.x + player.width / 2,
    y: player.y + player.height / 2,
    size: Math.random() * 5,
    dx: (Math.random() - 0.5) * 5,
    dy: (Math.random() - 0.5) * 5,
    life: 30
  });
}

function drawParticles() {
  particles.forEach((p, index) => {
    p.x += p.dx;
    p.y += p.dy;
    p.life--;

    ctx.fillStyle = 'cyan';
    ctx.fillRect(p.x, p.y, p.size, p.size);

    if(p.life <= 0){
      particles.splice(index, 1);
    }
  });
}

function glitchEffect() {
  if(score > 10){
    canvas.style.filter = `hue-rotate(${Math.random()*20}deg)`;
  }

  if(score > 20){
    canvas.style.transform = `translate(${Math.random()*5}px, ${Math.random()*5}px)`;
  }

  if(score > 40){
    canvas.style.filter = `invert(${Math.random()})`;
  }
}

function endGame() {
  gameRunning = false;

  finalScore.innerText = score;

  gameOverScreen.style.display = 'flex';

  canvas.style.transform = 'none';
  canvas.style.filter = 'none';
}

function animate() {
  if(!gameRunning) return;

  requestAnimationFrame(animate);

  ctx.clearRect(0,0,canvas.width,canvas.height);

  drawGround();

  updatePlayer();

  drawPlayer();

  drawObstacles();

  createParticles();

  drawParticles();

  glitchEffect();

  ctx.fillStyle = 'rgba(255,255,255,0.03)';

  for(let i=0;i<100;i++){
    ctx.fillRect(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      2,
      2
    );
  }
}

window.addEventListener('keydown', e => {
  if(e.code === 'Space' && player.grounded){
    player.dy = player.jumpForce;
    player.grounded = false;
  }
});

window.addEventListener('touchstart', () => {
  if(player.grounded){
    player.dy = player.jumpForce;
    player.grounded = false;
  }
});