/* WallHackJack — embers, tilt, reveals */
(function () {
  "use strict";

  document.documentElement.classList.add("js");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ── Ember particle field ─────────────────────────────── */
  var canvas = document.getElementById("embers");
  if (canvas && !reduceMotion.matches) {
    var ctx = canvas.getContext("2d");
    var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var particles = [];
    var running = true;

    function resize() {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var target = Math.min(110, Math.floor((W * H) / 14000));
      while (particles.length < target) particles.push(spawn(true));
      particles.length = Math.max(0, Math.min(particles.length, target));
    }

    function spawn(initial) {
      var arcane = Math.random() < 0.14; // occasional purple mote
      return {
        x: Math.random() * W,
        y: initial ? Math.random() * H : H + 10,
        r: 0.8 + Math.random() * 2.2,
        vy: 0.25 + Math.random() * 0.75,
        vx: (Math.random() - 0.5) * 0.3,
        drift: Math.random() * Math.PI * 2,
        driftSpeed: 0.004 + Math.random() * 0.012,
        alpha: 0.25 + Math.random() * 0.55,
        hue: arcane ? "168, 110, 235" : "232, 182, 76" // epic purple / gold, rgb
      };
    }

    function tick() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.drift += p.driftSpeed;
        p.x += p.vx + Math.sin(p.drift) * 0.35;
        p.y -= p.vy;
        var fade = p.y < H * 0.35 ? Math.max(0, p.y / (H * 0.35)) : 1;
        if (p.y < -12 || p.x < -12 || p.x > W + 12) { particles[i] = spawn(false); continue; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + p.hue + "," + (p.alpha * fade).toFixed(3) + ")";
        ctx.shadowColor = "rgba(" + p.hue + ",0.8)";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      requestAnimationFrame(tick);
    }

    resize();
    if (!particles.length) requestAnimationFrame(resize); // layout not ready yet
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", function () {
      var wasRunning = running;
      running = !document.hidden;
      if (running && !wasRunning) tick();
    });
    tick();
  }

  /* ── 3D tilt character card ───────────────────────────── */
  var card = document.getElementById("tiltCard");
  if (card && !reduceMotion.matches && window.matchMedia("(pointer: fine)").matches) {
    var wrap = card.parentElement;
    wrap.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      card.style.transform =
        "rotateY(" + ((px - 0.5) * 10).toFixed(2) + "deg) " +
        "rotateX(" + ((0.5 - py) * 8).toFixed(2) + "deg)";
      card.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
      card.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
    });
    wrap.addEventListener("pointerleave", function () {
      card.style.transform = "";
    });
  }

  /* ── Scroll reveals + stat bars ───────────────────────── */
  var revealables = [];
  document.querySelectorAll(".gear-slot, .tl-item, .feat, .char-card, .stats .stat").forEach(function (el, idx) {
    el.classList.add("reveal");
    revealables.push(el);
  });

  var stats = document.querySelectorAll(".stat");

  function fillStats() {
    stats.forEach(function (s) {
      var fill = s.querySelector(".stat-fill");
      if (fill) fill.style.setProperty("--p", (parseInt(s.getAttribute("data-fill"), 10) || 0) / 100);
    });
  }

  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    fillStats();
    return;
  }

  revealables.forEach(function (el) { el.classList.add("reveal-pending"); });

  // safety: never leave content hidden if the observer misfires
  setTimeout(function () {
    revealables.forEach(function (el) { el.classList.add("reveal-in"); });
    fillStats();
  }, 4000);

  var siblingDelay = new WeakMap();
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var parent = el.parentElement;
      var d = siblingDelay.get(parent) || 0;
      el.style.setProperty("--d", (d * 0.08).toFixed(2) + "s");
      siblingDelay.set(parent, d + 1);
      el.classList.add("reveal-in");
      if (el.classList.contains("stat") || el.classList.contains("char-card")) fillStats();
      io.unobserve(el);
    });
    entries.length && entries[0].target && requestAnimationFrame(function () {
      // reset stagger counters once a batch lands so late scrolls start fresh
      siblingDelay = new WeakMap();
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

  revealables.forEach(function (el) { io.observe(el); });
})();
