/**
 * main.js — behaviour shared by every page: the mobile navigation.
 */
(function () {
  'use strict';

  var toggle = document.querySelector('[data-nav-toggle]');
  var nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  }

  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  // Close on Escape, after choosing a link, or when the layout switches to desktop.
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') setOpen(false);
  });

  nav.addEventListener('click', function (event) {
    if (event.target.closest('a')) setOpen(false);
  });

  window.matchMedia('(min-width: 901px)').addEventListener('change', function (query) {
    if (query.matches) setOpen(false);
  });
})();
