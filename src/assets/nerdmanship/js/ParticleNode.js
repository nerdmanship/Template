class ParticleNode {
  
  constructor(userSettings) {
    // shape, color, size, count, above/below, inside/outside, behaviour
    this.target = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    this.Settings = userSettings;
    this.applySettings();
  }

  get Settings() { return this.settings; }
  set Settings(userSettings) {
    if (typeof(userSettings) !== "object" ) { console.warn("Wonky! Particle settings is not an object. Correct format: { key: val, ... }"); }
    userSettings = userSettings || {};

    var defaultSettings = {
      color: "green",
      radius: 1,
      x: 0,
      y: 0
    };
    this.settings = Object.assign({}, defaultSettings, userSettings);
  }

  applySettings() {
    this.Radius = this.settings.radius;
    this.Color = this.settings.color;
    this.X = this.settings.x;
    this.Y = this.settings.y;
  }

  get Radius() { return this.target.getAttribute("r"); }
  set Radius(value) { return this.target.setAttribute("r", value); }

  get Color() { return this.target.getAttribute("fill"); }
  set Color(value) { return this.target.setAttribute("fill", value); }

  get X() { return this.target.getAttribute("cx"); }
  set X(value) { return this.target.setAttribute("cx", value); }

  get Y() { return this.target.getAttribute("cy"); }
  set Y(value) { return this.target.setAttribute("cy", value); }

  appendTo(parent) {
    parent.appendChild(this.target);
  }

}