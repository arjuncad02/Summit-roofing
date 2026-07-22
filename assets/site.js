/* Vector Studio — shared site utilities (bulletproof, dependency-free) */
(function () {
  'use strict';

  /* ---- bulletproof images: hide any <img data-ph> that fails ---- */
  function wireImages() {
    document.querySelectorAll('img[data-ph]').forEach(function (img) {
      var fig = img.closest('.ph') || img.parentElement;
      function fail() { if (fig) fig.classList.add('img-failed'); }
      if (img.complete && img.naturalWidth === 0) fail();
      img.addEventListener('error', fail);
    });
    /* CSS background heroes: probe the URL, drop a class if it 404s so the
       gradient underneath is all that shows (no empty photo layer). */
    document.querySelectorAll('[data-bg]').forEach(function (el) {
      var url = el.getAttribute('data-bg');
      var test = new Image();
      test.onload = function () { el.style.setProperty('--bg-img', "url('" + url + "')"); };
      test.onerror = function () { el.classList.add('bg-failed'); };
      test.src = url;
    });
  }

  /* ---- reveal on scroll ---- */
  function wireReveals() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
    setTimeout(function () { document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); }); }, 6000);
  }

  /* ---- animated counters ---- */
  function runCount(el) {
    if (el.dataset.done) return; el.dataset.done = '1';
    var to = parseFloat(el.dataset.to), dec = to % 1 !== 0, t0 = performance.now(), dur = 1600;
    (function s(t) {
      var p = Math.min((t - t0) / dur, 1), v = to * (1 - Math.pow(1 - p, 3));
      el.textContent = dec ? v.toFixed(1) : Math.round(v).toLocaleString();
      if (p < 1) requestAnimationFrame(s);
    })(t0);
  }
  function wireCounters() {
    var els = document.querySelectorAll('.count');
    if (!('IntersectionObserver' in window)) { els.forEach(runCount); return; }
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { co.unobserve(e.target); runCount(e.target); } });
    }, { threshold: 0.5 });
    els.forEach(function (el) { co.observe(el); });
    setTimeout(function () { els.forEach(runCount); }, 6000);
  }

  /* ---- nav solidify + scroll progress ---- */
  function wireScroll() {
    var nav = document.getElementById('nav'), prog = document.getElementById('prog');
    window.addEventListener('scroll', function () {
      if (nav) nav.classList.toggle('solid', window.scrollY > 40);
      if (prog) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        prog.style.width = (window.scrollY / (h || 1) * 100) + '%';
      }
    }, { passive: true });
  }

  /* ---- loader ---- */
  function wireLoader() {
    var l = document.getElementById('loader'); if (!l) return;
    window.addEventListener('load', function () { setTimeout(function () { l.classList.add('done'); }, 1400); });
    setTimeout(function () { l.classList.add('done'); }, 3400); /* safety */
  }

  /* ---- Three.js loader with graceful failure ---- */
  window.loadThree = function (cb) {
    if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    if (window.THREE) { cb(); return; }
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    s.onload = function () { try { cb(); } catch (e) { /* scene optional */ } };
    s.onerror = function () { /* site is complete without 3D */ };
    document.head.appendChild(s);
  };

  function init() { wireImages(); wireReveals(); wireCounters(); wireScroll(); wireLoader(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
