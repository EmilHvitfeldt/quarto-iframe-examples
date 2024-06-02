function GameCanvas(settings) {
  let top = this;
  
  this.functions = [];
  this.keys = [];
  this.ctrlPressed = false;
  this.shiftSPressed = false;
  this.altPressed = false;
  this.images = [];
  this.spheres = [];
  this.font = "Arial";
  this.imageData = undefined;
  this.imageDataData = undefined;
  this.lastLoop = performance.now();
  this.calculateFPS = true;
  this.fps = -1;
  this.deltaTime = 1;
  let mouseLookupTable = [
    "left",
    "middle",
    "right"
  ];
  this.contextMenuDisabled = false;
  this.disableScrollOnMobile = false;
  this.eventFunctions = {
    "mousedown": typeof OnMouseDown !== "undefined",
    "mouseup": typeof OnMouseUp !== "undefined",
    "mousemove": typeof OnMouseMove !== "undefined",
    "contextmenu": typeof OnContextMenu !== "undefined",
    "touchstart": typeof OnTouchStart !== "undefined",
    "touchend": typeof OnTouchEnd !== "undefined",
    "touchmove": typeof OnTouchMove !== "undefined",
    "keydown": typeof OnKeyDown !== "undefined",
    "keyup": typeof OnKeyUp !== "undefined"
  };
  this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  this.createCanvas = function() {
    let canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    return canvas;
  }
  this.setSize = function(width, height) {
    if (top.canvas) {
      top.canvas.width = top.width = width;
      top.canvas.height = top.height = height;
      window.width = this.width;
      window.height = this.height;
    }
    else {
      console.error("There is no canvas!");
    }
  }
  this.fillPageWithCanvas = function() {
    top.canvas.style.position = "fixed";
    top.canvas.style.top = "0px";
    top.canvas.style.left = "0px";
    top.setSize(window.innerWidth, window.innerHeight);
    top.disableScrollOnMobile = true;
    top.contextMenuDisabled = true;
    this.updateSizeOnResize = true;
  }
  this.requestFullscreen = function() {
    if (top.canvas.requestFullscreen)
      top.canvas.requestFullscreen();
    else if (top.canvas.mozRequestFullScreen)
      top.canvas.mozRequestFullScreen();
    else if (top.canvas.webkitRequestFullscreen)
      top.canvas.webkitRequestFullscreen();
    else if (top.canvas.msRequestFullscreen)
      top.canvas.msRequestFullscreen();
  }
  this.exitFullscreen = function() {
    if(document.exitFullscreen)
      document.exitFullscreen();
    else if(document.mozCancelFullScreen)
      document.mozCancelFullScreen();
    else if(document.webkitExitFullscreen)
      document.webkitExitFullscreen();
    else if(document.msExitFullscreen)
      document.msExitFullscreen();
  }
  this.lockPointer = function() {
    top.canvas.requestPointerLock = top.canvas.requestPointerLock || top.canvas.mozRequestPointerLock;
    top.canvas.requestPointerLock();
  }
  this.unlockPointer = function() {
    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
    document.exitPointerLock();
  }
  this.disableContextMenu = function() {
    top.contextMenuDisabled = true;
  }
  this.enableContextMenu = function() {
    top.contextMenuDisabled = false;
  }
  
  this.key = function(key) {
    return top.keys[key];
  }
  
  this.isCtrlPressed = function() {
    return top.ctrlPressed;
  }
  
  this.isShiftPressed = function() {
    return top.shiftPressed;
  }
  
  this.isAltPressed = function() {
    return top.altPressed;
  }
  
  this.update = function() {
    if (top.calculateFPS) {
      var thisLoop = performance.now();
      var delta = (thisLoop - top.lastLoop);
      top.fps = 1000 / delta;
      top.deltaTime = delta / 1000;
      top.lastLoop = thisLoop;
      
      if (top.globalFunctions) {
        window.fps = top.fps;
        window.deltaTime = top.deltaTime;
      }
    }
    
    top.mouse.movementX = 0;
    top.mouse.movementY = 0;
    top.mouse.lastX = top.mouse.x;
    top.mouse.lastY = top.mouse.y;
  }
  
  /******************
  
       Rendering
     
   ******************/
  
  this.clearScreen = function() {
    top.ctx.clearRect(0, 0, top.width, top.height);
  }
  
  this.background = function(color) {
    top.ctx.fillStyle = color;
    top.ctx.fillRect(0, 0, top.width, top.height);
  }
  
  this.circle = function(x, y, radius, color, strokeColor, lineWidth) {
    top.ctx.beginPath();
    top.ctx.arc(x, y, radius, 0, Math.PI * 2);
    top.ctx.fillStyle = color;
    if (strokeColor) top.ctx.strokeStyle = strokeColor;
    if (lineWidth) top.ctx.lineWidth = lineWidth;
    top.ctx.fill();
    if (strokeColor) top.ctx.stroke();
  }
  
  this.ring = function(x, y, radius, color, lineWidth) {
    top.ctx.beginPath();
    top.ctx.arc(x, y, radius, 0, Math.PI * 2);
    top.ctx.strokeStyle = color;
    if (lineWidth) top.ctx.lineWidth = lineWidth;
    top.ctx.stroke();
  }
  
  this.ellipse = function(x, y, radiusX, radiusY, color, rotation = 0, strokeColor, lineWidth) {
    top.ctx.beginPath();
    top.ctx.ellipse(x, y, radiusX, radiusY, rotation, 0, Math.PI * 2);
    top.ctx.fillStyle = color;
    if (strokeColor) top.ctx.strokeStyle = strokeColor;
    if (lineWidth) top.ctx.lineWidth = lineWidth;
    top.ctx.fill();
    if (strokeColor) top.ctx.stroke();
  }
  
  this.rectangle = function(x, y, width, height, color, strokeColor, lineWidth) {
    top.ctx.fillStyle = color;
    if (lineWidth) top.ctx.lineWidth = lineWidth;
    if (strokeColor) {
      top.ctx.beginPath();
      top.ctx.strokeStyle = strokeColor;
      top.ctx.rect(x, y, width, height);
      top.ctx.fill();
      top.ctx.stroke();
    }
    else
      top.ctx.fillRect(x, y, width, height);
  }
  
  this.roundedRectangle = function(x, y, w, h, color, cornerRadii, strokeColor, lineWidth) {
      top.ctx.beginPath();
      top.ctx.arc(x + cornerRadii[0], y + cornerRadii[0], cornerRadii[0], Math.PI, Math.PI * 1.5);
      top.ctx.lineTo(x + w - cornerRadii[1], y);
      top.ctx.arc(x + w - cornerRadii[1], y + cornerRadii[1], cornerRadii[1], Math.PI * 1.5, Math.PI * 2);
      top.ctx.lineTo(x + w, y + h - cornerRadii[2]);
      top.ctx.arc(x + w - cornerRadii[2], y + h - cornerRadii[2], cornerRadii[2], 0, Math.PI * 0.5);
      top.ctx.lineTo(x + cornerRadii[3], y + h);
      top.ctx.arc(x + cornerRadii[3], y + h - cornerRadii[3], cornerRadii[3], Math.PI * 0.5, Math.PI);
      top.ctx.closePath();
      if (strokeColor) {
        if (lineWidth) top.ctx.lineWidth = lineWidth;
        top.ctx.strokeStyle = strokeColor;
        top.ctx.stroke();
      }
      top.ctx.fillStyle = color;
      top.ctx.fill();
  }
  
  this.triangle = function(x1, y1, x2, y2, x3, y3, color, strokeColor, lineWidth) {
    top.ctx.beginPath();
    top.ctx.moveTo(x1, y1);
    top.ctx.lineTo(x2, y2);
    top.ctx.lineTo(x3, y3);
    top.ctx.closePath();
    top.ctx.fillStyle = color;
    if (lineWidth) top.ctx.lineWidth = lineWidth;
    top.ctx.fill();
    if (strokeColor) {
      top.ctx.strokeStyle = strokeColor;
      top.ctx.stroke();
    }
  }
  
  this.setLineCap = function(lineCap) {
    top.ctx.lineCap = lineCap;
  }
  
  this.resetLineCap = function() {
    top.ctx.lineCap = "butt";
  }
  
  this.line = function(x1, y1, x2, y2, strokeWeight, color) {
    top.ctx.beginPath();
    top.ctx.moveTo(x1, y1);
    top.ctx.lineTo(x2, y2);
    if (color) top.ctx.strokeStyle = color;
    if (strokeWeight) top.ctx.lineWidth = strokeWeight;
    top.ctx.stroke();
  }
  
  this.picture = function(url, x, y, width, height) {
    var imageElement = top.images[url];
    if (!imageElement) {
      var img = new Image();
      img.src = url;
      img.onload = function() {
        top.ctx.drawImage(img, x, y, width, height);
      }
      top.images[url] = img;
    }
    else if (imageElement.complete) {
      top.ctx.drawImage(imageElement, x, y, width, height);
    }
  }
  
  this.setFont = function(font) {
    top.font = font;
  }
  
  this.setTextAlign = function(align) {
    top.ctx.textAlign = align;
  }
  
  this.setTextXAlign = function(align) {
    top.ctx.textAlign = align;
  }
  
  this.setTextYAlign = function(align) {
    top.ctx.textBaseline = align;
  }
  
  this.resetTextXAlign = function() {
    top.ctx.textAlign = "left";
  }
  
  this.resetTextYAlign = function() {
    top.ctx.textBaseline = "alphabetic";
  }
  
  this.text = function(textString, x, y, fontSize, color, strokeColor, lineWidth) {
    top.ctx.beginPath();
    top.ctx.font = fontSize + "px " + top.font;
    top.ctx.fillStyle = color;
    if (lineWidth) top.ctx.lineWidth = lineWidth;
    top.ctx.fillText(textString, x, y);
    if (strokeColor) {
      top.ctx.strokeStyle = strokeColor;
      top.ctx.strokeText(textString, x, y);
    }
  }
  
  this.drawVector = function(x, y, v, scale = 1, color = "black") {
      var triangleScale = 7;
      
      var normalizedVector = top.normalizeVector(v);
      var rotatedNormVector = {
        x: -normalizedVector.y,
        y: normalizedVector.x
      }
      
      var endX = x + v.x * scale;
      var endY = y + v.y * scale;
      top.line(x, y, endX, endY, 3, color);
      top.triangle(endX, endY, endX - normalizedVector.x * triangleScale + rotatedNormVector.x * triangleScale, endY - normalizedVector.y * triangleScale + rotatedNormVector.y * triangleScale, endX - normalizedVector.x * triangleScale - rotatedNormVector.x * triangleScale, endY - normalizedVector.y * triangleScale - rotatedNormVector.y * triangleScale, color);
  }
  
  // Pixel manipulation
  
  this.getPixelData = function() {
    top.imageData = top.ctx.getImageData(0, 0, top.width, top.height);
    top.imageDataData = top.imageData.data;
  }
  
  this.updatePixel = function(x, y, r, g, b, a = 255) {
    let i = (x + y * top.width) * 4;
    top.imageDataData[i] = r;
    top.imageDataData[i + 1] = g;
    top.imageDataData[i + 2] = b;
    top.imageDataData[i + 3] = a;
  }
  
  this.updatePixelIndex = function(index, r, g, b, a = 255) {
    var i = index * 4;
    top.imageDataData[i] = r;
    top.imageDataData[i + 1] = g;
    top.imageDataData[i + 2] = b;
    top.imageDataData[i + 3] = a;
  }
  
  this.getPixel = function(x, y) {
    let i = (x + y * top.width) * 4;
    return [
      top.imageDataData[i],
      top.imageDataData[i + 1],
      top.imageDataData[i + 2],
      top.imageDataData[i + 3]
    ];
  }
  
  this.getPixelIndex = function(index) {
    let i = index * 4;
    return [
      top.imageDataData[i],
      top.imageDataData[i + 1],
      top.imageDataData[i + 2],
      top.imageDataData[i + 3]
    ];
  }
  
  this.renderPixelData = function() {
    /*createImageBitmap(top.imageData).then(function(imgBitmap) {
      top.ctx.drawImage(imgBitmap, 0, 0);
    });*/
    
    top.ctx.putImageData(top.imageData, 0, 0);
  }
  
  //
  
  this.save = function() {
    top.ctx.save();
  }
  
  this.restore = function() {
    top.ctx.restore();
  }
  
  this.rotate = function(angle) {
    top.ctx.rotate(angle);
  }
  
  this.translate = function(x, y) {
    top.ctx.translate(x, y);
  }
  
  this.beginPath = function() {
    top.ctx.beginPath();
  }
  
  this.closePath = function() {
    top.ctx.closePath();
  }
  
  this.moveTo = function(x, y) {
    top.ctx.moveTo(x, y);
  }
  
  this.lineTo = function(x, y) {
    top.ctx.lineTo(x, y);
  }
  
  this.fill = function() {
    top.ctx.fill();
  }
  
  this.stroke = function() {
    top.ctx.stroke();
  }
  
  this.fillStyle = function(color) {
    top.ctx.fillStyle = color;
  }
  
  this.strokeStyle = function(color) {
    top.ctx.strokeStyle = color;
  }
  
  this.setLineWidth = function(lineWidth) {
    top.ctx.lineWidth = lineWidth;
  }
  
  this.lineWidth = function(lineWidth) {
      top.ctx.lineWidth = lineWidth;
  }
  
  this.strokeWeight = function(lineWidth) {
      top.ctx.lineWidth = lineWidth;
  }
  
  /******************
  
       3D
     
   ******************/
  
  this.drawSphere = function(screenX, screenY, radius, color, lightDir = {x: 0, y: 0, z: 1}) {
    var id = (screenX + screenY) * radius * (color[0] + 1) * (color[1] + 1) * (color[2] + 1) * (lightDir.x + 1) * (lightDir.y + 1) * (lightDir.z + 1);
    if (top.spheres[id]) {
      if (top.spheres[id].imageData)
        top.ctx.putImageData(top.spheres[id].imageData, screenX - radius, screenY - radius);
      else if (top.spheres[id].image)
        top.ctx.drawImage(top.spheres[id].image, screenX - radius, screenY - radius);
    }
    else {
      var imageData = top.ctx.createImageData(radius * 2, radius * 2);

      for (var y = 0; y < radius * 2; y++) {
        for (var x = 0; x < radius * 2; x++) {
          var line = {
            origin: {x: x, y: y, z: 0},
            direction: {x: 0, y: 0, z: 1}
          };
          var o = {
            position: {x: radius, y: radius, z: radius * 2}
          }

          var oc = {
            x: line.origin.x - o.position.x,
            y: line.origin.y - o.position.y,
            z: line.origin.z - o.position.z
          };
          var loc = top.dot3D(line.direction, oc);
          var ocLength = top.getLength(oc.x, oc.y, oc.z);
          var underSqrt = loc * loc - (ocLength * ocLength - radius * radius);

          if (underSqrt >= 0) {
            var d = -loc - Math.sqrt(underSqrt);
            if (d > 0) { // Circle is not behind player and is closest to player
              var hitPoint = {
                x: line.origin.x + line.direction.x * d,
                y: line.origin.y + line.direction.y * d,
                z: line.origin.z + line.direction.z * d
              };
              var surfaceNormal = top.normalize3DVector({
                x: o.position.x - hitPoint.x,
                y: o.position.y - hitPoint.y,
                z: o.position.z - hitPoint.z
              });

              var diffuse = top.dot3D(lightDir, surfaceNormal);

              var index = (x + y * radius * 2) * 4;
              imageData.data[index] = color[0] * diffuse;
              imageData.data[index + 1] = color[1] * diffuse;
              imageData.data[index + 2] = color[2] * diffuse;
              imageData.data[index + 3] = 255;
            }
          }
        }
      }

      if (window.createImageBitmap) {
        top.spheres[id] = {imageData: undefined, image: undefined};
        createImageBitmap(imageData).then(function(imgBitmap) {
          top.ctx.drawImage(imgBitmap, screenX - radius, screenY - radius);
          top.spheres[id] = {imageData: undefined, image: imgBitmap};
        });
      }
      else {
        top.ctx.putImageData(imageData, screenX - radius, screenY - radius);
        top.spheres[id] = {imageData, image: undefined};
      }
    }
  }
  
  /******************
  
       Audio
     
   ******************/
  
  this.createSound = function(url, volume = 1, startTime = 0, looping = false) {
    var audio = new Audio(url);
    audio.loop = looping;
    audio.currentTime = startTime;
    audio.volume = volume;
    
    return {
      volume,
      startTime,
      audio
    };
  }
  
  this.playSound = function(sound) {
    sound.audio.currentTime = sound.startTime;
    sound.audio.volume = sound.volume;
    sound.audio.play();
  }
  
  this.stopSound = function(sound) {
    sound.audio.stop();
  }
  
  this.pauseSound = function(sound) {
    sound.audio.pause();
  }
  
  this.backgroundMusic = function(url) {
    var audio = new Audio(url);
    audio.loop = true;
    audio.play();
    return audio;
  }
  
  this.fadeOutSound = function(sound, time = 1) {
    var startVolume = sound.volume;
    var count = 0;
    var interv = setInterval(() => {
      sound.audio.volume = (startVolume / (time * 20)) * (time * 20 - count);
      count++;
      if (count > time * 20) {
        sound.audio.pause();
        clearInterval(interv);
      }
    }, 50);
  }
  
  this.playTone = function(freq = 440, time = 1, volume = 1, type = "sine") {
    var oscillator = top.audioContext.createOscillator();
    
    var gainNode = top.audioContext.createGain()
    gainNode.gain.value = volume;
    gainNode.connect(top.audioContext.destination);

    oscillator.type = type;
    oscillator.frequency.value = freq;
    oscillator.connect(gainNode);
    oscillator.start();

    setTimeout(() => {
      oscillator.stop();
    }, time * 1000);
  }
  
  /******************
  
       Math
     
   ******************/
  
  this.DegToRad = Math.PI / 180;
  this.RadToDeg = 180 / Math.PI;
  this.PI = Math.PI;
  this.TWO_PI = Math.PI * 2;
  this.TAU = this.TWO_PI;
  
  this.getDistanceSqr = function(x1, y1, x2, y2) {
    var a = x1 - x2;
    var b = y1 - y2;
    return a * a + b * b;
  }
  
  this.getDistanceSqr3D = function(x1, y1, x2, y2, z1, z2) {
    var a = x1 - x2;
    var b = y1 - y2;
    var c = z1 - z2;
    return a * a + b * b + c * c;
  }
  
  this.getDistance = function(x1, y1, x2, y2) {
    return Math.sqrt(top.getDistanceSqr(x1, y1, x2, y2));
  }
  
  this.getDistance3D = function(x1, y1, x2, y2, z1, z2) {
    return Math.sqrt(top.getDistanceSqr3D(x1, y1, x2, y2, z1, z2));
  }
  
  this.getAngle = function(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
  }
  
  this.normalize = function(x, y) {
    var len = Math.sqrt(x * x + y * y);
    return {
      x: x / len,
      y: y / len
    };
  }
  
  this.normalizeVector = function(v) {
    var len = Math.sqrt(v.x * v.x + v.y * v.y);
    return {
      x: v.x / len,
      y: v.y / len
    };
  }
  
  this.normalize3D = function(x, y, z) {
    var len = Math.sqrt(x * x + y * y + z * z);
    return {
      x: x / len,
      y: y / len,
      z: z / len
    };
  }
  
  this.normalize3DVector = function(x) {
    var len = Math.sqrt(x.x * x.x + x.y * x.y + x.z * x.z);
    return {
      x: x.x / len,
      y: x.y / len,
      z: x.z / len
    };
  }
  
  this.lengthVector = function(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }
  
  this.length3DVector = function(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  }
  
  this.getLength = function() {
    var sum = 0;
    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i];
      sum += arg * arg;
    }
    return Math.sqrt(sum);
  }
  
  this.dot = function(a, b) {
    return a.x * b.x + a.y * b.y;
  }
  
  this.dot3D = function(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }
  
  this.crossProduct3D = function(v1, v2) {
    return {
      x: v1.y * v2.z - v1.z * v2.y,
      y: v1.z * v2.x - v1.x * v2.z,
      z: v1.x * v2.y - v1.y * v2.x
    }
  }
  
  //Intersection
  this.rectanglesIntersect = function(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 + w1 > x2 && x1 < x2 + w2 && y1 + h1 > y2 && y1 < y2 + h2;
  }
  
  this.circlesIntersect = function(x1, y1, r1, x2, y2, r2) {
    return top.getDistance(x1, y1, x2, y2) < r1 + r2;
  }
  
  this.circleRectangleIntersect = function(x1, y1, r1, x2, y2, w2, h2) {
    var circleDistanceX = Math.abs(x1 - (x2 + w2 / 2));
    var circleDistanceY = Math.abs(y1 - (y2 + h2 / 2));

    if (circleDistanceX > (w2 / 2 + r1)) return false;
    if (circleDistanceY > (h2 / 2 + r1)) return false;

    if (circleDistanceX <= (w2 / 2)) return true; 
    if (circleDistanceY <= (h2 / 2)) return true;

    var a = circleDistanceX - w2 / 2;
    var b = circleDistanceY - h2 / 2;
    var cornerDistance_sq = a * a + b * b;

    return cornerDistance_sq <= (r1 * r1);
  }
  
  //Random
  this.random = function(max) {
    return Math.random() * max;
  }
  
  this.randomInt = function(max) {
    return Math.random() * max >> 0;
  }
  
  this.randomArray = function(array) {
    return array[Math.random() * array.length >> 0];
  }
  
  this.randomColor = function(colorDepth) {
    if (colorDepth) {
      var colorStep = 256 / colorDepth;
      var r = Math.ceil((Math.random() * 256 >> 0) / colorStep) * colorStep;
      var g = Math.ceil((Math.random() * 256 >> 0) / colorStep) * colorStep;
      var b = Math.ceil((Math.random() * 256 >> 0) / colorStep) * colorStep;
      
      return "rgb(" + r + "," + g + "," + b + ")";
    }
    else {
      return "rgb(" + (Math.random() * 256 >> 0) + "," + (Math.random() * 256 >> 0) + "," + (Math.random() * 256 >> 0) + ")";
    }
  }
  
  this.create2DArray = function(w, h, value = () => 0) {
    var array = new Array(w);
    for (var i = 0; i < w; i++) {
      array[i] = new Array(h);
      for (var j = 0; j < h; j++) {
        array[i][j] = value(i, j);
      }
    }
    
    return array;
  }
  
  this.mapValue = function(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }
  
  /******************
  
       Export
     
   ******************/
  
  this.canvasToURL = function() {
    return top.canvas.toDataURL();
  }

  this.canvasToImage = function() {
    var img = new Image();
    img.src = top.canvas.toDataURL();
    return img;
  }

  this.saveToFile = function(filename = "canvas.png") {
    var a = document.createElement("a");
    a.download = filename;
    a.href = top.canvas.toDataURL();
    a.click();
  }
  
  /******************
  
       Cookies
     
   ******************/
  
  this.setCookie = function(name, value, expireDays = 36500) {
    let d = new Date();
    d.setTime(d.getTime() + (expireDays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }
  
  this.getCookie = function(name) {
    if (name.length == 0)
      return false;
    
    var cname = name + "=";
    var split = document.cookie.split(";");
    for (let i = 0; i < split.length; i++) {
      let s = split[i];
      var index = s.indexOf(cname);
      if (index > 0) {
        return s.substr(index + cname.length);
      }
    }
    return false;
  }
  
  this.deleteCookie = function(name) {
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
  }
  
  /******************
  
       Misc.
     
   ******************/
  
  //Battery level
  if (navigator.getBattery) {
    navigator.getBattery().then(function (battery) {
      battery.addEventListener('levelchange', function() {
        top.batteryLevel = battery.level * 100;
      });
      top.batteryLevel = battery.level * 100;
    });
  }
  
  this.getBatteryLevel = function() {
    return top.batteryLevel;
  }
  
  /******************
  
       Functions
     
   ******************/
  
  this.functions = [
    {func: this.createCanvas, name: "createCanvas"},
    {func: this.setSize, name: "setSize"},
    {func: this.fillPageWithCanvas, name: "fillPageWithCanvas"},
    {func: this.requestFullscreen, name: "requestFullscreen"},
    {func: this.exitFullscreen, name: "exitFullscreen"},
    {func: this.lockPointer, name: "lockPointer"},
    {func: this.unlockPointer, name: "unlockPointer"},
    {func: this.disableContextMenu, name: "disableContextMenu"},
    {func: this.enableContextMenu, name: "enableContextMenu"},
    {func: this.key, name: "key"},
    {func: this.isCtrlPressed, name: "isCtrlPressed"},
    {func: this.isShiftPressed, name: "isShiftPressed"},
    {func: this.isAltPressed, name: "isAltPressed"},
    {func: this.update, name: "update"},
    
    {func: this.clearScreen, name: "clearScreen"},
    {func: this.background, name: "background"},
    {func: this.circle, name: "circle"},
    {func: this.ring, name: "ring"},
    {func: this.ellipse, name: "ellipse"},
    {func: this.rectangle, name: "rectangle"},
    {func: this.roundedRectangle, name: "roundedRectangle"},
    {func: this.triangle, name: "triangle"},
    {func: this.picture, name: "picture"},
    {func: this.setLineCap, name: "setLineCap"},
    {func: this.resetLineCap, name: "resetLineCap"},
    {func: this.line, name: "line"},
    {func: this.setFont, name: "setFont"},
    {func: this.setTextAlign, name: "setTextAlign"},
    {func: this.setTextXAlign, name: "setTextXAlign"},
    {func: this.setTextYAlign, name: "setTextYAlign"},
    {func: this.resetTextXAlign, name: "resetTextXAlign"},
    {func: this.resetTextYAlign, name: "resetTextYAlign"},
    {func: this.text, name: "text"},
    {func: this.drawVector, name: "drawVector"},
    {func: this.getPixelData, name: "getPixelData"},
    {func: this.updatePixel, name: "updatePixel"},
    {func: this.updatePixelIndex, name: "updatePixelIndex"},
    {func: this.getPixel, name: "getPixel"},
    {func: this.getPixelIndex, name: "getPixelIndex"},
    {func: this.renderPixelData, name: "renderPixelData"},
    {func: this.save, name: "save"},
    {func: this.restore, name: "restore"},
    {func: this.rotate, name: "rotate"},
    {func: this.translate, name: "translate"},
    {func: this.beginPath, name: "beginPath"},
    {func: this.closePath, name: "closePath"},
    {func: this.moveTo, name: "moveTo"},
    {func: this.lineTo, name: "lineTo"},
    {func: this.fill, name: "fill"},
    {func: this.stroke, name: "stroke"},
    {func: this.fillStyle, name: "fillStyle"},
    {func: this.strokeStyle, name: "strokeStyle"},
    {func: this.setLineWidth, name: "setLineWidth"},
    {func: this.lineWidth, name: "lineWidth"},
    {func: this.strokeWeight, name: "strokeWeight"},
    
    {func: this.drawSphere, name: "drawSphere"},
    
    {func: this.createSound, name: "createSound"},
    {func: this.playSound, name: "playSound"},
    {func: this.stopSound, name: "stopSound"},
    {func: this.pauseSound, name: "pauseSound"},
    {func: this.fadeOutSound, name: "fadeOutSound"},
    {func: this.playTone, name: "playTone"},
    
    {func: this.getDistanceSqr, name: "getDistanceSqr"},
    {func: this.getDistance, name: "getDistance"},
    {func: this.getDistanceSqr3D, name: "getDistanceSqr3D"},
    {func: this.getDistance3D, name: "getDistance3D"},
    {func: this.getAngle, name: "getAngle"},
    {func: this.normalize, name: "normalize"},
    {func: this.normalizeVector, name: "normalizeVector"},
    {func: this.normalize3D, name: "normalize3D"},
    {func: this.normalize3DVector, name: "normalize3DVector"},
    {func: this.getLength, name: "getLength"},
    {func: this.dot, name: "dot"},
    {func: this.dot3D, name: "dot3D"},
    {func: this.crossProduct3D, name: "crossProduct3D"},
    {func: this.lengthVector, name: "lengthVector"},
    {func: this.length3DVector, name: "length3DVector"},
    
    {func: this.rectanglesIntersect, name: "rectanglesIntersect"},
    {func: this.circlesIntersect, name: "circlesIntersect"},
    {func: this.circleRectangleIntersect, name: "circleRectangleIntersect"},
    
    {func: this.random, name: "random"},
    {func: this.randomInt, name: "randomInt"},
    {func: this.randomArray, name: "randomArray"},
    {func: this.randomColor, name: "randomColor"},
    
    {func: this.create2DArray, name: "create2DArray"},
    
    {func: this.mapValue, name: "mapValue"},
    
    {func: this.canvasToURL, name: "canvasToURL"},
    {func: this.canvasToImage, name: "canvasToImage"},
    {func: this.saveToFile, name: "saveToFile"},
    
    {func: this.setCookie, name: "setCookie"},
    {func: this.getCookie, name: "getCookie"},
    {func: this.deleteCookie, name: "deleteCookie"},
    
    {func: this.getBatteryLevel, name: "getBatteryLevel"}
  ];
  
  this.variables = [
    {variable: this.RadToDeg, name: "RadToDeg"},
    {variable: this.DegToRad, name: "DegToRad"},
    {variable: this.PI, name: "PI"},
    {variable: this.TWO_PI, name: "TWO_PI"},
    {variable: this.TAU, name: "TAU"}
  ];
  
  this.makeFunctionsGlobal = function() {
    this.globalFunctions = true;
    this.functions.forEach(item => {
      window[item.name] = item.func;
    });
    this.variables.forEach(item => {
      window[item.name] = item.variable;
    });
    
    window.fps = this.fps;
    window.deltaTime = this.deltaTime;
  }
  
  /******************
  
       Init
     
   ******************/
  
  this.settings = settings;
  if (typeof this.settings === 'undefined') {
    //Create a canvas and make it fullscreen
    this.canvas = this.createCanvas();
    this.fillPageWithCanvas();
    
    this.makeFunctionsGlobal();
  }
  else {
    if (typeof this.settings.canvas !== "undefined")
      this.canvas = this.settings.canvas;
    else {
      this.canvas = this.createCanvas();
      if (typeof this.settings.width === "undefined" &&
          typeof this.settings.height === "undefined")
        this.fillPageWithCanvas();
      
      if (typeof this.settings.globalFunctions === "undefined" || (typeof this.settings.globalFunctions !== "undefined" && this.settings.globalFunctions))
        this.makeFunctionsGlobal();
    }
    if (typeof this.settings.width !== "undefined") {
      this.width = this.settings.width;
      this.canvas.width = window.width = this.width;
    }
    if (typeof this.settings.height !== "undefined") {
      this.height = this.settings.height;
      this.canvas.height = window.height = this.height;
    }
    if (typeof this.settings.updateSizeOnResize !== "undefined") {
      this.updateSizeOnResize = this.settings.updateSizeOnResize;
    }
  }
  
  document.addEventListener("keydown", event => {
    this.altPressed = event.altKey;
    this.shiftPressed = event.shiftKey;
    this.ctrlPressed = event.ctrlKey;
      
    this.keys[event.key] = this.keys[event.keyCode] = true;
    this.eventFunctions["keydown"] && OnKeyDown(event);
  });
  document.addEventListener("keyup", event => {
    this.altPressed = event.altKey;
    this.shiftPressed = event.shiftKey;
    this.ctrlPressed = event.ctrlKey;
    
    this.keys[event.key] = this.keys[event.keyCode] = false;
    this.eventFunctions["keyup"] && OnKeyUp(event);
  });
  
  if (this.canvas) {
    this.ctx = this.canvas.getContext("2d");
    
    if (this.updateSizeOnResize) {
      window.addEventListener("resize", () => {
        this.setSize(window.innerWidth, window.innerHeight);
      });
    }
    
    this.mouse = {x: 0, y: 0, lastX: 0, lastY: 0, movementX: 0, movementY: 0, left: false, middle: false, right: false, down: false};
    this.touches = [];
    if (this.globalFunctions) {
      window.mouse = this.mouse;
      window.touches = this.touches;
    }
    
    this.canvas.addEventListener("mousemove", event => {
      let br = this.canvas.getBoundingClientRect();
      this.mouse.x = (event.clientX - br.left) / (br.width / this.width);
      this.mouse.y = (event.clientY - br.top) / (br.height / this.height);
      this.mouse.movementX = event.movementX;
      this.mouse.movementY = event.movementY;
      
      this.eventFunctions["mousemove"] && OnMouseMove(event);
    });
    
    this.canvas.addEventListener("mousedown", event => {
      let button = event.button;
      if (button < 3)
        this.mouse[mouseLookupTable[button]] = true;
      
      if (!this.audioContext)
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      this.eventFunctions["mousedown"] && OnMouseDown(event);
    });
    
    this.canvas.addEventListener("mouseup", event => {
      let button = event.button;
      if (button < 3)
        this.mouse[mouseLookupTable[button]] = false;
      
      this.eventFunctions["mouseup"] && OnMouseUp(event);
    });
    
    this.canvas.addEventListener("contextmenu", event => {
      this.eventFunctions["contextmenu"] && OnContextMenu(event);
      
      if (this.contextMenuDisabled) {
        event.preventDefault();
        return false;
      }
      return true;
    });
    
    //Touch
    
    this.updateTouches = function() {
      let br = this.canvas.getBoundingClientRect();
      
      this.touches = [];
      for (let i = 0; i < event.touches.length; i++) {
        var e = event.touches[i];
        var x = (e.pageX - br.left) / (br.width / this.width);
        var y = (e.pageY - br.top) / (br.height / this.height);
        this.touches[i] = {x, y, id: e.identifier, force: e.force};
      }
      
      if (this.globalFunctions)
        window.touches = this.touches;
    }
    
    this.canvas.addEventListener("touchmove", event => {
      if (this.disableScrollOnMobile)
        event.preventDefault();
     
      this.updateTouches();
      this.mouse.x = this.touches[0].x;
      this.mouse.y = this.touches[0].y;
      
      this.eventFunctions["touchmove"] && OnTouchMove(event);
    });
    
    this.canvas.addEventListener("touchend", event => {
      if (this.disableScrollOnMobile)
        event.preventDefault();
      
      this.touches = [];
      if (this.globalFunctions)
        window.touches = this.touches;
      
      this.mouse.left = false;
      
      this.eventFunctions["touchend"] && OnTouchEnd(event);
    });
    
    this.canvas.addEventListener("touchstart", event => {
      if (this.disableScrollOnMobile)
        event.preventDefault();
      
      this.updateTouches();
      this.mouse.x = this.touches[0].x;
      this.mouse.y = this.touches[0].y;
      this.mouse.left = true;
      
      if (!this.audioContext)
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      this.eventFunctions["touchstart"] && OnTouchStart(event);
    });
  }
}