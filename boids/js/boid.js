class Boid {

  /**
   * Contstruct Boid object
   *
   * @param  object | boid | Initial setup properties for boid
   *
   */
  constructor(boid) {

    // Initial Properties
    this.id = boid.id;
    this.position = new Victor( boid.x, boid.y );
    this.radius = boid.radius * radiusCoefficients[ boid.radiusCoefficient ];
    this.introversionCoefficient = boid.introversionCoefficient;
    this.introversion = boid.introversion * this.introversionCoefficient;
    this.quicknessCoefficient = boid.quicknessCoefficient;
    this.quickness = boid.quickness * this.quicknessCoefficient;
    this.racismCoefficient = boid.racismCoefficient;
    this.racism = boid.racism * boid.racismCoefficient;
    this.color = boid.color;
    this.mass = (4/3) * Math.PI * Math.pow( this.radius,3 );

    // Speed & Velocity & Force
    this.maxSpeed = speedIndex * this.quickness;
    this.speed = this.maxSpeed * .5;
    var radians = Math.PI * getRandomInt(-99,100) / 100;
    this.velocity = new Victor( this.speed * Math.cos( radians ), this.speed * Math.sin( radians ) );
    //Force and Accel
    this.maxForce = 0.5;

  }

  /**
   * Calculate the seek force for a boid and a target
   *
   * @param  object | target | The Victor.js vector for a target's position
   * @return object | The seek force for the target as a vector
   */
  seek( target ){
    var targetposition = target.clone();
    var diff = targetposition.subtract(this.position);
    var desired = new Victor(diff.x,diff.y);

    if (target.radius) {
      var buffer = target.radius + this.radius + 1;
    } else {
      var buffer = this.radius * 2 + 1;
    }

    var dist = diff.magnitude();
    if (dist < buffer) {
      desired.x = 0;
      desired.y = 0;
    } else if ( dist <= 100 ) {
      desired.normalize();
      desired.divide({x:this.maxSpeed * dist / 100,y:this.maxSpeed * dist / 100});
    } else {
      desired.limitMagnitude(this.maxSpeed);
    }
    desired.subtract(this.velocity);
    desired.limitMagnitude(this.maxForce);
    return desired;
  }

  /**
   * Calculate the separation force for a boid and its flock
   *
   * @param  array | boids | The boids array containing all the boids
   * @return object | The Separation force as a Victor vector
   */
  separate( boids ){
    var sum = new Victor();
    var count = 0;
    for (var j = 0; j < boids.length; j++) {
      if ( this.color != boids[j].color ) {
        var racismMultiplier = this.racism;
      } else {
        var racismMultiplier = 0;
      }
      var desiredSeparation = this.radius + boids[j].radius + ( 25 * this.introversion ) + ( 50 * racismMultiplier );
      var sep = this.position.clone().distance(boids[j].position);
      if ( (sep > 0) && (sep < desiredSeparation) ) {
        var thisposition = this.position.clone();
        var diff = thisposition.subtract(boids[j].position);
        diff.normalize();
        diff.divide({x:sep,y:sep});
        sum.add(diff);
        count++;
      }
    }
    if (count > 0) {
      sum.divide({x:count,y:count});
      sum.normalize();
      sum.multiply({x:this.maxSpeed,y:this.maxSpeed});
      sum.subtract(this.velocity);
      sum.limitMagnitude(this.maxForce);
    }
    return sum;
  }

  /**
   * Calculate the alignment force for a boid and its flock
   *
   * @param  array | boids | The boids array containing all the boids
   * @return object | The alignment force as a Victor vector
   */
  align( boids ) {
    var neighborDist = 50;
    var sum = new Victor();
    var steer = new Victor();
    var count = 0;
    for (var i = 0; i < boids.length; i++) {
      var dist = this.position.distance(boids[i].position);
      if ( dist > 0 && dist < neighborDist ) {
        sum.add(boids[i].velocity);
        count++;
      }
    }
    if (count > 0) {
      sum.divide({x:count,y:count});
      sum.normalize()
      sum.multiply({x:this.maxSpeed,y:this.maxSpeed});
      steer = sum.subtract(this.velocity);
      steer.limitMagnitude(this.maxForce);
      return steer;
    } else {
      return steer;
    }
  }

  /**
   * Calculate the cohesion force for a boid and its flock
   *
   * @param  array | boids | The boids array containing all the boids
   * @return object | The cohesion force as a Victor vector
   */
  cohesion( boids ) {
    var neighborDist = 50;
    var sum = new Victor();
    var count = 0;
    for (var i = 0; i < boids.length; i++) {
      var dist = this.position.distance(boids[i].position);
      if ( dist > 0 && dist < neighborDist ) {
        sum.add(boids[i].position);
        count++;
      }
    }
    if (count > 0) {
      sum.divide({x: count,y:count});
      return this.seek(sum);
    } else {
      return sum;
    }
  }

  /**
   * Avoid the canvas walls if walls are enabled
   *
   * @return object/boolean | The seek force to avoid a wall, or false if not near a wall
   */
  avoidWalls() {

    var buffer = mobile ? 5 : 15;

    if ( this.distanceFromHorWall() < this.radius * buffer || this.distanceFromVertWall() < this.radius * buffer ) {
      return this.seek(center);
    } else { return false; }

  }

  /**
   * Run force calculation functions for the boid, then apply forces
   *
   */
  flock() {

    // Get Forces
    var alignForce = this.align(boids);
    if ( mouseSeek ) var mouseForce = this.seek(mouse.position);
    var separateForce = this.separate(boids);
    var cohesionForce = this.cohesion(boids);
    if ( walls ) var avoidWallsForce = this.avoidWalls();

    // Weight Forces
    var alignWeight = 1.2;
    if ( mouseSeek ) var mouseWeight = .2;
    var separateWeight = 1;
    var cohesionWeight = 1;
    if ( walls ) var avoidWallsWeight = 1.2;


    // Apply forces
    this.applyForce( alignForce, alignWeight );
    if ( mouseSeek ) this.applyForce( mouseForce, mouseWeight );
    this.applyForce( separateForce, separateWeight );
    this.applyForce( cohesionForce, cohesionWeight );
    if ( walls && avoidWallsForce ) this.applyForce( avoidWallsForce, avoidWallsWeight );

  }

  /**
   * Apply a coefficient to a given force and apply it to the boid
   *
   * @param object | force | The Victor vector of the force to be applied
   * @param float | coefficient | The factor to be applied to the force
   */
  applyForce( force, coefficient ) {
    if ( ! coefficient ) { var coefficient = 1; }
    force.multiply({x:coefficient,y:coefficient});
    this.velocity.add(force);
    this.velocity.limitMagnitude( this.maxSpeed );
  }

  /**
   * Run the flock function and update the boid's position based on the resulting velocity
   *
   */
  nextPosition() {

    // Loop through behaviors to apply forces
    this.flock();

    // Update position
    this.position = this.position.add(this.velocity);

    // Collision detection if enabled
    if ( collisions ) { this.detectCollision(); }

    // Check edges for walls or overruns
    this.edgeCheck();

  }

  /**
   * Check for edge crossings and bounce the boid or wrap it to the other side of the canvas
   *
   */
  edgeCheck() {
    if (walls) {
      this.wallBounce();
    } else {
      this.borderWrap();
    }
  }

  /**
   * If the boid passes a border with no walls, wrap the boid to the other side of the canvas
   *
   */
  borderWrap() {
    if (this.position.x < 0) {
      this.position.x = document.body.clientWidth;
    } else if ( this.position.x > document.body.clientWidth ) {
      this.position.x = 0;
    }
    if (this.position.y < 0) {
      this.position.y = document.body.clientHeight;
    } else if ( this.position.y > document.body.clientHeight ) {
      this.position.y = 0;
    }
  }

  /**
   * Detect a wall hit and bounce boid
   *
   */
  wallBounce() {
    if (this.position.x <= this.radius) {
      this.position.x = this.radius;
    } else if ( this.position.x >= document.body.clientWidth - this.radius) {
      this.position.x = document.body.clientWidth - this.radius;
    }
    if (this.position.y <= this.radius) {
      this.position.y = this.radius;
    } else if ( this.position.y >= document.body.clientHeight - this.radius ) {
      this.position.y = document.body.clientHeight - this.radius;
    }
    if ( this.distanceFromHorWall() <= this.radius  ) {
      this.velocity.invertY();
    }
    if ( this.distanceFromVertWall() <= this.radius  ) {
      this.velocity.invertX();
    }
  }

  /**
   * Calculate the distance from vertical wall in the direction of the boid's velocity
   *
   * @param float | the boid's distance from the wall
   */
  distanceFromVertWall() {
    if (this.velocity.x > 0) {
      return document.body.clientWidth - ( this.position.x );
    } else {
      return this.position.x;
    }

  }

  /**
   * Calculate the distance from horizontal wall in the direction of the boid's velocity
   *
   * @param float | the boid's distance from the wall
   */
  distanceFromHorWall() {
    if (this.velocity.y > 0) {
      return document.body.clientHeight - ( this.position.y );
    } else {
      return this.position.y;
    }
  }

  /**
   * Draw Boid to the canvas
   *
   */
  draw(){
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }

  /**
   * Update a boid's position and call draw()
   *
   */
  update() {

    this.nextPosition();
    this.draw();

  }

  /**
   * Detect collisions between boids and resolve
   *
   */
  detectCollision(){

    for (var i = 0; i < boids.length; i++) {
      if ( this === boids[i] ) { continue; }
      if ( getDistance( this.position.x, this.position.y, boids[i].position.x, boids[i].position.y) - ( this.radius + boids[i].radius ) < 0 ) {
        this.resolveCollision( this, boids[i]);
      }
    }
  }

/**
 * Rotates coordinate system for velocities
 * Takes velocities and alters them as if the coordinate system they're on was rotated
 *
 * @param  object | velocity | The velocity of an individual boid
 * @param  float  | angle    | The angle of collision between two objects in radians
 * @return object | The altered x and y velocities after the coordinate system has been rotated
 */
  rotate(velocity, angle) {
    return {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };
  }

  /**
   * Swaps out two colliding boids' x and y velocities after running through
   * an elastic collision reaction equation
   *
   * @param  object | boid      | A boid object
   * @param  object | otherBoid | A boid object
   */
   resolveCollision(boid, otherBoid) {

      var xVelocityDiff = boid.velocity.x - otherBoid.velocity.x;
      var yVelocityDiff = boid.velocity.y - otherBoid.velocity.y;

      var xDist = otherBoid.position.x - boid.position.x;
      var yDist = otherBoid.position.y - boid.position.y;

      // Prevent accidental overlap of boids
      if ( xVelocityDiff * xDist + yVelocityDiff * yDist >= 0 ) {

        // Grab angle between the two colliding boids
        var angle = -Math.atan2(otherBoid.position.y - boid.position.y, otherBoid.position.x - boid.position.x);

        // Store mass in var for better readability in collision equation
        var m1 = boid.mass;
        var m2 = otherBoid.mass;

        // Velocity before equation
        var u1 = this.rotate(boid.velocity, angle);
        var u2 = this.rotate(otherBoid.velocity, angle);

        // Velocity after 1d collision equation
        var v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        var v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original position
        var vFinal1 = this.rotate(v1, -angle);
        var vFinal2 = this.rotate(v2, -angle);

        // Swap boid velocities for realistic bounce effect
        boid.velocity.x = vFinal1.x;
        boid.velocity.y = vFinal1.y;
        boid.velocity.limitMagnitude(boid.maxSpeed);

        otherBoid.velocity.x = vFinal2.x;
        otherBoid.velocity.y = vFinal2.y;
        otherBoid.velocity.limitMagnitude(otherBoid.maxSpeed);
      }

    }

}
