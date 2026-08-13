document.addEventListener("DOMContentLoaded", () => {
  const h1 = document.getElementById("animatedText");
  let hue = 0;

  function animate() {
    hue = (hue + 1) % 360;
    h1.style.color = `hsl(${hue}, 100%, 50%)`;
    requestAnimationFrame(animate);
  }

  animate();
});

