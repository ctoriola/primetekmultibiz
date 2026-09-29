/* PrimeTEK Multi Biz Solutions — site behaviour */
(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");

  /* Header shadow on scroll */
  var header = document.querySelector(".site-header");
  function onScroll() { if (header) header.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  var toggle = document.querySelector(".menu-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () {
        document.body.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) {
        document.body.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* Current year */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* Reveal on scroll */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* Count-up numbers */
  var counters = document.querySelectorAll("[data-count]");
  function runCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var fmt = function (n) { return Math.round(n).toLocaleString("en-US") + suffix; };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = fmt(target); return; }
    var start = null, dur = 1400;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { runCount(e.target); co.unobserve(e.target); } });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  }

  /* Sub-navigation highlight (pillar pages) */
  var subLinks = document.querySelectorAll(".subnav a[href^='#']");
  if (subLinks.length && "IntersectionObserver" in window) {
    var map = {};
    subLinks.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          subLinks.forEach(function (a) { a.classList.remove("active"); });
          var link = map[e.target.id];
          if (link) {
            link.classList.add("active");
            link.scrollIntoView({ block: "nearest", inline: "center" });
          }
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) so.observe(s); });
  }

  /* Generic filter groups: buttons with data-filter inside [data-filter-group] toggle items with data-cat */
  document.querySelectorAll("[data-filter-group]").forEach(function (group) {
    var target = document.querySelector(group.getAttribute("data-filter-group"));
    if (!target) return;
    var items = target.querySelectorAll("[data-cat]");
    var buttons = group.querySelectorAll("[data-filter]");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var f = btn.getAttribute("data-filter");
        buttons.forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
        items.forEach(function (it) {
          var cats = it.getAttribute("data-cat").split(" ");
          it.hidden = !(f === "all" || cats.indexOf(f) !== -1);
        });
      });
    });
  });

  /* Lightbox */
  var gallery = document.querySelector("[data-lightbox]");
  if (gallery) {
    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Image viewer");
    box.innerHTML =
      '<button class="close" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '<button class="prev" aria-label="Previous image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button>' +
      '<img alt="">' +
      '<button class="next" aria-label="Next image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg></button>' +
      '<p class="cap"></p>';
    document.body.appendChild(box);
    var bImg = box.querySelector("img"), bCap = box.querySelector(".cap");
    var figs = Array.prototype.slice.call(gallery.querySelectorAll("figure"));
    var idx = 0, lastFocus = null;
    function visible() { return figs.filter(function (f) { return !f.hidden; }); }
    function show(fig) {
      var img = fig.querySelector("img");
      bImg.src = img.getAttribute("src");
      bImg.alt = img.alt;
      var c = fig.querySelector("figcaption");
      bCap.textContent = c ? c.textContent : img.alt;
    }
    function open(fig) {
      lastFocus = document.activeElement;
      idx = visible().indexOf(fig);
      show(fig);
      box.classList.add("open");
      document.body.style.overflow = "hidden";
      box.querySelector(".close").focus();
    }
    function close() {
      box.classList.remove("open");
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    }
    function move(d) {
      var v = visible();
      idx = (idx + d + v.length) % v.length;
      show(v[idx]);
    }
    figs.forEach(function (fig) {
      fig.tabIndex = 0;
      fig.setAttribute("role", "button");
      fig.addEventListener("click", function () { open(fig); });
      fig.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(fig); } });
    });
    box.querySelector(".close").addEventListener("click", close);
    box.querySelector(".prev").addEventListener("click", function () { move(-1); });
    box.querySelector(".next").addEventListener("click", function () { move(1); });
    box.addEventListener("click", function (e) { if (e.target === box) close(); });
    document.addEventListener("keydown", function (e) {
      if (!box.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") move(-1);
      if (e.key === "ArrowRight") move(1);
    });
  }

  /* Contact form (client-side validation only; connect to a backend before launch) */
  var form = document.querySelector("[data-contact-form]");
  if (form) {
    var params = new URLSearchParams(window.location.search);
    var topic = params.get("topic");
    var sel = form.querySelector("select[name='topic']");
    if (topic && sel) {
      Array.prototype.forEach.call(sel.options, function (o) { if (o.value === topic) sel.value = topic; });
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll("[required]").forEach(function (input) {
        var field = input.closest(".field") || input.closest(".consent");
        var valid = input.type === "checkbox" ? input.checked : input.checkValidity() && input.value.trim() !== "";
        if (field) field.classList.toggle("invalid", !valid);
        if (!valid && ok) { input.focus(); ok = false; }
      });
      if (!ok) return;
      var note = form.querySelector(".form-note");
      note.classList.add("show");
      note.focus();
      form.reset();
    });
    form.querySelectorAll("input, select, textarea").forEach(function (input) {
      input.addEventListener("input", function () {
        var field = input.closest(".field");
        if (field) field.classList.remove("invalid");
      });
    });
  }
})();
