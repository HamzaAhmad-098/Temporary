/**
 * splash.js — controls when the intro splash leaves.
 *
 * The animation itself is pure CSS (splash.css) and starts as soon as the page
 * is parsed. This script only decides when to dismiss it:
 *   - at least MIN_TIME has passed, so the logo animation can finish, and
 *   - the page is fully loaded, so nothing pops in behind the shutter.
 * Click, tap or any key skips ahead once the page is ready.
 */
(function () {
  'use strict';

  var splash = document.getElementById('ddSplash');
  if (!splash) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MIN_TIME = reduceMotion ? 1100 : 3800;
  var MAX_TIME = 12000; // never trap the visitor behind the splash
  var startedAt = performance.now();

  var page = document.getElementById('page');
  var bar = splash.querySelector('[data-splash-bar]');
  var num = splash.querySelector('[data-splash-num]');
  var label = splash.querySelector('[data-splash-label]');

  var shown = 0;
  var leaving = false;
  var skipRequested = false;
  var fontsReady = false;

  // Keep keyboard focus out of the page while the splash is up.
  if (page) page.inert = true;

  try {
    document.fonts.ready.then(function () { fontsReady = true; });
    window.setTimeout(function () { fontsReady = true; }, 2000);
  } catch (e) {
    fontsReady = true;
  }

  function pageReady() {
    if (document.readyState !== 'complete' || !fontsReady) return false;
    var hero = document.querySelector('.showcase__slide.is-active img');
    return !hero || hero.complete;
  }

  function paintProgress() {
    var p = Math.max(0, Math.min(1, shown));
    if (bar) bar.style.transform = 'scaleX(' + p + ')';
    if (num) num.textContent = ('00' + Math.round(p * 100)).slice(-3);
  }

  function leave() {
    if (leaving) return;
    leaving = true;

    shown = 1;
    paintProgress();
    if (label) label.textContent = 'Ready';

    try { sessionStorage.setItem('dd-splash', '1'); } catch (e) { /* private mode */ }

    splash.classList.add('is-leaving');
    window.setTimeout(function () { splash.classList.add('is-lift'); }, reduceMotion ? 0 : 420);

    function finish() {
      if (splash.classList.contains('is-gone')) return;
      splash.classList.add('is-gone');
      document.documentElement.classList.remove('is-splashing');
      if (page) page.inert = false;
      window.setTimeout(function () { splash.remove(); }, 50);
    }

    splash.addEventListener('transitionend', function (event) {
      if (event.target === splash && event.propertyName === 'transform') finish();
    });
    window.setTimeout(finish, reduceMotion ? 900 : 1900); // fallback if no transition fires
  }

  function tick(now) {
    if (leaving) return;

    var elapsed = now - startedAt;
    var ready = pageReady();

    // Ease towards 100%, but hold at 94% until the page is actually ready.
    var target = 1 - Math.pow(1 - Math.min(1, elapsed / MIN_TIME), 1.5);
    if (!ready) target = Math.min(target, 0.94);
    shown += (target - shown) * 0.16;
    paintProgress();

    var done = ready && elapsed >= MIN_TIME && shown > 0.985;
    var skipped = ready && skipRequested && elapsed > 700;
    if (done || skipped || elapsed > MAX_TIME) {
      leave();
      return;
    }
    window.requestAnimationFrame(tick);
  }

  splash.addEventListener('pointerdown', function () { skipRequested = true; });
  document.addEventListener('keydown', function () { skipRequested = true; });

  window.requestAnimationFrame(tick);
})();
