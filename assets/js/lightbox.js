/**
 * lightbox.js — opens authorisation documents full size.
 * Any button with data-lightbox="<image url>" opens the viewer.
 */
(function () {
  'use strict';

  var root = document.querySelector('[data-lightbox-root]');
  if (!root) return;

  var image = document.createElement('img');
  image.className = 'lightbox__img';
  var closeButton = root.querySelector('[data-lightbox-close]');
  var opener = null;

  function open(trigger) {
    opener = trigger;
    image.src = trigger.dataset.lightbox;
    image.alt = trigger.dataset.lightboxAlt || '';
    root.appendChild(image);
    root.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    closeButton.focus();
  }

  function close() {
    root.hidden = true;
    image.remove();
    document.documentElement.style.overflow = '';
    if (opener) opener.focus();
  }

  document.querySelectorAll('[data-lightbox]').forEach(function (trigger) {
    trigger.addEventListener('click', function () { open(trigger); });
  });

  closeButton.addEventListener('click', close);

  // Clicking the dark backdrop (not the document itself) closes the viewer.
  root.addEventListener('click', function (event) {
    if (event.target === root) close();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !root.hidden) close();
  });
})();
