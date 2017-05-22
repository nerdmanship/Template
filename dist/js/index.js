"use strict";

function random(min, max) {
  if (max === null) {
    max = min;min = 0;
  }
  return min + Math.random() * (max - min);
}

function randomInt(min, max) {
  if (max === null) {
    max = min;min = 0;
  }
  return Math.floor(min + Math.random() * (max - min + 1));
}

// Get returns a value on destination range based on the input value on source range
function map(value, sourceMin, sourceMax, destinationMin, destinationMax) {
  return destinationMin + (destinationMax - destinationMin) * ((value - sourceMin) / (sourceMax - sourceMin)) || 0;
}

// exponential index normalization = index^pow / count^pow
function expNorm(val, min, max, power) {
  var expValue = Math.pow(val - min, power);
  var expRange = Math.pow(max - min, power);

  // Test this to make sure...
  return expValue / expRange;
}

function degreesToRads(degrees) {
  return degrees * Math.PI / 180;
}

function radsToDegrees(rads) {
  return rads / Math.PI * 180;
}
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SvgNode = function () {
  function SvgNode() {
    _classCallCheck(this, SvgNode);

    this.target = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.setNamespace();
  }

  _createClass(SvgNode, [{
    key: "setNamespace",
    value: function setNamespace() {
      this.target.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      this.target.setAttribute("xlinkns", "http://www.w3.org/1999/xlink");
    }
  }, {
    key: "appendTo",
    value: function appendTo(parent) {
      parent.appendChild(this.target);
    }
  }, {
    key: "prependIn",
    value: function prependIn(parent) {
      parent.insertBefore(this.target, parent.childNodes[0]);
    }
  }, {
    key: "formatCheck",
    value: function formatCheck(value) {
      value = value.split(', ');
      if (value.length === 1) {
        console.warn('Wonky! Setter with multiple values was not split. Correct format: element.Setter = "value, value")');
      }
      return value;
    }
  }, {
    key: "Viewbox",
    get: function get() {
      return this.target.getAttribute("viewBox");
    },
    set: function set(value) {
      this.target.setAttribute("viewBox", value);
    }
  }, {
    key: "X",
    get: function get() {
      return this.target.style.left;
    },
    set: function set(value) {
      this.target.style.left = value + "px";
    }
  }, {
    key: "Y",
    get: function get() {
      return this.target.style.top;
    },
    set: function set(value) {
      this.target.style.top = value + "px";
    }
  }, {
    key: "Z",
    get: function get() {
      return this.target.style["z-index"];
    },
    set: function set(value) {
      this.target.style["z-index"] = value;
    }
  }, {
    key: "W",
    get: function get() {
      return this.target.getAttribute("width");
    },
    set: function set(value) {
      this.target.setAttribute("width", value + "px");
    }
  }, {
    key: "H",
    get: function get() {
      return this.target.getAttribute("height");
    },
    set: function set(value) {
      this.target.setAttribute("height", value + "px");
    }
  }, {
    key: "Style",
    get: function get() {
      return this.target.style;
    },
    set: function set(value) {
      value = this.formatCheck(value);

      var key = value[0];
      var val = value[1];

      this.target.style[key] = val;
    }
  }, {
    key: "Center",
    get: function get() {
      var halfWidth = parseFloat(this.W) / 2;
      var halfHeight = parseFloat(this.H) / 2;
      var xPos = parseFloat(this.X);
      var yPos = parseFloat(this.Y);
      return { x: xPos + halfWidth, y: yPos + halfHeight };
    },
    set: function set(value) {
      value = this.formatCheck(value);

      var x = value[0];
      var y = value[1];

      this.X = x - parseFloat(this.W) / 2;
      this.Y = y - parseFloat(this.H) / 2;
    }
  }]);

  return SvgNode;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// PuppetSVG creates an SVG element that can find and use values from a master DOM element
var PuppetSvg = function (_SvgNode) {
  _inherits(PuppetSvg, _SvgNode);

  function PuppetSvg(selector) {
    _classCallCheck(this, PuppetSvg);

    var _this = _possibleConstructorReturn(this, (PuppetSvg.__proto__ || Object.getPrototypeOf(PuppetSvg)).call(this));

    _this.Master = selector;
    _this.syncPuppet();
    return _this;
  }

  _createClass(PuppetSvg, [{
    key: "syncPuppetX",
    value: function syncPuppetX() {
      this.X = this.MasterX;
    }
  }, {
    key: "syncPuppetY",
    value: function syncPuppetY() {
      this.Y = this.MasterY;
    }
  }, {
    key: "syncPuppetZ",
    value: function syncPuppetZ() {
      this.Z = this.MasterZ - 1;
    }
  }, {
    key: "syncPuppetW",
    value: function syncPuppetW() {
      this.W = this.MasterW;
    }
  }, {
    key: "syncPuppetH",
    value: function syncPuppetH() {
      this.H = this.MasterH;
    }
  }, {
    key: "syncPuppet",
    value: function syncPuppet() {
      this.syncPuppetX();
      this.syncPuppetY();
      this.syncPuppetZ();
      this.syncPuppetW();
      this.syncPuppetH();
      this.syncPuppetViewbox();
    }
  }, {
    key: "syncPuppetViewbox",
    value: function syncPuppetViewbox() {
      var string = "0, 0, " + this.MasterW + ", " + this.MasterH;
      this.Viewbox = string;
    }
  }, {
    key: "killPuppet",
    value: function killPuppet() {
      var parent = this.target.parentElement;
      parent.removeChild(this.target);
    }
  }, {
    key: "killMaster",
    value: function killMaster() {
      var parent = this.master.parentElement;
      parent.removeChild(this.master);
    }
  }, {
    key: "hideMaster",
    value: function hideMaster() {
      this.master.style.visibility = "hidden";
    }
  }, {
    key: "Master",
    get: function get() {
      return this.master;
    },
    set: function set(selector) {
      this.master = document.querySelector(selector);
      this.target.setAttribute("id", "puppet-of-" + this.master.id);
    }
  }, {
    key: "MasterX",
    get: function get() {
      return window.pageXOffset + this.master.getBoundingClientRect().left;
    }
  }, {
    key: "MasterY",
    get: function get() {
      return window.pageYOffset + this.master.getBoundingClientRect().top;
    }
  }, {
    key: "MasterZ",
    get: function get() {
      return window.getComputedStyle(this.master).getPropertyValue("z-index");
    }
  }, {
    key: "MasterW",
    get: function get() {
      return this.master.offsetWidth;
    }
  }, {
    key: "MasterH",
    get: function get() {
      return this.master.offsetHeight;
    }
  }]);

  return PuppetSvg;
}(SvgNode);
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ParticleNode = function () {
  function ParticleNode(userSettings) {
    _classCallCheck(this, ParticleNode);

    // shape, color, size, count, above/below, inside/outside, behaviour
    this.target = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    this.Settings = userSettings;
    this.applySettings();
  }

  _createClass(ParticleNode, [{
    key: "applySettings",
    value: function applySettings() {
      this.Radius = this.settings.radius;
      this.Color = this.settings.color;
      this.X = this.settings.x;
      this.Y = this.settings.y;
    }
  }, {
    key: "appendTo",
    value: function appendTo(parent) {
      parent.appendChild(this.target);
    }
  }, {
    key: "Settings",
    get: function get() {
      return this.settings;
    },
    set: function set(userSettings) {
      if ((typeof userSettings === "undefined" ? "undefined" : _typeof(userSettings)) !== "object") {
        console.warn("Wonky! Particle settings is not an object. Correct format: { key: val, ... }");
      }
      userSettings = userSettings || {};

      var defaultSettings = {
        color: "green",
        radius: 1,
        x: 0,
        y: 0
      };
      this.settings = Object.assign({}, defaultSettings, userSettings);
    }
  }, {
    key: "Radius",
    get: function get() {
      return this.target.getAttribute("r");
    },
    set: function set(value) {
      return this.target.setAttribute("r", value);
    }
  }, {
    key: "Color",
    get: function get() {
      return this.target.getAttribute("fill");
    },
    set: function set(value) {
      return this.target.setAttribute("fill", value);
    }
  }, {
    key: "X",
    get: function get() {
      return this.target.getAttribute("cx");
    },
    set: function set(value) {
      return this.target.setAttribute("cx", value);
    }
  }, {
    key: "Y",
    get: function get() {
      return this.target.getAttribute("cy");
    },
    set: function set(value) {
      return this.target.setAttribute("cy", value);
    }
  }]);

  return ParticleNode;
}();
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// How do x and pivotX interface?
// Set default values to SvgNode and PuppetNode
// Make interactive particle class
// Make animated particle without TweenMax

var OrbitingParticle = function (_ParticleNode) {
  _inherits(OrbitingParticle, _ParticleNode);

  function OrbitingParticle(userSettings) {
    _classCallCheck(this, OrbitingParticle);

    return _possibleConstructorReturn(this, (OrbitingParticle.__proto__ || Object.getPrototypeOf(OrbitingParticle)).call(this, userSettings));
  }

  _createClass(OrbitingParticle, [{
    key: "applySettings",
    value: function applySettings() {
      _get(OrbitingParticle.prototype.__proto__ || Object.getPrototypeOf(OrbitingParticle.prototype), "applySettings", this).call(this);
      this.Orbit = this.settings.orbit;
      this.Acceleration = this.settings.acceleration;
      this.Speed = this.settings.speed;
      this.PivotX = this.settings.pivotX;
      this.PivotY = this.settings.pivotY;
      this.Factor = this.settings.factor;
      this.Sin = this.settings.sin;
      this.Cos = this.settings.cos;
    }
  }, {
    key: "newWaveSeed",
    value: function newWaveSeed() {
      return random(0, 2 * Math.PI);
    }
  }, {
    key: "animate",
    value: function animate() {
      var _this = this;
      this.killAnimation();

      this.animating = true;

      this.Sin = this.newWaveSeed();
      this.Cos = this.newWaveSeed();

      TweenMax.to(this.target, 1, { x: 1, y: 1, scaleX: 1, scaleY: 1, transformOrigin: "center", repeat: -1, modifiers: {
          x: function x(_x, target) {
            return _this.getNextVal(target, "x");
          },
          y: function y(_y, target) {
            return _this.getNextVal(target, "y");
          },
          scaleX: function scaleX() {
            return Math.cos(_this.cos);
          },
          scaleY: function scaleY() {
            return Math.cos(_this.cos);
          }
        } });
    }
  }, {
    key: "killAnimation",
    value: function killAnimation() {
      if (this.animating) {
        var element = this.target;
        TweenMax.killChildTweensOf(element);
        this.animating = false;
      }
    }
  }, {
    key: "getNextVal",
    value: function getNextVal(target, attr) {
      var orbit = this.orbit * this.factor;
      var acc = this.acceleration;
      var current, wave, pivot;

      if (attr === "x") {
        current = target._gsTransform.x;
        wave = this.sin;
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
  }, {
    key: "Settings",
    get: function get() {
      return this.settings;
    },
    set: function set(userSettings) {
      if ((typeof userSettings === "undefined" ? "undefined" : _typeof(userSettings)) !== "object") {
        console.warn("Wonky! Particle settings is not an object. Correct format: { key: val, ... }");
      }
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
  }, {
    key: "Orbit",
    get: function get() {
      return this.orbit;
    },
    set: function set(value) {
      this.orbit = value;
    }
  }, {
    key: "Sin",
    get: function get() {
      return this.sin;
    },
    set: function set(value) {
      this.sin = value;
    }
  }, {
    key: "Cos",
    get: function get() {
      return this.cos;
    },
    set: function set(value) {
      this.cos = value;
    }
  }, {
    key: "Acceleration",
    get: function get() {
      return this.acceleration;
    },
    set: function set(value) {
      this.acceleration = value;
    }
  }, {
    key: "Speed",
    get: function get() {
      return this.speed;
    },
    set: function set(value) {
      this.speed = value;
    }
  }, {
    key: "PivotX",
    get: function get() {},
    set: function set(value) {
      this.pivotX = value;
    }
  }, {
    key: "PivotY",
    get: function get() {},
    set: function set(value) {
      this.pivotY = value;
    }
  }, {
    key: "Factor",
    get: function get() {
      return this.factor;
    },
    set: function set(value) {
      this.factor = value;
    }
  }]);

  return OrbitingParticle;
}(ParticleNode);
"use strict";

// @codekit-prepend '../assets/nerdmanship/js/utility'
// @codekit-prepend '../assets/nerdmanship/js/SvgNode'
// @codekit-prepend '../assets/nerdmanship/js/PuppetSvg'
// @codekit-prepend '../assets/nerdmanship/js/ParticleNode'
// @codekit-prepend '../assets/nerdmanship/js/OrbitingParticle'


var svg = new PuppetSvg("#box");
// give default styles
svg.appendTo(document.body);
svg.Style = "position, absolute";
svg.Style = "background-color, black";
svg.syncPuppet();

var count = 200;
var ps = [];

for (var i = 0; i < count; i++) {
  var p = new OrbitingParticle({ radius: random(5, 20), x: random(0, 300), y: random(0, 200) });
  ps.push(p);
  p.appendTo(svg.target);
  p.animate();
}
