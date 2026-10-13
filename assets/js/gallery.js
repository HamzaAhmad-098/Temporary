/**
 * gallery.js — thumbnail switching on the product detail page.
 */
(function () {
  'use strict';

  var gallery = document.querySelector('[data-gallery]');
  if (!gallery) return;

  var main = gallery.querySelector('[data-gallery-main]');
  var thumbs = Array.prototype.slice.call(gallery.querySelectorAll('[data-thumb]'));

  thumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      main.src = thumb.dataset.src;
      main.width = thumb.dataset.w;
      main.height = thumb.dataset.h;
      main.alt = thumb.dataset.alt;

      thumbs.forEach(function (other) {
        var on = other === thumb;
        other.classList.toggle('is-active', on);
        other.setAttribute('aria-pressed', String(on));
      });
    });
  });
})();
