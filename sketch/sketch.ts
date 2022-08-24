let masses: Mass[];

interface Mass {
  position: p5.Vector;
  velocity: p5.Vector;
  connections: Mass[];
  colour: string;
}

const palette = ["#554236", "#f77825", "#d3ce3d", "#f1efa5", "#60b99a"];

function setup() {
  createCanvas(windowWidth, windowHeight);
  regenerateMassesAndConnections();
}

function draw() {
  background("white");

  for (let m of masses) {
    drawMassConnections(m);
  }
  for (let m of masses) {
    drawMass(m);
  }
  for (let m of masses) {
    updateMass(m);
  }
}
function updateMass(m: Mass): void {
  m.position.add(m.velocity);
  for (let other of m.connections) {
    if (m === other) {
      continue;
    }
    const towards = p5.Vector.sub(other.position, m.position);
    const d = m.position.dist(other.position);
    //const threshold = min(width, height) * 0.8;
    // if (d > threshold) {
    const pullStr = (d * d) / 20000;
    m.velocity.add(towards.copy().normalize().mult(pullStr));
    // } else {
    const pushStr = 1 / (d * d);
    m.velocity.add(
      towards
        .copy()
        .normalize()
        .mult(-10000 * pushStr)
    );
    // }
    //damping
    m.velocity.mult(0.9);
  }
}
function drawMassConnections(m: Mass): void {
  drawConnections(m);
}
function drawMass(m: Mass): void {
  push();
  drawingContext.shadowColor = color(0, 0, 0, 50);
  drawingContext.shadowBlur = 20;
  noStroke();
  fill(m.colour);
  circle(m.position.x, m.position.y, 20);
  pop();
}

function drawConnections(m: Mass): void {
  for (let other of m.connections) {
    if (other === m) {
      continue;
    }
    stroke(30, 30);
    strokeWeight(1);
    line(m.position.x, m.position.y, other.position.x, other.position.y);
  }
}
// If user clicks, draw() will be called again (eventually)
function mousePressed() {
  redraw();
  regenerateMassesAndConnections();
}

function makeRandomMass(): Mass {
  return {
    position: randomScreenPosition(),
    velocity: p5.Vector.random2D().mult(0.2),
    connections: [],
    colour: random(palette),
  };
}

function randomScreenPosition(): p5.Vector {
  return createVector(random(width), random(height));
}

function addRandomConnections(m: Mass, all: Mass[]): void {
  const others = all.filter((o) => o !== m);
  //make a reciprocal connection to one other mass.  (but we might also get picked by others on their turn)
  const other = random(others);
  m.connections.push(other);
  other.connections.push(m);
}

function regenerateMassesAndConnections() {
  masses = [];
  for (let i = 0; i < 25; i++) {
    masses.push(makeRandomMass());
  }
  for (let m of masses) {
    addRandomConnections(m, masses);
  }
}
