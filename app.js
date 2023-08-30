const glowCircles = [...document.querySelectorAll(".background-glow-animated")];

for (let i = 0; i < glowCircles.length; i++) {
  glowCircles[i].style.animationDelay = `${i * 0.6}s`;
}

const canvas = document.querySelector(".hero-canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const context = canvas.getContext("2d");

let mouse = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

let line = (x, y, endX, endY, darkness) => {
  origin = { x, y, endX, endY };

  function draw() {
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(endX, endY);
    context.strokeStyle = `hsl(201, 100%, ${darkness}%)`;
    context.stroke();

    // circles at ends
    context.beginPath();
    context.arc(x, y, 2, 0, 2 * Math.PI, false);
    context.stroke();

    context.beginPath();
    context.arc(endX, endY, 2, 0, 2 * Math.PI, false);
    context.stroke();
  }

  function update() {
    
  }

  return {
    origin,
    x,
    y,
    endX,
    endY,
    draw,
    update,
  };
};

let lineArray;

function generateLines() {
  lineArray = [];

  const totalIterations = window.innerWidth;
  for (let i = 0; i < totalIterations; i++) {
    let x = Number.parseInt(Math.random() * window.innerWidth);
    let y = Number.parseInt(Math.random() * window.innerHeight);
    let length = Math.random() * 25 + 10;
    let angle = Math.random() * 2 * Math.PI;
    let endX = x + Number.parseInt(Math.cos(angle) * length);
    let endY = y + Number.parseInt(Math.sin(angle) * length);
    let darkness = Number.parseInt(Math.random() * 11 + 5);

    lineArray.push(line(x, y, endX, endY, darkness));
  }
}

function drawLines() {
  lineArray.forEach((line) => {
    line.update();
    line.draw();
  });
}

let circleX = 50;
function animate() {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  drawLines();

  requestAnimationFrame(animate);
}

generateLines();
drawLines();
animate();

window.addEventListener("resize", () => {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  generateLines();
  drawLines();
});
