const canvas = document.createElement("CANVAS");
const context = canvas.getContext("2d");
const colors = ["red", "orange", "blue", "green", "black", "#4488FF", "teal"];
const array = [];
const pool = [];
let isMouseDown = false;
const mouse = { x: 0, y: 0 };

document.body.appendChild(canvas);
canvas.width = 380;
canvas.height = 380;

const random = (min, max) => Math.random() * (max - min) + min;

const applyStyles = function() {
  document.body.style.background = "#FFFFFF";
  canvas.style.background = "#EEEEEE";
  canvas.style.margin = "0 auto";
  canvas.style.display = "block";
  canvas.style.marginTop = `${((window.innerHeight / 2) - (canvas.height / 2))}px`;
};

const fillPool = function(n) {
  for (let i = 0; i < n; i ++) {
    pool.push({
      x: 0,
      y: 0,
      alpha: 1,
      shrink: random(0.004, 0.01),
      size: random(5, 20),
      speed: random(1, 4),
      vel: {
        x: random(-1, 1),
        y: random(-1, 1),
      },
      color: colors[Math.round(Math.random() * colors.length)]
    });
  }  
};

const requestParticles = function(n = 1) {
  for (let i = 0; i < n; i ++) {
    if (pool.length <= 0) break;

    const p = pool.pop();
    p.x = mouse.x;
    p.y = mouse.y;
    p.vel.x = random(-1, 1);
    p.vel.y = random(-1, 1);
    p.speed = random(1, 4);
    p.size = random(5, 20);
    p.alpha = 1;
    p.shrink = random(0.004, 0.01);
    array.push(p);
  }
}

const update = function() {
  if (isMouseDown) if (pool.length > 0) requestParticles(10);
  
  array.forEach(p => {
    p.x += p.vel.x * p.speed;
    p.y += p.vel.y * p.speed;
    p.alpha -= p.shrink;

    if (p.x + p.size >= canvas.width  || p.x < 0) p.vel.x *= -1;
    if (p.y + p.size >= canvas.height || p.y < 0) p.vel.y *= -1;

    if (p.alpha <= 0) {
      // this can be improved by using a dictionary rather than finding the index
      // to quickly get each particle based on its key and remove it
      const index = array.indexOf(p);
      pool.push(p);
      array.splice(index, 1);
    }
  });
};

const draw = function() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  array.forEach(p => {
    context.fillStyle = p.color;
    context.globalAlpha = p.alpha;
    context.fillRect(p.x, p.y, p.size, p.size);
  });
  context.globalAlpha = 1;
};

const tick = function() {
  update();
  draw();
  requestAnimationFrame(tick);
};

document.body.onmousedown = function({ offsetX, offsetY }) {
  isMouseDown = true;
  mouse.x = offsetX;
  mouse.y = offsetY;
};

document.body.onmouseup = function() { isMouseDown = false; };

document.body.onmousemove = function({ offsetX, offsetY }) {
  if (isMouseDown) {
    mouse.x = offsetX;
    mouse.y = offsetY;
  }
};

applyStyles();
fillPool(400);
tick();