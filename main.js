(function () {
  "use strict";
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Theme toggle ---------- */
  var icon = document.getElementById("themeIcon");
  function paintIcon() { icon.textContent = root.classList.contains("dark") ? "☾" : "☀"; }
  paintIcon();
  document.getElementById("themeToggle").addEventListener("click", function () {
    var dark = root.classList.toggle("dark");
    try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (e) {}
    paintIcon();
  });

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById("menuBtn");
  var menu = document.getElementById("mobileMenu");
  function setMenu(open) {
    menu.classList.toggle("hidden", !open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.textContent = open ? "✕" : "☰";
  }
  menuBtn.addEventListener("click", function () { setMenu(menu.classList.contains("hidden")); });
  menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });

  /* ---------- Navbar background on scroll ---------- */
  var nav = document.getElementById("nav");
  function onScroll() { nav.classList.toggle("scrolled", window.scrollY > 16); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + "ms";
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Active nav link ---------- */
  var links = document.querySelectorAll("nav .nav-link");
  var sections = Array.prototype.slice.call(links).map(function (l) {
    return document.querySelector(l.getAttribute("href"));
  });
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          links.forEach(function (l) {
            l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { if (s) spy.observe(s); });
  }

  /* ---------- Terminal typing ---------- */
  var term = document.getElementById("termLines");
  var lines = [
    ["server_status", "online", "text-emerald-400"],
    ["network", "stable", "text-emerald-400"],
    ["support_desk", "responding", "text-emerald-400"]
  ];
  function lineHTML(l) {
    return '<div><span class="text-slate-500">&gt;</span> ' + l[0] +
      ': <span class="' + l[2] + '">● ' + l[1] + "</span></div>";
  }
  var readyHTML = '<div><span class="text-slate-500">&gt;</span> <span class="text-teal-300">ready_to_help_</span><span class="cursor"></span></div>';
  if (reduce) {
    term.innerHTML = lines.map(lineHTML).join("") + readyHTML;
  } else {
    var idx = 0;
    (function next() {
      if (idx < lines.length) {
        term.insertAdjacentHTML("beforeend", lineHTML(lines[idx++]));
        setTimeout(next, 650);
      } else {
        term.insertAdjacentHTML("beforeend", readyHTML);
      }
    })();
  }

  /* ---------- Count-up stat ---------- */
  document.querySelectorAll("[data-count]").forEach(function (el) {
    var target = parseInt(el.dataset.count, 10);
    if (reduce || !("IntersectionObserver" in window)) return;
    el.textContent = "0";
    var o = new IntersectionObserver(function (en) {
      if (!en[0].isIntersecting) return;
      o.disconnect();
      var n = 0;
      var t = setInterval(function () {
        n++; el.textContent = n;
        if (n >= target) clearInterval(t);
      }, 160);
    });
    o.observe(el);
  });

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
