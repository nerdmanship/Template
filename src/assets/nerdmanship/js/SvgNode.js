class SvgNode {
  constructor() {
    this.target = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.setNamespace();
  }
  
  setNamespace() {
    this.target.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    this.target.setAttribute("xlinkns", "http://www.w3.org/1999/xlink");
  }

  appendTo(parent) {
    parent.appendChild(this.target);
  }

  prependIn(parent) {
    parent.insertBefore(this.target, parent.childNodes[0]);
  }

  get Viewbox() { return this.target.getAttribute("viewBox"); }
  set Viewbox(value) { this.target.setAttribute("viewBox", value); }

  get X() { return this.target.style.left; }
  set X(value) { this.target.style.left = value + "px"; }

  get Y() { return this.target.style.top; }
  set Y(value) { this.target.style.top = value + "px"; }

  get Z() { return this.target.style["z-index"]; }
  set Z(value) { this.target.style["z-index"] = value; }

  get W() { return this.target.getAttribute("width"); }
  set W(value) { this.target.setAttribute("width", value + "px"); }

  get H() { return this.target.getAttribute("height"); }
  set H(value) { this.target.setAttribute("height", value + "px"); }

  get Style() { return this.target.style; }
  set Style(value) {
    value = this.formatCheck(value);

    var key = value[0];
    var val = value[1];

    this.target.style[key] = val; }

  get Center() {
    var halfWidth = parseFloat(this.W)/2;
    var halfHeight = parseFloat(this.H)/2;
    var xPos = parseFloat(this.X);
    var yPos = parseFloat(this.Y);
    return { x: xPos + halfWidth, y: yPos + halfHeight };
  }

  set Center(value) {
    value = this.formatCheck(value);

    var x = value[0];
    var y = value[1];

    this.X = x - parseFloat(this.W) /2;
    this.Y = y - parseFloat(this.H) /2;
  }

  formatCheck(value) {
    value = value.split(', ');
    if ( value.length === 1 ) { console.warn('Wonky! Setter with multiple values was not split. Correct format: element.Setter = "value, value")'); }
    return value;
  }
}