/**
 * enquiry.js — turns the contact form into a ready-written WhatsApp message
 * (or an email draft). There is no server: nothing is stored or sent until
 * the visitor presses send in their own app.
 */
(function () {
  'use strict';

  var form = document.querySelector('[data-enquiry]');
  if (!form) return;

  function compose() {
    var data = new FormData(form);
    var lines = ['Hello Dynamic Drives,'];

    lines.push('My name is ' + String(data.get('name')).trim() + '.');
    if (String(data.get('phone')).trim()) lines.push('Phone: ' + String(data.get('phone')).trim());
    if (data.get('product')) lines.push('Product of interest: ' + data.get('product'));
    if (String(data.get('message')).trim()) lines.push('', String(data.get('message')).trim());

    return lines.join('\n');
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;

    var url = 'https://wa.me/' + form.dataset.wa + '?text=' + encodeURIComponent(compose());
    window.open(url, '_blank', 'noopener');
  });

  form.querySelector('[data-send-email]').addEventListener('click', function () {
    if (!form.reportValidity()) return;

    var product = form.elements.product.value;
    var subject = 'Enquiry' + (product ? ' — ' + product : '');
    window.location.href = 'mailto:' + form.dataset.email +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(compose());
  });
})();
