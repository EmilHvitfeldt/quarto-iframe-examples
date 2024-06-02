var gc = new GameCanvas();

var points = textToPoints("H U R R A", 40, "Anton");


var titleParticles = [];
var fireworks = [];
var particles = [];

var gravity = 0.1;

setTimeout(function() {
  setInterval(function() {
    fireworks.push(new Firework(Math.random() * width, height, Math.random() - 0.5, -(Math.random() * 7 + 5)));
  }, 200);
}, 2000);

fireworks.push(new Firework(width / 2, height, 0, -9.5, 10, "gold", true));
setInterval(function() {
  fireworks.push(new Firework(width / 2, height, 0, -9.5, 10, "gold", true));
}, 5000);

for (var i = 0; i < 250; i++) {
  circle(
    Math.random() * width,
    Math.random() * height,
    1,
    "rgb(200, 200, 200)"
  );
}
var starImage = canvasToImage();

background("black");
loop();
function loop() {
  gc.ctx.globalCompositeOperation = "source-over";
  background("rgba(0, 0, 0, 0.1)");
  gc.ctx.drawImage(starImage, 0, 0);
  gc.ctx.globalCompositeOperation = "lighter";
  
  for (var i = 0; i < fireworks.length; i++) {
    var firework = fireworks[i];
    firework.update();
    firework.render();
  }
  
  for (var i = 0; i < particles.length; i++) {
    var particle = particles[i];
    particle.update();
    particle.render();
  }
  
  for (var i = 0; i < titleParticles.length; i++) {
    var p = titleParticles[i];
    p.update();
    p.render();
  }
  
  requestAnimationFrame(loop);
}

function TitleParticle(x, y, vx, vy) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.ay = 0.2;
  this.radius = 4;
  this.maxHealth = 200;
  this.health = 200;
  
  this.update = function() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.95;
    this.vy *= 0.95;
    this.vy += this.ay;
    this.ay *= 0.95;
    
    this.radius = (this.health / this.maxHealth) * 4;
    this.health--;
    if (this.health <= 0) {
      titleParticles.splice(titleParticles.indexOf(this), 1);
    }
  }
  
  this.render = function() {
     circle(this.x, this.y, this.radius, "rgba(255, 255, 255, " + (this.health / this.maxHealth) + ")");
  }
}

function Firework(x, y, vx, vy, radius = 5, color = "white", title = false) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.radius = radius;
  this.title = title;
  this.color = color;
  
  this.update = function() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += gravity;
    
    if (this.vy >= 0) {
      fireworks.splice(fireworks.indexOf(this), 1);
      
      if (this.title) {
        var scale = 0.3;
        for (var i = 0; i < points.length; i++) {
          var p = points[i];
          var v = {
            x: (p.x - 60) * scale + (Math.random() - 0.5) * 0.1,
            y: (p.y - 20) * scale + (Math.random() - 0.5) * 0.1
          }
          var particle = new TitleParticle(this.x, this.y, v.x, v.y);
          titleParticles.push(particle);
        }
      }
      else {
        var color = [Math.random() * 256 >> 0, Math.random() * 256 >> 0, Math.random() * 256 >> 0];
        for (var i = 0; i < Math.PI * 2; i += 0.1) {
          var power = (Math.random() + 0.5) * 4;
          var vx = Math.cos(i) * power;
          var vy = Math.sin(i) * power;
          particles.push(new Particle(this.x, this.y, vx, vy, Math.random() + 3, color));
        }
      }
    }
  }
  
  this.render = function() {
    circle(this.x, this.y, this.radius, this.color);
  }
}

function Particle(x, y, vx, vy, radius, color) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.life = 100;
  this.color = color;
  this.radius = radius;
  
  this.update = function() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += gravity;
    
    this.vx *= 0.95;
    this.vy *= 0.95;
    
    this.life--;
    if (this.life <= 0) {
      particles.splice(particles.indexOf(this), 1);
    }
  }
  
  this.render = function() {
    circle(this.x, this.y, 3 * (this.life / 100), "rgba(" + this.color[0] + ", " + this.color[1] + ", " + this.color[2] + ", " + (this.life / 100) + ")");
  }
}

function textToPoints(text, textSize, font) {
  var canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = textSize * 1.3;
  var ctx = canvas.getContext("2d");
  
  ctx.textBaseline = "middle";
  ctx.font = textSize + "px " + font;
  ctx.fillText(text, 0, canvas.height / 2);
  
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var data = imageData.data;
  
  var points = [];
  var index = (x, y) => (x + canvas.width * y) * 4;
  var threshold = 50;
  
  for (var i = 0; i < data.length; i += 4) {
    if (data[i + 3] > threshold) {
      var p = {
        x: (i / 4) % canvas.width,
        y: (i / 4) / canvas.width >> 0
      };
      
      if (data[index(p.x + 1, p.y) + 3] < threshold ||
          data[index(p.x - 1, p.y) + 3] < threshold ||
          data[index(p.x, p.y + 1) + 3] < threshold ||
          data[index(p.x, p.y - 1) + 3] < threshold) {
        points.push({
          x: (i / 4) % canvas.width,
          y: (i / 4) / canvas.width >> 0
        });
      }
    }
  }
  
  return points;
}
