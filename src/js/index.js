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
  var p = new OrbitingParticle( { radius: random(5, 20), x: random(0, 300), y: random(0, 200) } );
  ps.push(p);
  p.appendTo(svg.target);
  p.animate();
} 
