var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var enter = document.getElementById("enter");
var fill = document.getElementById("fill");
var pct = document.getElementById("pct");
var next = enter.getAttribute("href");  
var leaving = false;
 
var START = calm ? 0 : 2600;     
var DURATION = calm ? 800 : 2800;
 
function go() {
  if (leaving) return;
  leaving = true;
  if (calm) { window.location.href = next; return; }
  document.body.classList.add("leave"); 
  setTimeout(function () { window.location.href = next; }, 900);
}
 
enter.addEventListener("click", function (e) {
  e.preventDefault();
  go();
});

setTimeout(function () {
  var t0 = performance.now();
  (function tick(now) {
    var p = Math.min(1, (now - t0) / DURATION);
    var eased = 1 - Math.pow(1 - p, 2);    
    var v = Math.round(eased * 100);
    fill.style.width = v + "%";
    pct.textContent = v + "%";
    if (p < 1) { requestAnimationFrame(tick); }
    else { setTimeout(go, 500); }              
  })(t0);
}, START);