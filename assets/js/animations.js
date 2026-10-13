/**
 * animations.js
 * - Scroll-reveal via IntersectionObserver
 * - Count-up for stats bar
 * - Marquee ticker duplication
 */
(function () {
  'use strict';

  /* ---- 1. Scroll-reveal ------------------------------------------------ */
  var revealEls = document.querySelectorAll('.reveal, .reveal-group');
  var qualitySteps = document.querySelector('.quality__steps');

  if (revealEls.length || qualitySteps) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

    revealEls.forEach(function (el) { revealObs.observe(el); });

    if (qualitySteps) {
      var stepsObs = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          entries[0].target.classList.add('is-visible');
          stepsObs.unobserve(entries[0].target);
        }
      }, { threshold: 0.15 });
      stepsObs.observe(qualitySteps);
    }
  }

  /* ---- 2. Count-up for stats bar --------------------------------------- */
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function countUp(el, target, duration) {
    var start = performance.now();
    function step(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.round(easeOut(progress) * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var statsBar = document.querySelector('.stats-bar');
  if (statsBar) {
    var counters = statsBar.querySelectorAll('[data-count]');
    var hasRun = false;

    var statsObs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !hasRun) {
        hasRun = true;
        counters.forEach(function (el) {
          countUp(el, parseInt(el.getAttribute('data-count'), 10), 2000);
        });
        statsObs.disconnect();
      }
    }, { threshold: 0.3 });
    statsObs.observe(statsBar);
  }

  /* ---- 3. Duplicate ticker content so marquee loops seamlessly --------- */
  document.querySelectorAll('.ticker-track').forEach(function (track) {
    var items = track.innerHTML;
    track.innerHTML = items + items; // duplicate for seamless loop
  });

})();
