/**
 * catalogue.js — family filter chips and live search on the products page.
 * The cards are plain HTML, so the page works without this script; it only
 * hides and shows them. The family is kept in the URL hash (#sensors).
 */
(function () {
  'use strict';

  var root = document.querySelector('[data-catalogue]');
  if (!root) return;

  var cards = Array.prototype.slice.call(root.querySelectorAll('[data-product]'));
  var chips = Array.prototype.slice.call(root.querySelectorAll('[data-filter]'));
  var input = root.querySelector('[data-search]');
  var status = root.querySelector('[data-status]');
  var empty = root.querySelector('[data-empty]');
  var grid = root.querySelector('[data-grid]');

  var family = 'all';
  var query = '';

  function familyName(slug) {
    var chip = chips.filter(function (c) { return c.dataset.filter === slug; })[0];
    return chip ? chip.firstChild.textContent.trim() : '';
  }

  function apply() {
    var shown = 0;

    cards.forEach(function (card) {
      var inFamily = family === 'all' || card.dataset.category === family;
      var matches = !query || card.dataset.search.indexOf(query) !== -1;
      var visible = inFamily && matches;
      card.hidden = !visible;
      if (visible) shown += 1;
    });

    chips.forEach(function (chip) {
      var on = chip.dataset.filter === family;
      chip.classList.toggle('is-active', on);
      chip.setAttribute('aria-pressed', String(on));
    });

    var scope = family === 'all' ? 'product lines' : familyName(family);
    status.textContent = 'Showing ' + shown + ' of ' + cards.length + ' · ' + scope +
      (query ? ' matching “' + input.value.trim() + '”' : '');
    empty.hidden = shown !== 0;
    grid.hidden = shown === 0;
  }

  function setFamily(slug, updateHash) {
    family = slug;
    if (updateHash) {
      history.replaceState(null, '', slug === 'all' ? location.pathname : '#' + slug);
    }
    apply();
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () { setFamily(chip.dataset.filter, true); });
  });

  input.addEventListener('input', function () {
    query = input.value.trim().toLowerCase();
    apply();
  });

  function fromHash() {
    var slug = location.hash.replace('#', '');
    var known = chips.some(function (c) { return c.dataset.filter === slug; });
    setFamily(known ? slug : 'all', false);
  }

  window.addEventListener('hashchange', fromHash);
  fromHash();
})();
