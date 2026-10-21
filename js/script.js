var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 
var bar = document.createElement("div");
bar.id = "progress";
document.body.appendChild(bar);
window.addEventListener("scroll", function () {
  var max = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
});
 
var role = document.getElementById("typing");
if (role) {
  var words = role.dataset.words.split("|");
  var w = 0, c = 0, deleting = false;
  var text = document.createElement("span");
  var cursor = document.createElement("span");
  cursor.className = "cursor";
  role.textContent = "";
  role.appendChild(text);
  role.appendChild(cursor);
  (function type() {
    var word = words[w];
    if (calm) { text.textContent = word; return; }
    c += deleting ? -1 : 1;
    text.textContent = word.slice(0, c);
    var delay = deleting ? 40 : 90;
    if (!deleting && c === word.length) { deleting = true; delay = 1600; }
    else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 400; }
    setTimeout(type, delay);
  })();
}

var search = document.getElementById("search");
if (search) {
  var blocks = document.querySelectorAll(".block");
  var empty = document.getElementById("empty");
  var status = "all";
  var apply = function () {
    var q = search.value.trim().toLowerCase();
    var shown = 0;
    blocks.forEach(function (b) {
      var ok = b.textContent.toLowerCase().indexOf(q) !== -1 &&
               (status === "all" || b.dataset.status === status);
      b.style.display = ok ? "" : "none";
      if (ok) shown++;
    });
    empty.hidden = shown !== 0;
  };
  search.addEventListener("input", apply);
  document.querySelectorAll(".filters button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      status = btn.dataset.filter;
      document.querySelectorAll(".filters button").forEach(function (x) { x.classList.remove("on"); });
      btn.classList.add("on");
      apply();
    });
  });
}

document.querySelectorAll(".stat b").forEach(function (el) {
  var target = parseInt(el.dataset.count, 10) || 0;
  if (calm) { el.textContent = target; return; }
  var n = 0, step = Math.max(1, Math.ceil(target / 30));
  var timer = setInterval(function () {
    n = Math.min(target, n + step);
    el.textContent = n;
    if (n >= target) clearInterval(timer);
  }, 40);
});

if (!calm && "IntersectionObserver" in window) {
  var io = new IntersectionObserver(function (items) {
    items.forEach(function (it) {
      if (it.isIntersecting) { it.target.classList.add("in"); io.unobserve(it.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".block, .tile, .stat, .box, .project").forEach(function (el) {
    el.classList.add("reveal");
    io.observe(el);
  });
}