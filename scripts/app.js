const assetsDir = "./assets";
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

    if (darkness > 14) {
      darknessdx = -1;
    } else if (darkness < 4) {
      darknessdx = 1;
    }

    // get midpoint distance
    const midX = x + (endX - x) / 2;
    const midY = y + (endY - y) / 2;
    const mouseDistance = Math.hypot(midX - mouse.x, midY - mouse.y);

    // mouse glow
    if (mouseDistance < 80) {
      darkness += 80 / mouseDistance;
    }

    darkness = Math.max(Math.min(darkness, 25), 3);

    // mouse push
    if (mouseDistance < 100) {
      const forces = calcMouseForce(x, y, mouse.x, mouse.y);
      const endForces = calcMouseForce(endX, endY, mouse.x, mouse.y);

      dx += forces.fx;
      dy += forces.fy;
      endDx += endForces.fx;
      endDy += endForces.fy;
    }

    // origin pull
    if (!mouse.isDown) {
      const originForces = calcOriginForce(x, y, origin.x, origin.y);
      const originEndForces = calcOriginForce(
        endX,
        endY,
        origin.endX,
        origin.endY
      );

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
    const magnitude = Math.min(1 / (distance / 50), 0.8);

    const fx = magnitude * Math.cos(mouseAngle);
    const fy = magnitude * Math.sin(mouseAngle);
    return { fx, fy };
  }

  function calcOriginForce(x1, y1, x2, y2) {
    const x0 = x1 - x2;
    const y0 = y1 - y2;

    const distance = Math.hypot(x0, y0);
    const mouseAngle = Math.atan2(y0, x0);
    const magnitude = -Math.min(distance / 10, 0.8);

    const fx = magnitude * Math.cos(mouseAngle);
    const fy = magnitude * Math.sin(mouseAngle);
    return { fx, fy };
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
  const totalIterations = Math.min(area / 2400, 500); // cap at 500 for performance
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
  if (window.innerWidth > 600) {
    SIZE = 280;
  } else {
    SIZE = 220;
  }
  let radgrad = context.createRadialGradient(
    centerWidth,
    centerHeight,
    0,
    centerWidth,
    centerHeight,
    SIZE
  );
  radgrad.addColorStop(0, "#004166cc");
  radgrad.addColorStop(1, "#00416600");

  // draw shape
  context.fillStyle = radgrad;
  context.fillRect(0, 0, window.innerWidth, window.innerHeight);
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

window.onscroll = function () {
  handleNav();
};

function handleNav() {
  if (document.documentElement.scrollTop > 100) {
    document.querySelector("nav").className = "scrolled";
  } else {
    document.querySelector("nav").className = "";
  }
}

// skill section
const skillsDiv = document.querySelector(".skill-imgs");
const skillTitle = document.querySelector(".skill-title");
const skillText = document.querySelector(".skill-text");

const skill = (img, title, text) => {
  const imagePath = `${assetsDir}/skill-icons/${img}`;

  function init() {
    const imgWrapper = document.createElement("div");
    imgWrapper.classList.add("skill-img-wrapper");
    const imgElement = document.createElement("img");
    imgElement.src = imagePath;
    imgWrapper.appendChild(imgElement);

    skillsDiv.appendChild(imgWrapper);
  }

  function display() {
    skillTitle.innerText = title;
    skillText.innerText = text;
  }

  return {
    imagePath,
    img,
    init,
    display,
  };
};

const skillsList = [
  skill(
    "icon-square-big.svg",
    "Webpack",
    "Another simple, but powerful tool I'm comfortable using."
  ),
  skill(
    "logo-logomark.svg",
    "Firebase",
    "For many of my earlier projects, having a free and simple backend service was easy way to get started, so Firebase has become a service I'm very familiar with."
  ),
  skill(
    "Wordpress-Logo.svg",
    "Wordpress",
    "The very first website I built, for my high school robotics team, was a full deep dive into Wordpress. It's not my strongest suit, but it is another tool I'm capable of handling."
  ),
  skill(
    "Tux.svg",
    "Linux",
    "Having spent a lot of time learning cybersecurity, I'm very familiar with Linux, including writing bash scripts. I also use Ubuntu for development, just for convenience."
  ),
  skill(
    "Java-Logo.svg",
    "Java",
    "As my weapon of choice for coding competitions, I'm extremely comfortable writing in java. I even won 3rd in State UIL for knowing this language as well as I do!"
  ),
  skill(
    "HTML5_Badge.svg",
    "HTML",
    "Surprise surprise, I can write HTML. It's basic, but that doesn't mean I skip out on best practices."
  ),
  skill(
    "CSS3_logo.svg",
    "CSS",
    "CSS is one of my favorite languages, not for the mess of code that comes with it, but for the crisp UIs it allows me to make!"
  ),
  skill(
    "Unofficial_JavaScript_logo_2.svg",
    "Javascript",
    "I'm very capable using Javascript to build websites, but I'll admit code cleanliness is no easy feat in this language!"
  ),
  skill(
    "Node.js_logo.svg",
    "Node.js",
    "A new addition, it's my first full step into the backend. I'm still an amateur, but it's made me capable of making dynamic, more complex user interfaces than ever before."
  ),
  skill(
    "Git-Icon-1788C.svg",
    "Git",
    "Git is a part of all my projects! Solo or collaborative, it keeps me organized and ready to jump back into old projects."
  ),
  skill(
    "Npm-logo.svg",
    "npm",
    "Not much more to say than, I know how to use it!"
  ),
];

// append each img to skillsDiv
skillsList.forEach((skill) => skill.init());

const leftSkillButton = document.querySelector(".left-skill-control");
const rightSkillButton = document.querySelector(".right-skill-control");

let isMouseOverLeftSkill = false;
let isMouseOverRightSkill = false;
leftSkillButton.addEventListener("mouseover", () => {
  isMouseOverLeftSkill = true;
});
leftSkillButton.addEventListener("mouseleave", () => {
  isMouseOverLeftSkill = false;
});
rightSkillButton.addEventListener("mouseover", () => {
  isMouseOverRightSkill = true;
});
rightSkillButton.addEventListener("mouseleave", () => {
  isMouseOverRightSkill = false;
});

let allowScroll = true;

function displaySelectedSkill() {
  // display the correct skill info
  const imageSource = document.querySelector(
    ".skill-img-wrapper:nth-child(6) img"
  ).src;
  const imgSplit = imageSource.split("/");
  const img = imgSplit[imgSplit.length - 1];
  skillsList.find((skill) => skill.img === img).display();
}

function handleRightSkillButton() {
  if (!allowScroll) return; // if animation in progress, return
  allowScroll = false;

  const firstChild = skillsDiv.firstChild;

  // move first child to the end
  skillsDiv.removeChild(firstChild);
  skillsDiv.appendChild(firstChild);

  displaySelectedSkill();

  skillsDiv.classList.add("animate-scroll-right");
  setTimeout(() => {
    skillsDiv.classList.remove("animate-scroll-right");
    allowScroll = true;

    setTimeout(() => {
      if (mouse.isDown && isMouseOverRightSkill) handleRightSkillButton();
    }, 20);
  }, 300);
}

function handleLeftSkillButton() {
  if (!allowScroll) return; // if animation in progress, return
  allowScroll = false;

  const lastChild = skillsDiv.lastChild;

  // move last child to the beginning
  skillsDiv.removeChild(skillsDiv.lastChild);
  skillsDiv.prepend(lastChild);

  displaySelectedSkill();

  skillsDiv.classList.add("animate-scroll-left");
  setTimeout(() => {
    skillsDiv.classList.remove("animate-scroll-left");
    allowScroll = true;

    setTimeout(() => {
      if (mouse.isDown && isMouseOverLeftSkill) handleLeftSkillButton();
    }, 20);
  }, 300);
}

displaySelectedSkill();

rightSkillButton.addEventListener("mousedown", handleRightSkillButton);
leftSkillButton.addEventListener("mousedown", handleLeftSkillButton);

// project section code
const projectsDiv = document.querySelector(".projects-list");
const projectShowcase = document.querySelector(".project-showcase");

let projects;

const project = (icon, img, title, description) => {
  const iconPath = `${assetsDir}/project-pics/${icon}`;
  const imagePath = `${assetsDir}/project-pics/${img}`;
  let exhibit;
  let iconDiv;

  function init() {
    exhibit = document.createElement("div");
    exhibit.classList.add("project-exhibit");

    // place icon in projectList
    iconDiv = document.createElement("div");
    iconDiv.classList.add("project");
    const iconImg = document.createElement("img");
    iconImg.src = iconPath;

    iconDiv.appendChild(iconImg);
    projectsDiv.appendChild(iconDiv);

    // make a project exhibit
    const exhibitImg = document.createElement("div");
    exhibitImg.classList.add("project-exhibit-img");
    exhibitImg.style.backgroundImage = `url("${imagePath}")`;
    exhibit.appendChild(exhibitImg);

    const exhibitText = document.createElement("div");
    exhibitText.classList.add("project-exhibit-text");
    const exhibitTitle = document.createElement("h3");
    exhibitTitle.innerText = title;
    exhibitText.appendChild(exhibitTitle);
    const exhibitDescription = document.createElement("p");
    exhibitDescription.innerText = description;
    exhibitText.appendChild(exhibitDescription);
    exhibit.appendChild(exhibitText);

    projectShowcase.appendChild(exhibit);

    setupListeners();
  }

  function setupListeners() {
    iconDiv.addEventListener("click", () => {
      projects.forEach((project) => {
        if (project.title !== title) project.deselect();
      });
      select();
    });
  }

  function select() {
    iconDiv.classList.add("project-select");
    exhibit.classList.add("project-exhibit-select");
  }

  function deselect() {
    iconDiv.className = "project";
    exhibit.className = "project-exhibit";
  }

  return {
    title,
    init,
    select,
    deselect,
  };
};

projects = [
  project(
    "faith2fight-logo.png",
    "faith2fight.PNG",
    "Faith2Fight",
    "exercitationem, optio, dolores repellendus aliquam cumque libero reprehenderit facilis nostrum iusto similique accusantium voluptate cupiditate asperiores quod quam."
  ),
  project(
    "aero-logo.png",
    "aero.png",
    "Aero Robotics",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae cum impedit mollitia exercitationem, optio, dolores repellendus aliquam cumque libero reprehenderit facilis nostrum iusto similique accusantium voluptate cupiditate asperiores quod quam."
  ),
  project(
    "crystalView-logo.png",
    "crystalView.PNG",
    "Crystal View",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae cum impedit mollitia exercitationem, optio, dolores repellendus aliquam cumque libero reprehenderit facilis nostrum iusto similique accusantium voluptate cupiditate asperiores quod quam."
  ),
  project(
    "etchasketch-logo.png",
    "etchasketch.PNG",
    "Etch-a-Sketch",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae cum impedit mollitia exercitationem, optio, dolores repellendus aliquam cumque libero reprehenderit facilis nostrum iusto similique accusantium voluptate cupiditate asperiores quod quam."
  ),
  project(
    "tictactoe-logo.png",
    "tictactoe.PNG",
    "tictactoe",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae cum impedit mollitia exercitationem, optio, dolores repellendus aliquam cumque libero reprehenderit facilis nostrum iusto similique accusantium voluptate cupiditate asperiores quod quam."
  ),
];

// initialize all projects
projects.forEach((project) => project.init());

projects[2].select();
