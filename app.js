const glowCircles = [...document.querySelectorAll(".background-glow-animated")];

for (let i = 0; i < glowCircles.length; i++) {
  console.log(glowCircles);
  glowCircles[i].style.animationDelay = `${i * 0.6}s`;
}

const canvas = document.querySelector(".hero-canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const context = canvas.getContext("2d");

function drawRandom() {
  const totalIterations = window.innerWidth;
  for (let i = 0; i < totalIterations; i++) {
    let x = Number.parseInt(Math.random() * window.innerWidth);
    let y = Number.parseInt(Math.random() * window.innerHeight);
    let length = Math.random() * 25 + 10;
    let angle = Math.random() * 2 * Math.PI;
    let endX = x + Number.parseInt(Math.cos(angle) * length);
    let endY = y + Number.parseInt(Math.sin(angle) * length);
    let darkness = Number.parseInt(Math.random() * 11 + 5);
  
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(endX, endY);
    context.strokeStyle = `hsl(201, 100%, ${darkness}%)`;
    context.stroke();
  
    context.beginPath();
    context.arc(x, y, 1, 0, 2 * Math.PI, false)
    context.stroke();
  
    context.beginPath();
    context.arc(endX, endY, 1, 0, 2 * Math.PI, false)
    context.stroke();
  }
}

drawRandom();

window.addEventListener('resize', function(event){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawRandom();
});
