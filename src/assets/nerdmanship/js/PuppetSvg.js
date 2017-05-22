// PuppetSVG creates an SVG element that can find and use values from a master DOM element
class PuppetSvg extends SvgNode {
  constructor(selector) {
    super();
    this.Master = selector;
    this.syncPuppet();
  }

  get Master() { return this.master; }
  set Master(selector) {
    this.master = document.querySelector(selector);
    this.target.setAttribute("id", "puppet-of-" + this.master.id); 
  }

  get MasterX() { return window.pageXOffset + this.master.getBoundingClientRect().left; }
  get MasterY() { return window.pageYOffset + this.master.getBoundingClientRect().top; }
  get MasterZ() { return window.getComputedStyle(this.master).getPropertyValue("z-index"); }
  get MasterW() { return this.master.offsetWidth; }
  get MasterH() { return this.master.offsetHeight; }
  
  syncPuppetX() { this.X = this.MasterX; }
  syncPuppetY() { this.Y = this.MasterY; }
  syncPuppetZ() { this.Z = this.MasterZ -1; }
  syncPuppetW() { this.W = this.MasterW; }
  syncPuppetH() { this.H = this.MasterH; }

  syncPuppet() {
    this.syncPuppetX();
    this.syncPuppetY();
    this.syncPuppetZ();
    this.syncPuppetW();
    this.syncPuppetH();
    this.syncPuppetViewbox();
  }
  
  syncPuppetViewbox() {
    var string = `0, 0, ${this.MasterW}, ${this.MasterH}`;
    this.Viewbox = string;
  }

  killPuppet() {
    var parent = this.target.parentElement;
    parent.removeChild(this.target);
  }

  killMaster() {
    var parent = this.master.parentElement;
    parent.removeChild(this.master);
  }
  
  hideMaster() {
    this.master.style.visibility = "hidden";
  }

}