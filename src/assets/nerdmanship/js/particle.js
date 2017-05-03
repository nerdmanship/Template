class Particle {
  
  constructor(rect, rectIndex, particleIndex) {

    // Create a reference to a normalised exponential number based on particle index
    var expStrength = 1.8;
    var indexSq = Math.pow(particleIndex, expStrength);
    var countSq = Math.pow(20, expStrength);
    var normalisedIndex = (indexSq / countSq);

    // Create element and set attributes
    this.target = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    this.target.setAttribute("data-dmss", "circle" + rectIndex + particleIndex);
    this.target.setAttribute("cx", "300");
    this.target.setAttribute("cy", "300");
    this.target.setAttribute("r", "15");
    this.target.setAttribute("fill", o.data.colors.rects[rectIndex]);

    // Alias for this particle
    var particle = this.target;

    // Data used to animate this particle
    particle.data = this.getParticleData(particle, normalisedIndex);

    TweenMax.to(particle, 1, { x: 0, y: 0, scaleX: 0, scaleY: 0, repeat: -1, ease: Linear.easeNone,
      modifiers: {
        x: function(x, particle) {

          // Tween particle smoothly from pMin to pMax when rect tween from rectMin to rectMax
          
          var currentX = particle._gsTransform.x; // Current position of particle
          var rectX = o.data.rect.current.x || 0; // Current position of rect
          var offsetX = particle.data.xOffset; // Min value for particle
          var acc = particle.data.xAcceleration; // Slugginess

          // Range values
          var rectMin = o.data.rect.xMin;
          var rectMax = o.data.rect.xMax;
          var particleMin = particle.data.xMin;
          var particleMax = particle.data.xMax;

          // Get a new particle position on particle range based on rects position on rect range
          var nextX = map(rectX, rectMin, rectMax, particleMin, particleMax) + particle.data.xOffset;
          var modifiedVal = currentX + (nextX - currentX) * acc;
          return modifiedVal;
        },

        y: function(y, particle) {
          
          // Move particle vertically on y range
          var ticker = o.data.ticker;
          var sineSpeed = particle.data.sineSpeed;
          var yMin = particle.data.y * (1 - normalisedIndex) - particle.data.yVariation;
          var yMax = particle.data.y * (1 - normalisedIndex) + particle.data.yVariation;

          // Make a wave with unique speed
          var wave = Math.sin(ticker/sineSpeed);

          // Get a value on y range based on wave on wave range
          var modifiedVal = map(wave, -1, 1, yMin, yMax);

          return modifiedVal;
        },

        scaleX: function(scale, particle) {
          // Scale particle up and down
          var ticker = o.data.ticker;
          var sineSpeed = particle.data.sineSpeed;
          var scaleX = particle.data.scale;
          var scaleVariation = particle.data.scaleVariation;
          var scaleMin = scaleX - scaleVariation; // Make this acutal min value
          var scaleMax = scaleX + scaleVariation;

          // Make a wave with unique speed
          var wave = Math.sin(ticker/sineSpeed);

          // Get a value on y range based on wave on wave range
          var newScaleX = map(wave, -1, 1, scaleMin, scaleMax);

          var index = o.data.particles.count - particleIndex-1;
          var val = o.data.scales.particles[index].value;
        
          return newScaleX + newScaleX * val;
        },
        scaleY: function(scale, index, particle) {

          console.log(particle);
          //var val = particle.getScaleValue();
          
          return 0;
        }
      }
    });

  }

  appendTo(parent) {
    parent.appendChild(this.target);
  }

  getParticleData(particle, normalisedIndex) {
    particle.data = {
      xMin: 0,
      xMax: -300 * normalisedIndex,
      xOffset: 0,
      xAcceleration: random(0.01,0.5),
      sineSpeed: random(40,70), // Random tween speed to each particle: higher is slower
      y: random(-50,50),
      yVariation: random(10,50),
      scale: random(0.2, 0.8) + (1 - normalisedIndex)/4,
      scaleVariation: 0.3
    };

    return particle.data;
  }

  getScaleValue() {
    // Scale particle up and down
    var ticker = o.data.ticker;
    var speed = particle.data.sineSpeed;
    var s = particle.data.scale;
    var variation = particle.data.scaleVariation;
    var scaleMin = s - variation;
    var scaleMax = s + variation;

    // Make a wave with unique speed
    var wave = Math.sin(ticker/speed);

    // Get a value on y range based on wave on wave range
    var newScaleVal = map(wave, -1, 1, scaleMin, scaleMax);

    var index = o.data.particles.count - particleIndex-1;
    var timeOffset = o.data.scales.particles[index].value;

    return newScaleVal + newScaleVal * timeOffset;
  }
}