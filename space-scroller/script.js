var gc = new GameCanvas();

var stars = [];
var circles = [];
var lineStars = [];

for (var i = 0; i < 1000; i++) {
  stars.push({x: Math.random() * width, y: Math.random() * height, radius: Math.random() * 2});
}

for (var i = 0; i < 100; i++) {
  lineStars.push({x: Math.random() * width, y: Math.random() * height, lx: 0, ly: 0});
}

for (var i = 0; i < 250; i++) {
  circles.push({x: Math.random() * width, y: Math.random() * height, radius: 300, color: "rgba(255, 0, 0, 0.01)"});
  circles.push({x: Math.random() * width, y: Math.random() * height, radius: 300, color: "rgba(0, 0, 255, 0.01)"});
  if (!(i % 3))
    circles.push({x: Math.random() * width, y: Math.random() * height, radius: 300, color: "rgba(200, 255, 0, 0.01)"});
}

for (var i = 0; i < 100; i++) {
  circles.push({x: random_normal() / 6 * width + width / 2, y: random_normal() / 6 * height + height / 2, radius: 200, color: "rgba(255, 255, 255, 0.01)"});
}

var canvas2 = document.createElement("canvas");
canvas2.width = width;
canvas2.height = height;
var ctx2 = canvas2.getContext("2d");
ctx2.fillStyle = "rgb(20, 20, 20)";
ctx2.fillRect(0, 0, canvas2.width, canvas2.height);
ctx2.globalCompositeOperation = "lighter";
for (var i = 0; i < circles.length; i++) {
  var c = circles[i];
  ctx2.beginPath();
  ctx2.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
  ctx2.fillStyle = c.color;
  ctx2.fill();
}

var img = new Image();
img.src = canvas2.toDataURL();

function loop() {
  background("rgb(20, 20, 20)");
  
  gc.ctx.drawImage(img, 0, 0);
  
  for (var i = 0; i < stars.length; i++) {
    var s = stars[i];
    rect(s.x, s.y, s.radius * 1.5, s.radius * 1.5, "white");
    
    s.x += s.radius / 2;
    
    if (s.x > width) s.x = 0;
    if (s.x < 0) s.x = width;
    if (s.y > height) s.y = 0;
    if (s.y < 0) s.y = height;
  }
  
  for (var i = 0; i < lineStars.length; i++) {
    var s = lineStars[i];
    s.x += 25;
    
    line(s.x, s.y, s.lx, s.ly, "white", "white");
    
    if (s.x > width) s.x = 0;
    if (s.x < 0) s.x = width;
    if (s.y > height) s.y = 0;
    if (s.y < 0) s.y = height;
    
    s.lx = s.x;
    s.ly = s.y;
    
  }
  
  /*var x = width / 2;
  var y = height / 2;
  var radius = 200;
  var grd = gc.ctx.createRadialGradient(x, y, radius, x, y, radius + 20);
  grd.addColorStop(0, "white");
  grd.addColorStop(1, "rgba(255, 255, 255, 0)");
  circle(x, y, radius + 20, grd);
  circle(x, y, radius, "black");*/
}

function random_normal() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}