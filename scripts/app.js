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
  mouse.y = e.y + document.documentElement.scrollTop;
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
    context.lineWidth = 1.5;
    context.strokeStyle = `hsl(201, 100%, ${darkness}%)`;

    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(endX, endY);
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
    if (Math.random() < 0.2) {
      darkness += darknessdx;
    } 

    if(darkness > 14) {
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

// generates info for lines and fills lineArray
function generateLines() {
  lineArray = [];
  const area = window.innerWidth * window.innerHeight;
  const totalIterations = area/2400;
  for (let i = 0; i < totalIterations; i++) {
    let x = Number.parseInt(Math.random() * window.innerWidth);
    let y = Number.parseInt(Math.random() * window.innerHeight);
    let length = Math.random() * 140 + 20;
    let angle = Math.random() * 2 * Math.PI;
    let endX = x + Number.parseInt(Math.cos(angle) * length);
    let endY = y + Number.parseInt(Math.sin(angle) * length);
    let darkness = Number.parseInt(Math.random() * 16);

    lineArray.push(line(x, y, endX, endY, darkness));
  }
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
  let SIZE;
  if(window.innerWidth > 600) {
    SIZE = 280;
  } else {
    SIZE = 220;
  }
  let radgrad = context.createRadialGradient(centerWidth,centerHeight,0,centerWidth,centerHeight,SIZE);
  radgrad.addColorStop(0, '#004166cc');
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
  if (document.documentElement.scrollTop > 100) {
    document.querySelector("nav").className = "scrolled";
  } else {
    document.querySelector("nav").className = "";
  }
}

// skill section
const skillsDiv = document.querySelector(".skill-imgs");

const imgs = [
  "icon-square-big.svg",
  "logo-logomark.svg",
  "Wordpress-Logo.svg",
  "Tux.svg",
  "Java-Logo.svg",
  "HTML5_Badge.svg",
  "CSS3_logo.svg",
  "Unofficial_JavaScript_logo_2.svg",
  "Node.js_logo.svg",
  "Git-Icon-1788C.svg",
  "Npm-logo.svg",
];

// append each img to skillsDiv
imgs.forEach((img) => {
  const imgWrapper = document.createElement("div");
  imgWrapper.classList.add("skill-img-wrapper");
  const imgElement = document.createElement("img");
  imgElement.src = `./assets/${img}`;
  imgWrapper.appendChild(imgElement);

  skillsDiv.appendChild(imgWrapper);
});

const leftSkillButton = document.querySelector(".left-skill-control");
const rightSkillButton = document.querySelector(".right-skill-control");

let allowScroll = true;

rightSkillButton.addEventListener("click", () => {
  if(!allowScroll) return; // if animation in progress, return
  allowScroll = false;
  
  const firstChild = skillsDiv.firstChild;

  //move first child to the end
  skillsDiv.removeChild(firstChild);
  skillsDiv.appendChild(firstChild);

  skillsDiv.classList.add("animate-scroll-right");
  setTimeout(() => {
    skillsDiv.classList.remove("animate-scroll-right");
    allowScroll = true;
  }, 300)
});

leftSkillButton.addEventListener("click", () => {
  if(!allowScroll) return; // if animation in progress, return
  allowScroll = false;

  const lastChild = skillsDiv.lastChild;

  //move first child to the end
  skillsDiv.removeChild(skillsDiv.lastChild);
  skillsDiv.prepend(lastChild);

  skillsDiv.classList.add("animate-scroll-left");
  setTimeout(() => {
    skillsDiv.classList.remove("animate-scroll-left");
    allowScroll = true;
  }, 300)
});
