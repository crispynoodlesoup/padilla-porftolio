const glowCircles = [...document.querySelectorAll(".background-glow-animated")];

for (let i = 0; i < glowCircles.length; i++) {
  glowCircles[i].style.animationDelay = `${i * 0.6}s`;
}

const canvas = document.querySelector(".hero-canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const context = canvas.getContext("2d");

let mouse = {
  x: undefined,
  y: undefined,
  isDown: false,
};

window.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

window.addEventListener("mousedown", (e) => {
  mouse.isDown = true;
});

window.addEventListener("mouseup", (e) => {
  mouse.isDown = false;
});

let line = (x, y, endX, endY, darkness) => {
  const origin = { x, y, endX, endY };
  let darknessdx = 1;
  let dx = 0;
  let dy = 0;
  let endDx = 0;
  let endDy = 0;

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
    // glowing effect code
    if (Math.random() < 0.3) {
      darkness += darknessdx;
    } 

    if(darkness > 18) {
      darknessdx = -1;      
    } else if (darkness < 4) {
      darknessdx = 1;
    }

    // get midpoint distance
    const midX = x + (endX - x)/2;
    const midY = y + (endY - y)/2;
    const mouseDistance = Math.hypot(midX - mouse.x, midY - mouse.y);

    // mouse glow
    if(mouseDistance < 80) {
      darkness += 80/mouseDistance;
    }

    darkness = Math.max(Math.min(darkness, 25), 3);

    // mouse push
    if(mouseDistance < 100) {
      const forces = calcMouseForce(x, y, mouse.x, mouse.y);
      const endForces = calcMouseForce(endX, endY, mouse.x, mouse.y)

      dx += forces.fx;
      dy += forces.fy;
      endDx += endForces.fx;
      endDy += endForces.fy;
    }

    // origin pull
    if(!mouse.isDown) {
      const originForces = calcOriginForce(x, y, origin.x, origin.y);
      const originEndForces = calcOriginForce(endX, endY, origin.endX, origin.endY);

      dx += originForces.fx;
      dy += originForces.fy;
      endDx += originEndForces.fx;
      endDy += originEndForces.fy;
    }

    // slow over time
    dx *= 0.92;
    dy *= 0.92;
    endDx *= 0.92;
    endDy *= 0.92;

    x += dx;
    y += dy;
    endX += endDx;
    endY += endDy;
  }

  function calcMouseForce(x1, y1, x2, y2) {
    const x0 = x1 - x2;
    const y0 = y1 - y2;

    const distance = Math.hypot(x0, y0);
    const mouseAngle = Math.atan2(y0, x0);
    const magnitude = Math.min(1 / (distance/50), 0.8);
  
    const fx = magnitude * (Math.cos(mouseAngle));
    const fy = magnitude * (Math.sin(mouseAngle));
    return {fx, fy};
  }

  function calcOriginForce(x1, y1, x2, y2) {
    const x0 = x1 - x2;
    const y0 = y1 - y2;

    const distance = Math.hypot(x0, y0);
    const mouseAngle = Math.atan2(y0, x0);
    const magnitude = -Math.min(distance/10, 0.8);

    const fx = magnitude * (Math.cos(mouseAngle));
    const fy = magnitude * (Math.sin(mouseAngle));
    return {fx, fy};
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
  const area = window.innerWidth * window.innerHeight;
  const totalIterations = area/1200;
  for (let i = 0; i < totalIterations; i++) {
    let x = Number.parseInt(Math.random() * window.innerWidth);
    let y = Number.parseInt(Math.random() * window.innerHeight);
    let length = Math.random() * 60 + 10;
    let angle = Math.random() * 2 * Math.PI;
    let endX = x + Number.parseInt(Math.cos(angle) * length);
    let endY = y + Number.parseInt(Math.sin(angle) * length);
    let darkness = Number.parseInt(Math.random() * 20);

    lineArray.push(line(x, y, endX, endY, darkness));
  }

  /* Alternate Style - lines stretch long
  const totalIterations = area/2500;
  for (let i = 0; i < totalIterations; i++) {
    let x = Number.parseInt(Math.random() * window.innerWidth);
    let y = Number.parseInt(Math.random() * window.innerHeight);
    let length = Math.random() * 1000 + 100;
    let angle = Math.random() * 3 * Math.PI;
    let endX = x + Number.parseInt(Math.cos(angle) * length);
    let endY = y + Number.parseInt(Math.sin(angle) * length);
    let darkness = Number.parseInt(Math.random() * 13 + 3);

    lineArray.push(line(x, y, endX, endY, darkness));
  } */
}

function drawLines() {
  lineArray.forEach((line) => {
    line.update();
    line.draw();
  });
}

function drawBlur() {
  let centerWidth = window.innerWidth / 2;
  let centerHeight = window.innerHeight / 2;
  let SIZE = 225;
  let radgrad = context.createRadialGradient(centerWidth,centerHeight,0,centerWidth,centerHeight,SIZE);
  radgrad.addColorStop(0, '#004166');
  radgrad.addColorStop(1, '#00416600');

  // draw shape
  context.fillStyle = radgrad;
  context.fillRect(0,0,window.innerWidth,window.innerHeight);
}

let circleX = 50;
function animate() {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  drawLines();
  drawBlur();

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

window.onscroll = function() { handleNav() };

function handleNav() {
  if (document.documentElement.scrollTop > 10) {
    document.querySelector("nav").className = "scrolled";
  } else {
    document.querySelector("nav").className = "";
  }
}
