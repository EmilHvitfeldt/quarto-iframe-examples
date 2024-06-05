function GameCanvas(canvas, width, height, settings) {
    var _this = this;
    
    if (arguments.length == 0) {
        canvas = null;
        width = "FULLSCREEN";
    }
    
    if (typeof canvas === "string") canvas = document.getElementById(canvas);
    this.canvas = canvas || document.body.appendChild(document.createElement("canvas"));
    
    width = width || "FULLSCREEN";
    if (width == "FULLSCREEN") {
        settings = height || settings;
        document.body.style = (settings && settings.appliedBodyStyle) || "padding: 0;margin: 0;overflow: hidden;";
        this.canvas.height = window.innerHeight;
    }
    else {
        this.canvas.height = height;
    }
    this.canvas.width = (width == "FULLSCREEN" ? window.innerWidth : width);
    
    this.ctx = this.canvas.getContext("2d");
    
    this.settings = settings;
    this.globalFunctions = (settings && settings.hasOwnProperty("globalFunctions")) ? settings.globalFunctions : true;
    this.topFunction = this.globalFunctions ? window : this;
    
    this.imagesToLoad = 0;
    this.preloadedImages = [];
    this.storedImages = [];
    this.storedImageData = [];
    
    this.topFunction.width = this.canvas.width;
    this.topFunction.height = this.canvas.height;
    
    /* 
    
    TODO:
        * Buttons with click events
        * Fix gradient
        * Clip function
        
    */
    
    /*
    +------------------------------+
    |            Testing           |
    +------------------------------+
    */
    
    this.topFunction.isItWorking = function() {
        msg = "Yup, it's working!\n(This function can be removed from your code now if you want)";
        console.log(msg);
    };
    
    /*
    +------------------------------+
    |       Public functions       |
    +------------------------------+
    */
    
    window.onload = function() {
        if (typeof preload !== 'undefined' && typeof preload === 'function')
            preload();
        else {
            _this.callFunctions();
        }
    };
    
    this.callFunctions = function() {
        typeof start !== 'undefined' && start();
        if (typeof loop !== 'undefined') {
            var oldLoop = loop;
            loop = function() {
                oldLoop();
                requestAnimationFrame(loop);
            };
            loop();
        }
    };
    
    /*
    +------------------------------+
    |          Rendering           |
    +------------------------------+
    */
    
    //Clear screen
    this.topFunction.clearScreen = function() {
        _this.ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
    };
    
    //Fill screen
    this.topFunction.background = function(color) {
        _this.ctx.beginPath();
        _this.ctx.fillStyle = color;
        _this.ctx.fillRect(0, 0, _this.topFunction.width, _this.topFunction.height);
        _this.ctx.closePath();
    }
    
    //DrawRectangle
    this.topFunction.drawRectangle = function(x, y, width, height, fill, stroke, settings) {
        _this.ctx.beginPath();
        _this.ctx.rect(x, y, width, height);
        
        _this.topFunction.renderShape(fill, stroke, settings);
    };
    this.topFunction.rect = this.topFunction.drawRectangle;
    this.topFunction.rectangle = this.topFunction.drawRectangle;
    
    
    //DrawCircle
    this.topFunction.drawCircle = function(x, y, radius, fill, stroke, settings) {
        _this.ctx.beginPath();
        _this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        _this.ctx.closePath();
        
        _this.topFunction.renderShape(fill, stroke, settings);
    };
    this.topFunction.circle = this.topFunction.drawCircle;
    
    //DrawRing
    this.topFunction.drawRing = function(x, y, radius, color, lineWidth) {
        _this.topFunction.drawCircle(x, y, radius, "", color, lineWidth ? {lineWidth: lineWidth} : undefined);
    };
    this.topFunction.ring = this.topFunction.drawRing;
    
    //DrawTriangle
    this.topFunction.drawTriangle = function(x1, y1, x2, y2, x3, y3, fill, stroke, settings) {
        _this.ctx.beginPath();
        if (x1.hasOwnProperty("x")) {
            _this.ctx.moveTo(x1.x, x1.y);
            _this.ctx.lineTo(y1.x, y1.y);
            _this.ctx.lineTo(x2.x, x2.y);
            color = y2;
            settings = x3;
        }
        else {
            _this.ctx.moveTo(x1, y1);
            _this.ctx.lineTo(x2, y2);
            _this.ctx.lineTo(x3, y3);   
        }
        
        _this.ctx.closePath();
        _this.topFunction.renderShape(fill, stroke, settings);
    };
    this.topFunction.triangle = this.topFunction.drawTriangle;
    this.topFunction.tri = this.topFunction.drawTriangle;
    
    //DrawTriangleEquilateral
    this.topFunction.drawTriangleEquilateral = function(x, y, radius, fill, stroke, settings) {
        var x1 = x + Math.cos(30 * Math.PI / 180) * ((settings && settings.width) || radius);
        var y1 = y + Math.sin(30 * Math.PI / 180) * ((settings && settings.height) || radius);
        
        var x2 = x + Math.cos(150 * Math.PI / 180) * ((settings && settings.width) || radius);
        var y2 = y + Math.sin(150 * Math.PI / 180) * ((settings && settings.height) || radius);
        
        var x3 = x;
        var y3 = y - radius;
        
        _this.topFunction.drawTriangle(x1, y1, x2, y2, x3, y3, fill, stroke, settings);
    };
    this.topFunction.triangleEq = this.topFunction.drawTriangleEquilateral;
    
    this.topFunction.drawRegularPolygon = function(x, y, radius, vertices, fill, stroke, settings) {
        _this.ctx.beginPath();
        for (var i = -90; i < 270; i += 360 / vertices) {
            var x1 = x + Math.cos(i * Math.PI / 180) * ((settings && settings.width) || radius);
            var y1 = y + Math.sin(i * Math.PI / 180) * ((settings && settings.height) || radius);
            if (i == -90) _this.ctx.moveTo(x1, y1);
            else          _this.ctx.lineTo(x1, y1);
        }
        
        _this.ctx.closePath();
        _this.topFunction.renderShape(fill, stroke, settings);
    };
    this.topFunction.regPolygon = this.topFunction.drawRegularPolygon;
    
    //DrawEllipse
    this.topFunction.drawEllipse = function(x, y, width, height, fill, stroke, settings) {
        _this.ctx.beginPath();
        _this.ctx.ellipse(x, y, width, height, (settings && settings.rotation) || 0, 0, Math.PI * 2);
        
        _this.ctx.closePath();
        _this.topFunction.renderShape(fill, stroke, settings);
    };
    this.topFunction.ellipse = this.topFunction.drawEllipse;
    this.topFunction.oval = this.topFunction.drawEllipse;
    
    //PreloadImage
    this.topFunction.preloadImage = function(src) {
        var element = _this.preloadedImages.find(function(elem) {return elem.src === src;});
        console.log("Preloading image... " + src);
        if (!element) {
            _this.imagesToLoad++;
            var img = new Image();
            img.src = src;
            img.onload = function() {
                _this.imagesToLoad--;
                if (_this.imagesToLoad <= 0) {
                    _this.callFunctions();
                }
                console.log("Image preloaded! " + img.src);
            }
            _this.preloadedImages.push({
                src: src,
                image: img
            });
            
            return img;
        }
    }
    
    //DrawImage
    this.topFunction.drawImage = function(src, x, y, width, height, settings) {
        var loadedImage = _this.preloadedImages.find(function(elem) {return elem.src === src;});
        if (loadedImage) {
            if (settings && settings.rotation !== undefined && settings.rotation !== null) {
                _this.ctx.save();
                _this.ctx.translate(x, y);
                _this.ctx.rotate(settings.rotation);
                _this.ctx.drawImage(loadedImage.image, -width / 2, -height / 2, width, height);
                _this.ctx.restore();
            }
            else {
                _this.ctx.drawImage(loadedImage.image, x, y, width, height);
            }
        }
        else {
            var prel = _this.topFunction.preloadImage(src);
            prel.onload = function() {_this.ctx.drawImage(prel, x, y, width, height);};
        }
    };
    this.topFunction.image = this.topFunction.drawImage;
    this.topFunction.picture = this.topFunction.drawImage;
    
    this.topFunction.imageReadPixel = function(imageSrc, x, y) {
        var reader = _this.storedImageData.find(function(elem) {return elem.src === imageSrc;});
        if (reader) {
            if (reader.imagePixelReader.isDoneLoading)
                return reader.imagePixelReader.readPixel(x, y);
            else
                return "Data is added, but has not loaded yet";
        }
        else {
            var newReader = new _this.topFunction.ImagePixelReader(imageSrc);
            _this.storedImageData.push({
                src: imageSrc,
                imagePixelReader: newReader
            });
            return newReader.readPixel(x, y);
        }
    }
    
    //ImagePixelReader
    this.topFunction.ImagePixelReader = function(imageSrc) {
        var top = this;
        
        var loadedImage = _this.preloadedImages.find(function(elem) {return elem.src === imageSrc;});
        if (loadedImage) {
            top.image = loadedImage.image;
            top.isDoneLoading = true;
            top.canvas = document.createElement("canvas");
            top.canvas.width = top.image.width;
            top.canvas.height = top.image.height;
            top.ctx = top.canvas.getContext("2d");
        
            top.ctx.drawImage(top.image, 0, 0);
            top.imageData = top.ctx.getImageData(0, 0, top.image.width, top.image.height).data;
        }
        else {
            console.error("Please preload image before getting data!");
            /*this.isDoneLoading = false;
            this.image.onload = function() {
                top.canvas = document.createElement("canvas");
                top.canvas.width = top.image.width;
                top.canvas.height = top.image.height;
                top.ctx = top.canvas.getContext("2d");
            
                top.ctx.drawImage(top.image, 0, 0);
                top.imageData = top.ctx.getImageData(0, 0, top.image.width, top.image.height).data;
                top.isDoneLoading = true;
                
                top.onload();
            }*/
        }
        
        this.readPixel = function(x, y) {
            if (top.isDoneLoading) {
                var index = (x + y * top.image.height) * 4;
                return [top.imageData[index],
                        top.imageData[index + 1],
                        top.imageData[index + 2],
                        top.imageData[index + 3]];
            }
            else {
                console.log("Is loading!..");
            }
        }
        
        this.onload = function() {};
    }
    
    //DrawLine
    this.topFunction.drawLine = function(x1, y1, x2, y2, color, settings) {
        _this.ctx.beginPath();
        if (x1.hasOwnProperty("x")) {
            _this.ctx.moveTo(x1.x, x1.y);
            _this.ctx.lineTo(y1.x, y1.y);
            color = x2;
            settings = y2;
        }
        else {
            _this.ctx.moveTo(x1, y1);
            _this.ctx.lineTo(x2, y2); 
        }
        
        _this.ctx.closePath();
        _this.ctx.lineCap = (settings && settings.roundedCorners) ? "round" : "butt";
        _this.ctx.strokeStyle = color;
        _this.ctx.lineWidth = (settings && settings.lineWidth) || 2;
        _this.ctx.stroke();
    }
    this.topFunction.line = this.topFunction.drawLine;
    
    //DrawPoint
    this.topFunction.drawPoint = function(x, y) {
        if (x.hasOwnProperty("x")) {
            y = x.y;
            x = x.x;
        }
        _this.topFunction.drawCircle(x, y, 5, "black");
    }
    this.topFunction.point = this.topFunction.drawPoint;
    
    //DrawText
    this.topFunction.drawText = function(text, x, y, fontSize, fill, stroke, settings) {
        if (typeof stroke === "object" && stroke.toString() === "[object Object]") {
            settings = stroke;
            stroke = "";
        }
        _this.ctx.beginPath();
        _this.ctx.font = (fontSize || 30) + "px " + (settings && settings.fontFamily) || "Arial";
        
        _this.ctx.textAlign = (settings && settings.alignText) || "left";
        _this.ctx.lineWidth = (settings && settings.lineWidth) || 2;
        _this.ctx.closePath();
        if (fill) {_this.ctx.fillStyle = fill; _this.ctx.fillText(text, x, y);}
        if (stroke) {_this.ctx.strokeStyle = stroke; _this.ctx.strokeText(text, x, y);}
    }
    this.topFunction.text = this.topFunction.drawText;
    
    //RenderShape
    this.topFunction.drawPolygon = function(list, fill, stroke, settings) {
        var newList = (list.constructor === Array ? list : arguments);
        _this.ctx.beginPath();
        _this.ctx.moveTo(newList[0].x, newList[0].y);
        for (var i = 1; i < newList.length; i++) {
            var p = newList[i];
            _this.ctx.lineTo(p.x, p.y);
        }
        _this.ctx.closePath();
        _this.topFunction.renderShape(fill, stroke, settings);
    };
    this.topFunction.polygon = this.topFunction.drawPolygon;
    
    this.topFunction.gradient = function(startColor, endColor, radius, settings) {
        var arr;
        if (startColor.constructor === Array) {
            settings = radius;
            radius = endColor;
            arr = startColor;
        }
        else {
            arr = [startColor, endColor];
        }
        var gradient = _this.ctx.createLinearGradient(0, 0, 0, radius || 100);
        for (var i = 0; i < arr.length; i++) {
            gradient.addColorStop((1 / (arr.length - 1)) * i, arr[i]);
        }
        return gradient;
    }
    
    //Custom shape
    
    this.topFunction.beginShape = function() {
        _this.ctx.beginPath();
    }
    
    this.topFunction.moveTo = function(x, y) {
        _this.ctx.moveTo(x, y);
    }
    
    this.topFunction.lineTo = function(x, y) {
        _this.ctx.lineTo(x, y);
    }
    
    this.topFunction.curveTo = function(x, y, x2, y2) {
        _this.ctx.quadraticCurveTo(x2, y2, x, y);
    }
    
    this.topFunction.closeShape = function() {
        _this.ctx.closePath();
    }
    
    this.topFunction.renderShape = function(fill, stroke, settings) {
        if (typeof fill === "object" && fill.toString() === "[object Object]") {
            settings = fill;
            fill = "";
        }
        if (typeof stroke === "object" && stroke.toString() === "[object Object]") {
            settings = stroke;
            stroke = "";
        }
        _this.ctx.lineJoin = (settings && settings.roundedCorners) ? "round" : "miter";
        _this.ctx.lineWidth = (settings && settings.lineWidth) || 2;
        if (settings && settings.hasOwnProperty("fillColor")) {_this.ctx.fillStyle = settings.fillColor; _this.ctx.fill();}
        if (settings && settings.hasOwnProperty("strokeColor")) {_this.ctx.strokeStyle = settings.strokeColor; _this.ctx.stroke();}
        
        if (fill) {_this.ctx.fillStyle = fill; _this.ctx.fill();}
        if (stroke) {_this.ctx.strokeStyle = stroke; _this.ctx.stroke();}
    }
    
    
    /*
    +------------------------------+
    |      Pixel manipulation      |
    +------------------------------+
    */
    
    this.topFunction.pixels = [];
    this.imageData;
    
    this.topFunction.updatePixelData = function() {
        _this.imageData = _this.ctx.getImageData(0, 0, _this.canvas.width, _this.canvas.height);
        _this.topFunction.pixels = _this.imageData.data;
    }
    
    this.topFunction.updatePixel = function(x, y, r, g, b, a) {
        var index = (x + y * _this.canvas.width) * 4;
        _this.topFunction.pixels[index    ] = r;
        _this.topFunction.pixels[index + 1] = g;
        _this.topFunction.pixels[index + 2] = b;
        _this.topFunction.pixels[index + 3] = typeof a === 'undefined' ? 255 : a;
    }
    
    this.topFunction.readPixel = function(x, y) {
        var index = (x + y * _this.canvas.width) * 4;
        return [_this.topFunction.pixels[index],
                _this.topFunction.pixels[index + 1],
                _this.topFunction.pixels[index + 2],
                _this.topFunction.pixels[index + 3]];
    }
    
    this.topFunction.renderPixelData = function() {
        _this.ctx.putImageData(_this.imageData, 0, 0);
    }
    
    
    /*
    +------------------------------+
    |             Math             |
    +------------------------------+
    */
    
    
    //Distance
    this.topFunction.getDistance = function(x1, y1, x2, y2) {
        if (x1.hasOwnProperty("x")) {
            y2 = y1.y;
            x2 = y1.x;
            y1 = x1.y;
            x1 = x1.x;
        }
        var a = x1 - x2;
        var b = y1 - y2;
        return Math.sqrt(a * a + b * b);
    }
    this.topFunction.distance = this.topFunction.getDistance;
    
    //Angle
    this.topFunction.getAngle = function(x1, y1, x2, y2, settings) {
        if (x1.hasOwnProperty("x")) {
            settings = x2;
            y2 = y1.y;
            x2 = y1.x;
            y1 = x1.y;
            x1 = x1.x;
        }
        if (settings && settings.angleMode && (settings.angleMode.toUpperCase() == "DEG" || settings.angleMode.toUpperCase() == "DEGREES"))
            return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        else if ((settings && settings.angleMode && (settings.angleMode.toUpperCase() == "RAD" || settings.angleMode.toUpperCase() == "RADIUS")) || !settings)
            return Math.atan2(y2 - y1, x2 - x1);
    }
    
    //Random functions
    
    this.topFunction.random = function(min, max) {
        if (typeof max == "undefined")
            return Math.random() * min;
        else
            return Math.random() * (max - min) + min;
    }
    
    this.topFunction.randomInt = function(min, max) {
        if (typeof max == "undefined")
            return (Math.random() * min) >> 0;
        else
            return (Math.random() * (max - min) + min) >> 0;
    }
    
    this.topFunction.randomArray = function(array) {
        return array[(Math.random() * array.length) >> 0];
    }
    
    
    /*
    +------------------------------+
    |        Export canvas         |
    +------------------------------+
    */
    
    
    this.topFunction.canvasToURL = function() {
        return _this.canvas.toDataURL();
    }
    
    this.topFunction.canvasToImage = function() {
        var img = new Image();
        img.src = _this.canvas.toDataURL();
        return img;
    }
    
    this.topFunction.downloadCanvasPNG = function(filename) {
        var a = document.createElement("a");
        a.download = filename || "downloadCanvasPNG.png";
        a.href = _this.canvas.toDataURL();
        a.click();
    }
    
    
    /*
    +------------------------------+
    |              Misc.           |
    +------------------------------+
    */
    
    
    this.topFunction.swap = function(a, b) {
        return [b, a];
    }
    
    this.topFunction.createArray = function(n, lengths) {
        return create2dArray(0, n, lengths || 10);
    }
    
    function create2dArray(count, n, lengths) {
        var a = new Array(lengths);
        for (var i = 0; i < a.length; i++) {
            a[i] = count < n - 2 ? create2dArray(count + 1, n, lengths) : new Array(lengths);
        }
        return a;
    }
    
    
    /*
    +------------------------------+
    |         Input / events       |
    +------------------------------+
    */
    
    
    this.topFunction.mouse = {x: 0, y: 0, left: false, middle: false, right: false};
    this.topFunction.mouseX = 0;
    this.topFunction.mouseY = 0;
    this.topFunction.touch = {x: 0, y: 0, touching: false, touches: []};
    this.keyNumber = [];
    this.keyName = [];
    
    this.topFunction.isKeyPressed = function(key) {
        if (isNaN(key))
            return _this.keyName[key] ? true : false;
        else
            return _this.keyNumber[key] ? true : false;
    }
    this.topFunction.getKey = this.topFunction.isKeyPressed;
    
    this.canvas.addEventListener("mousemove", function(e) {
        var rect = _this.canvas.getBoundingClientRect();
        _this.topFunction.mouse.x = _this.topFunction.mouseX = Math.round((e.clientX - rect.left) * (_this.topFunction.width / rect.width));
        _this.topFunction.mouse.y = _this.topFunction.mouseY = Math.round((e.clientY - rect.top) * (_this.topFunction.height / rect.height));
        typeof OnMouseMove === "function" && OnMouseMove(e);
    });
    
    this.canvas.addEventListener("mousedown", function(e) {
        switch (e.which) {
            case 1:
                _this.topFunction.mouse.left = true;
                break;
            case 2:
                _this.topFunction.mouse.middle = true;
                break;
            case 3:
                _this.topFunction.mouse.right = true;
                break;
        }
        typeof OnMouseDown === "function" && OnMouseDown(e);
    });
    
    this.canvas.addEventListener("mouseup", function(e) {
        switch (e.which) {
            case 1:
                _this.topFunction.mouse.left = false;
                break;
            case 2:
                _this.topFunction.mouse.middle = false;
                break;
            case 3:
                _this.topFunction.mouse.right = false;
                break;
        }
        typeof OnMouseUp === "function" && OnMouseUp(e);
    });
    
    this.canvas.addEventListener("touchstart", function(e) {
        e.preventDefault();
        changeTouch(e);
        _this.topFunction.touch.x = e.touches[0].pageX;
        _this.topFunction.touch.y = e.touches[0].pageY;
        _this.topFunction.touch.touching = true;
        
        typeof OnTouchStart === "function" && OnTouchStart(e);
    });
    
    this.canvas.addEventListener("touchend", function(e) {
        e.preventDefault();
        changeTouch(e);
        _this.topFunction.touch.touching = false;
        
        typeof OnTouchEnd === "function" && OnTouchEnd(e);
    });
    
    this.canvas.addEventListener("touchmove", function(e) {
        e.preventDefault();
        changeTouch(e);
        if (_this.settings.setMouseToTouch) {
            _this.topFunction.touch.x = _this.topFunction.mouse.x = _this.topFunction.mouseX = e.touches[0].pageX;
            _this.topFunction.touch.y = _this.topFunction.mouse.y = _this.topFunction.mouseY = e.touches[0].pageY;
        }
        else {
            _this.topFunction.touch.x = e.touches[0].pageX;
            _this.topFunction.touch.y = e.touches[0].pageY;
        }
        
        typeof OnTouchMove === "function" && OnTouchMove(e);
    });
    
    var changeTouch = function(e) {
        _this.topFunction.touch.touches = [];
        for (var i = 0; i < e.touches.length; i++) {
            _this.topFunction.touch.touches.push({x: e.touches[i].pageX, y: e.touches[i].pageY, id: e.touches[i].identifier});
        }
    }
    
    document.addEventListener("keydown", function(e) {
        _this.keyNumber[e.which] = true;
        _this.keyName[e.key] = true;
        typeof OnKeyDown === "function" && OnKeyDown(e);
    });
    
    document.addEventListener("keyup", function(e) {
        _this.keyNumber[e.which] = false;
        _this.keyName[e.key] = false;
        typeof OnKeyUp === "function" && OnkeyUp(e);
    });
}









