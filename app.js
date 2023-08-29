const glowCircles = [...document.querySelectorAll(".background-glow-animated")];

for(let i = 0; i < glowCircles.length; i++) {
    console.log(glowCircles);
    glowCircles[i].style.animationDelay = `${i*0.6}s`;
}