/** @type {import('types/sketch').Sketch} */
const sketch = (p5) => {
  const servers = [80, 160, 240];
  const incomingPath = [90, 160, 290, 160];
  const outgoingPaths = servers.map((y) => [350, 160, 550, y]);

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
    p5.line(...incomingPath);
    outgoingPaths.forEach((path) => p5.line(...path));

    p5.noStroke();
    p5.fill('#00e599');
    outgoingPaths.forEach((path, index) => {
      const progress = (p5.millis() / 1800 + index / 3) % 1;
      const incoming = progress < 0.5;
      const amount = incoming ? progress * 2 : (progress - 0.5) * 2;
      const [startX, startY, endX, endY] = incoming ? incomingPath : path;
      p5.circle(p5.lerp(startX, endX, amount), p5.lerp(startY, endY, amount), 10);
    });

    // Draw nodes over the dots so requests enter and leave at the visible line ends.
    p5.stroke('#494b50');
    p5.fill('#18191b');
    p5.rect(30, 135, 120, 50, 8);
    p5.rect(250, 125, 140, 70, 8);
    servers.forEach((y) => p5.rect(490, y - 25, 120, 50, 8));

    p5.noStroke();
    p5.fill('#ffffff');
    p5.text('Requests', 90, 160);
    p5.text('Balancer', 320, 160);
    servers.forEach((y, index) => p5.text(`Server ${index + 1}`, 550, y));
  };
};

export default sketch;
