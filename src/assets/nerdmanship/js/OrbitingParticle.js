// How do x and pivotX interface?
// Set default values to SvgNode and PuppetNode
// Make interactive particle class
// Make animated particle without TweenMax

class OrbitingParticle extends ParticleNode {
  constructor(userSettings) {
    super(userSettings);

  }

  get Settings() { return this.settings; }
  set Settings(userSettings) {
    if (typeof(userSettings) !== "object" ) { console.warn("Wonky! Particle settings is not an object. Correct format: { key: val, ... }"); }
    userSettings = userSettings || {};

    var defaultSettings = {
      color: "green",
      radius: 20,
      x: 0,
      y: 0,
      orbit: 20,
      acceleration: random(0.01, 1),
      speed: random(0.005, 0.05),
      pivotX: 0,
      pivotY: 0,
      factor: 1,
      sin: this.newWaveSeed(),
      cos: this.newWaveSeed()
    };
    this.settings = Object.assign({}, defaultSettings, userSettings);
  }

  applySettings() {
    super.applySettings();
    this.Orbit = this.settings.orbit;
    this.Acceleration = this.settings.acceleration;
    this.Speed = this.settings.speed;
    this.PivotX = this.settings.pivotX;
    this.PivotY = this.settings.pivotY;
    this.Factor = this.settings.factor;
    this.Sin = this.settings.sin;
    this.Cos = this.settings.cos;
  }

  newWaveSeed() {
    return random(0, 2 * Math.PI );
  }

  get Orbit() { return this.orbit; }
  set Orbit(value) { this.orbit = value; }

  get Sin() { return this.sin; }
  set Sin(value) { this.sin = value; }

  get Cos() { return this.cos; }
  set Cos(value) { this.cos = value; }

  get Acceleration() { return this.acceleration; }
  set Acceleration(value) { this.acceleration = value; }

  get Speed() { return this.speed; }
  set Speed(value) { this.speed = value; }

  get PivotX() {}
  set PivotX(value) { this.pivotX = value; }

  get PivotY() {}
  set PivotY(value) { this.pivotY = value; }

  get Factor() { return this.factor; }
  set Factor(value) { this.factor = value; }

  animate() {
    var _this = this;
    this.killAnimation();
    
    this.animating = true;
    
    this.Sin = this.newWaveSeed();
    this.Cos = this.newWaveSeed();

    TweenMax.to(this.target, 1, { x: 1, y: 1, scaleX: 1, scaleY: 1, transformOrigin: "center", repeat: -1, modifiers: {
      x: function(x, target) { return _this.getNextVal(target, "x"); },
      y: function(y, target) { return _this.getNextVal(target, "y"); },
      scaleX: function() { return Math.cos(_this.cos); },
      scaleY: function() { return Math.cos(_this.cos); }
    }});

  }

  killAnimation() {
    if (this.animating) {
      var element = this.target;
      TweenMax.killChildTweensOf(element);
      this.animating = false;
    }
  }
  
  getNextVal(target, attr) {
    var orbit = this.orbit * this.factor;
    var acc = this.acceleration;
    var current, wave, pivot;

    if (attr === "x") {
      current = target._gsTransform.x;
      wave =  this.sin;
      pivot = this.pivotX * this.factor;
      this.sin += this.speed;
    } else if (attr === "y") {
      current = target._gsTransform.y;
      wave = this.cos;
      pivot = this.pivotY * this.factor;
      this.cos += this.speed;
    }
          
    var dest = orbit * Math.sin(wave) + pivot;
    var newVal = current + (dest - current) * acc;
    
    return newVal;
  }
}