var gc = new GameCanvas();
var perlin = new Perlin();

var noiseScale = 0.01;

var particles = [];
for (var i = 0; i < 5000; i++) {
  particles.push(new Particle(Math.random() * width, Math.random() * height));
}

var time = 0;

background("black");
gc.ctx.globalCompositeOperation = "lighter";

loop();
function loop() {
  for (var i = 0; i < particles.length; i++) {
    var p = particles[i];
    p.update();
    p.render();
  }
  
  time++;
  requestAnimationFrame(loop);
}

function Particle(x, y) {
  this.x = x;
  this.y = y;
  this.lx = x;
  this.ly = y;
  this.vx = 0;
  this.vy = 0;
  this.ax = 0;
  this.ay = 0;
  
  this.maxSpeed = 4;
  
  this.update = function() {
    this.follow();
    
    this.vx += this.ax;
    this.vy += this.ay;
    
    var p = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    var a = Math.atan2(this.vy, this.vx);
    var m = Math.min(this.maxSpeed, p);
    this.vx = Math.cos(a) * m
    this.vy = Math.sin(a) * m;
    
    this.x += this.vx;
    this.y += this.vy;
    this.ax = 0;
    this.ay = 0;
    
    this.edges();
  }
  
  this.follow = function() {
    var angle = (perlin.noise(this.x * noiseScale, this.y * noiseScale, time * 0.003) + 1) * Math.PI * 1;
    this.ax += Math.cos(angle) * 1;
    this.ay += Math.sin(angle) * 1;
  }
  
  this.updatePrev = function() {
    this.lx = this.x;
    this.ly = this.y;
  }
  
  this.edges = function() {
    if (this.x < 0) {
      this.x = width;
      this.updatePrev();
    }
    if (this.x > width) {
      this.x = 0;
      this.updatePrev();
    }
    if (this.y < 0) {
      this.y = height;
      this.updatePrev();
    }
    if (this.y > height) {
      this.y = 0;
      this.updatePrev();
    }
  }
  
  this.render = function() {
    line(this.x, this.y, this.lx, this.ly, 1, `hsla(${time * 0.4}, 100%, 50%, 0.01)`);
    this.updatePrev();
  }
}
