/** @type {import('types/sketch').Sketch} */
const sketch = (p5) => {
  const servers = [80, 160, 240];

  p5.setup = () => {
    p5.createCanvas(640, 320);
    p5.textFont('monospace');
    p5.textAlign(p5.CENTER, p5.CENTER);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) p5.noLoop();
  };

  p5.draw = () => {
    p5.background('#0c0d0d');
    p5.stroke('#494b50');
    p5.strokeWeight(2);
    p5.line(90, 160, 290, 160);
    servers.forEach((y) => p5.line(350, 160, 550, y));

    p5.fill('#18191b');
    p5.rect(30, 135, 120, 50, 8);
    p5.rect(250, 125, 140, 70, 8);
    servers.forEach((y) => p5.rect(490, y - 25, 120, 50, 8));

    p5.noStroke();
    p5.fill('#ffffff');
    p5.text('Requests', 90, 160);
    p5.text('Balancer', 320, 160);
    servers.forEach((y, index) => p5.text(`Server ${index + 1}`, 550, y));

    p5.fill('#00e599');
    servers.forEach((y, index) => {
      const progress = (p5.millis() / 1800 + index / 3) % 1;
      const incoming = progress < 0.5;
      const amount = incoming ? progress * 2 : (progress - 0.5) * 2;
      const x = incoming ? p5.lerp(150, 250, amount) : p5.lerp(390, 490, amount);
      p5.circle(x, incoming ? 160 : p5.lerp(160, y, amount), 10);
    });
  };
};

export default sketch;
