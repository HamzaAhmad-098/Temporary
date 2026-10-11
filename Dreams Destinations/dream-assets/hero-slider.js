/* Hero background slideshow: crossfades the 7 hero pictures every 5 seconds.
   Used on Home, Services, About, Apply, Privacy Policy and Refund pages. */
(function () {
  var script = document.currentScript;
  var base = script && script.src ? script.src.replace(/[^\/]*$/, '') + 'hero/' : 'dream-assets/hero/';
  var IMAGES = [1, 2, 3, 4, 5, 6, 7].map(function (n) { return base + 'hero-' + n + '.jpeg'; });
  var INTERVAL = 5000;
  var SELECTORS = ['.elementor-element-afacbc0', '.elementor-element-03e0a92', '.elementor-element-e925a09',
                   '.visa-hero', '.elementor-element-3d094e1', '.elementor-element-1acb0d40'];

  var css = '.dh-slides,.dh-shade{position:absolute;top:0;right:0;bottom:0;left:0;z-index:-1;pointer-events:none}' +
    '.dh-slide{filter:brightness(1.06) contrast(1.08) saturate(1.15);position:absolute;top:0;right:0;bottom:0;left:0;background-size:cover;background-position:center;background-repeat:no-repeat;opacity:0;transition:opacity 1s ease-in-out}' +
    '.dh-slide.dh-on{opacity:1}' +
    '.dh-ts{text-shadow:0 2px 10px rgba(0,0,0,.6),0 0 2px rgba(0,0,0,.35)}' +
    '.dh-shade{background:linear-gradient(135deg,rgba(45,49,52,.32) 0%,rgba(45,49,52,.24) 100%)}';

  function init() {
    var hero = null, i;
    for (i = 0; i < SELECTORS.length && !hero; i++) hero = document.querySelector(SELECTORS[i]);
    if (!hero) return;

    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);

    if (getComputedStyle(hero).position === 'static') hero.style.position = 'relative';
    hero.style.isolation = 'isolate';

    var wrap = document.createElement('div');
    wrap.className = 'dh-slides';
    wrap.setAttribute('aria-hidden', 'true');
    var slides = IMAGES.map(function (src) {
      var d = document.createElement('div');
      d.className = 'dh-slide';
      d.style.backgroundImage = 'url("' + src + '")';
      wrap.appendChild(d);
      return d;
    });
    hero.insertBefore(wrap, hero.firstChild);

    /* Keep text readable: add a dark shade unless the hero already has its own overlay (Elementor ::before) */
    var pb = getComputedStyle(hero, '::before').backgroundColor;
    var hasOverlay = pb && pb !== 'rgba(0, 0, 0, 0)' && pb !== 'transparent';
    if (!hasOverlay) {
      var shade = document.createElement('div');
      shade.className = 'dh-shade';
      shade.setAttribute('aria-hidden', 'true');
      hero.insertBefore(shade, wrap.nextSibling);
    }

    /* Light text on the hero gets a soft shadow so it stays readable over the brighter pictures */
    var tx = hero.querySelectorAll('h1,h2,h3,p,span');
    for (i = 0; i < tx.length; i++) {
      var m = getComputedStyle(tx[i]).color.match(/\d+/g);
      if (m && +m[0] > 200 && +m[1] > 200 && +m[2] > 200) tx[i].classList.add('dh-ts');
    }

    var cur = 0;
    var first = new Image();
    first.onload = first.onerror = function () {
      slides[0].classList.add('dh-on');
      IMAGES.slice(1).forEach(function (s) { new Image().src = s; });
      setInterval(function () {
        slides[cur].classList.remove('dh-on');
        cur = (cur + 1) % slides.length;
        slides[cur].classList.add('dh-on');
      }, INTERVAL);
    };
    first.src = IMAGES[0];
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
