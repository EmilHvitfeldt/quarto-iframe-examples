(function () {
  'use strict';
  window.addEventListener('load', function() {
    var canvas = document.getElementById('canvas');

    if (!canvas || !canvas.getContext) {
      return false;
    }

    /********************
      Random Number
    ********************/

    function rand(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    /********************
      Var
    ********************/

    // canvas 
    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;

    /********************
      Animation
    ********************/

    window.requestAnimationFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(cb) {
        setTimeout(cb, 17);
      };

    /********************
      Ground
    ********************/
    
    function drawGround() {
      ctx.beginPath();
      ctx.fillStyle = 'rgb(255, 255, 255)';
      ctx.rect(0, Y - Y * 0.1, X, Y - Y * -0.1);
      ctx.fill();
    }

    /********************
      Moon
    ********************/
    
    var radius = 150;

    if (X < 768) {
      radius = 100;
    }

    function drawMoon() {
      ctx.save();
      ctx.beginPath();
      var col = '255, 255, 255';
      var g = ctx.createRadialGradient(X / 2, Y / 3, radius, X / 3, Y / 3, 0);
      g.addColorStop(0, "rgba(" + col + ", " + (1 * 1) + ")");
      g.addColorStop(0.5, "rgba(" + col + ", " + (1 * 0.2) + ")");
      g.addColorStop(1, "rgba(" + col + ", " + (1 * 0) + ")");
      ctx.fillStyle = g;
      ctx.arc(X / 2, Y / 3, radius, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
    }

    /********************
      Snow
    ********************/
    
    // var
    var snowNum = 80;
    var backSnowNum = 80;
    var snows = [];
    var backSnows = [];

    if (X < 768) {
      snowNum = 25;
      backSnowNum = 25;
    }
     
    function Snow(ctx, x, y, r, g) {
      this.ctx = ctx;
      this.init(x, y, r, g);
    }

    Snow.prototype.init = function(x, y, r, g) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.c = '255, 255, 255';
      this.v = {
        x: 0,
        y: g
      };
    };

    Snow.prototype.updatePosition = function() {
      this.y += this.v.y;
    };
    
    Snow.prototype.wrapPosition = function() {
      if (this.x - this.r > X) {
        this.x = 0;
      }
      if (this.x + this.r < 0) {
        this.x = X;
      }
      if (this.y - this.r > Y) {
        this.y = 0;
      }
      if (this.y + this.r < 0) {
        this.y = Y;
      }
    };

    Snow.prototype.draw = function() {
      ctx = this.ctx;
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = this.gradient();
      ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    };

    Snow.prototype.gradient = function () {
      var col = this.c;
      var g = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
      g.addColorStop(0, "rgba(" + col + ", " + (1 * 1) + ")");
      g.addColorStop(0.5, "rgba(" + col + ", " + (1 * 0.2) + ")");
      g.addColorStop(1, "rgba(" + col + ", " + (1 * 0) + ")");
      return g;
    };

    Snow.prototype.resize = function() {
      this.x = rand(0, X);
      this.y = rand(0, Y);
    };

    Snow.prototype.render = function() {
      this.updatePosition();
      this.wrapPosition();
      this.draw();
    };

    for (var i = 0; i < backSnowNum; i++) {
      var snow = new Snow(ctx, rand(0, X), rand(0, Y), rand(1, 5), Math.random());
      backSnows.push(snow);
    }
    
    for (var i = 0; i < snowNum; i++) {
      var snow = new Snow(ctx, rand(0, X), rand(0, Y), rand(10, 15), Math.random() + 0.3);
      snows.push(snow);
    }
    
    /********************
      Tree
    ********************/
        
    // var 
    var treeNum = 30;
    var trees = [];
    var backTreeNum = 16;
    var backTrees = [];
    var branchRad = 30 * Math.PI / 180;

    if (X < 768) {
      treeNum = 15;
      backTreeNum = 8;
    }

    function Tree(ctx, x, y, t, w, c) {
      this.ctx = ctx;
      this.init(x, y, t, w, c);
    }

    Tree.prototype.init = function(x, y, t, w, c) {
      this.ctx = ctx;
      this.x = x;
      this.y = y;
      this.t = t;
      this.w = w;
      this.c = c;
      this.splitNum = rand(10, 30);
      this.tSplit = this.t / this.splitNum;
      this.bSplit = this.w / this.splitNum;
    };

    Tree.prototype.draw = function() {
      ctx = this.ctx;
      ctx.lineCap = 'round';
      ctx.lineWidth = 3;
      ctx.strokeStyle = this.c;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x, this.y - this.t);
      ctx.stroke();
      ctx.lineWidth = 1;
      for (var i = 1, j = this.splitNum; i < this.splitNum; i++, j--) {
        var bX1 = this.x + this.bSplit * j;
        var bX2 = this.x - this.bSplit * j;
        var bY = this.y - (Math.tan(branchRad) * this.bSplit * j) - this.tSplit * i;
        ctx.moveTo(this.x, this.y - this.tSplit * i);
        ctx.lineTo(bX1, bY);
        ctx.stroke();
        ctx.moveTo(this.x, this.y - this.tSplit * i);
        ctx.lineTo(bX2, bY);
        ctx.stroke();
      }
    };

    Tree.prototype.resize = function() {
      this.x = rand(0, X);
      this.y = Y - Y * 0.1;
    };

    Tree.prototype.render = function() {
      this.draw();
    };

    for (var i = 0; i < backTreeNum; i++) {
      var tree = new Tree(ctx, rand(0, X), Y - Y * 0.1, rand(200, 400), rand(50, 100), 'rgb(126, 158, 209)');
      backTrees.push(tree);
    }

    for (var i = 0; i < treeNum; i++) {
      var tree = new Tree(ctx, rand(0, X), Y - Y * 0.1, rand(100, 300), rand(20, 100), 'rgb(255, 255, 255)');
      trees.push(tree);
    }

    /********************
      Render
    ********************/
    
    function render(){
      ctx.clearRect(0, 0, X, Y);
      drawMoon();
      drawGround();
      for (var i = 0; i < backSnows.length; i++) {
        backSnows[i].render();
      }
      for (var i = 0; i < backTrees.length; i++) {
        backTrees[i].render();
      }
      for (var i = 0; i < trees.length; i++) {
        trees[i].render();
      }
      for (var i = 0; i < snows.length; i++) {
        snows[i].render();
      }
      requestAnimationFrame(render);
    }

    render();

    /********************
      Event
    ********************/
    
    // resize
    function onResize() {
      X = canvas.width = window.innerWidth;
      Y = canvas.height = window.innerHeight;
      drawMoon();
      drawGround();
      for (var i = 0; i < backSnows.length; i++) {
        backSnows[i].resize();
      }
      for (var i = 0; i < backTrees.length; i++) {
        backTrees[i].resize();
      }
      for (var i = 0; i < trees.length; i++) {
        trees[i].resize();
      }
      for (var i = 0; i < snows.length; i++) {
        snows[i].resize();
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

  });
  // Author
  console.log('File Name / snowyLandscape.js\nCreated Date / January 28, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();

