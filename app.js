const glowCircles = [...document.querySelectorAll(".background-glow-animated")];

for (let i = 0; i < glowCircles.length; i++) {
  glowCircles[i].style.animationDelay = `${i * 0.6}s`;
}

const canvas = document.querySelector(".hero-canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const context = canvas.getContext("2d");
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

    lineArray.push({
      x,
      y,
      endX,
      endY,
      darkness,
    });
  }
}

function drawLines() {
  lineArray.forEach((line) => {
    context.beginPath();
    context.moveTo(line.x, line.y);
    context.lineTo(line.endX, line.endY);
    context.strokeStyle = `hsl(201, 100%, ${line.darkness}%)`;
    context.stroke();
  
    context.beginPath();
    context.arc(line.x, line.y, 1, 0, 2 * Math.PI, false);
    context.stroke();
  
    context.beginPath();
    context.arc(line.endX, line.endY, 1, 0, 2 * Math.PI, false);
    context.stroke();

  }); 
}

let circleX = 50;
function animate() {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  drawLines();
  context.beginPath();
  context.strokeStyle = `green`;
  context.arc(circleX, 50, 20, 0, 2 * Math.PI, false);
  context.stroke();

  circleX += 1;
  requestAnimationFrame(animate);
}

generateLines();
drawLines();
animate();

window.addEventListener('resize', () => {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  generateLines();
  drawLines();
});
