/**
 * showcase.js — the product carousel in the home page hero.
 * Auto-advances, pauses while hovered / focused / hidden, and stays still for
 * visitors who prefer reduced motion.
 */
(function () {
  'use strict';

  var root = document.querySelector('[data-showcase]');
  if (!root) return;

  var slides = Array.prototype.slice.call(root.querySelectorAll('[data-slide]'));
  var dots = Array.prototype.slice.call(root.querySelectorAll('[data-dot]'));
  var INTERVAL = 5500;
  var current = 0;
  var timer = null;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function show(index) {
    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, i) {
      var active = i === current;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
      var link = slide.querySelector('a');
      if (link) link.tabIndex = active ? 0 : -1;
    });

    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === current);
      dot.setAttribute('aria-selected', String(i === current));
    });
  }

  function start() {
    if (reduceMotion || timer) return;
    timer = window.setInterval(function () { show(current + 1); }, INTERVAL);
  }

  function stop() {
    window.clearInterval(timer);
    timer = null;
  }

  root.querySelector('[data-prev]').addEventListener('click', function () { show(current - 1); });
  root.querySelector('[data-next]').addEventListener('click', function () { show(current + 1); });
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { show(i); });
  });

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', start);
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });

  start();
})();
