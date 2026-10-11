/* Dream Destinations - shared page actions (tabs, contact submit options, newsletter subscribe, anchor landing) */
(function () {
  "use strict";
  var EMAIL = "Info@dreamsdestinations.co.uk";
  var WHATSAPP = "447878767020";

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  /* ---------- 1. Apply page: Schengen Countries / Australia tabs ---------- */
  function initTabs() {
    var groups = document.querySelectorAll(".e-tabs-base");
    Array.prototype.forEach.call(groups, function (group) {
      var tabs = group.querySelectorAll('[role="tab"]');
      function activate(tab) {
        Array.prototype.forEach.call(tabs, function (t) {
          var on = t === tab;
          t.setAttribute("aria-selected", on ? "true" : "false");
          t.setAttribute("tabindex", on ? "0" : "-1");
          t.classList.toggle("e--selected", on);
          var panel = document.getElementById(t.getAttribute("aria-controls"));
          if (!panel) return;
          panel.classList.toggle("e--selected", on);
          if (on) {
            panel.removeAttribute("hidden");
            panel.style.display = "";
          } else {
            panel.setAttribute("hidden", "true");
            panel.style.display = "none";
          }
        });
      }
      Array.prototype.forEach.call(tabs, function (tab) {
        tab.addEventListener("click", function (e) {
          e.preventDefault();
          activate(tab);
        });
      });
    });
  }

  /* ---------- 2. Contact page: Submit Request -> email / WhatsApp choice ---------- */
  function initContactSubmit() {
    var marker = document.querySelector('input[name="referer_title"][value="Contact"]');
    var form = marker ? marker.form : document.querySelector("#get-in-touch form.elementor-form"); /* contact page form, or the home page Get In Touch form */
    if (!form) return;

    var overlay = document.createElement("div");
    overlay.className = "dd-modal-overlay";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML =
      '<div class="dd-modal" role="dialog" aria-modal="true" aria-labelledby="dd-modal-title">' +
      '<button type="button" class="dd-modal-close" aria-label="Close">&times;</button>' +
      '<h3 id="dd-modal-title">Send your request</h3>' +
      "<p>How would you like to send your request to us?</p>" +
      '<div class="dd-modal-actions">' +
      '<a class="dd-opt dd-opt-email" href="#" target="_blank" rel="noopener"><i class="fa-solid fa-envelope" aria-hidden="true"></i> By Email</a>' +
      '<a class="dd-opt dd-opt-wa" href="#" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> By WhatsApp</a>' +
      "</div></div>";
    document.body.appendChild(overlay);

    var emailBtn = overlay.querySelector(".dd-opt-email");
    var waBtn = overlay.querySelector(".dd-opt-wa");

    function close() {
      overlay.classList.remove("dd-open");
      overlay.setAttribute("aria-hidden", "true");
    }
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay || e.target.closest(".dd-modal-close")) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
    emailBtn.addEventListener("click", function () { setTimeout(close, 300); });
    waBtn.addEventListener("click", function () { setTimeout(close, 300); });

    function val(sel) {
      var el = form.querySelector(sel);
      return el ? (el.value || "").trim() : "";
    }

    form.addEventListener(
      "submit",
      function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (typeof form.reportValidity === "function" && !form.reportValidity()) return;

        var name = val("#form-field-name");
        var email = val("#form-field-email");
        var phone = val("#form-field-field_2ed1b5e");
        var visa = val("#form-field-message");
        var msg = val("#form-field-field_f79b7f8");
        if (visa === "Select Visa Type") visa = "";

        var lines = ["Hello Dreams Destinations,", "", "I would like to make a visa enquiry.", ""];
        if (name) lines.push("Name: " + name);
        if (email) lines.push("Email: " + email);
        if (phone) lines.push("Phone: " + phone);
        if (visa) lines.push("Visa Type: " + visa);
        if (msg) lines.push("Message: " + msg);
        var body = lines.join("\n");

        emailBtn.href =
          "mailto:" + EMAIL +
          "?subject=" + encodeURIComponent("Visa Enquiry" + (name ? " from " + name : "")) +
          "&body=" + encodeURIComponent(body);
        waBtn.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(body);

        overlay.classList.add("dd-open");
        overlay.setAttribute("aria-hidden", "false");
        emailBtn.focus();
      },
      true
    );
  }

  /* ---------- 3. Newsletter subscribe (footer, every page) ---------- */
  function initSubscribe() {
    var forms = document.querySelectorAll("form.jkit-mailchimp-form");
    Array.prototype.forEach.call(forms, function (form) {
      var box = form.querySelector(".jkit-mailchimp-message");
      function show(text, ok) {
        if (!box) return;
        box.textContent = text;
        box.className = "jkit-mailchimp-message dd-sub-msg " + (ok ? "dd-sub-ok" : "dd-sub-err");
      }
      form.addEventListener(
        "submit",
        function (e) {
          e.preventDefault();
          e.stopImmediatePropagation();
          var first = ((form.querySelector('[name="first-name"]') || {}).value || "").trim();
          var last = ((form.querySelector('[name="last-name"]') || {}).value || "").trim();
          var email = ((form.querySelector('[name="email"]') || {}).value || "").trim();
          if (!first || !last) { show("Please enter your first and last name.", false); return; }
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { show("Please enter a valid email address.", false); return; }

          var body =
            "Hello Dreams Destinations,\n\nPlease add me to your newsletter.\n\n" +
            "Name: " + first + " " + last + "\nEmail: " + email;
          var a = document.createElement("a");
          a.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent("Newsletter Subscription") + "&body=" + encodeURIComponent(body);
          a.style.display = "none";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

          show("Thank you for subscribing! Please send the email that opened to confirm your subscription.", true);
          form.reset();
        },
        true
      );
    });
  }

  /* ---------- 4. Landing on a #section from another page ---------- */
  function initHashLanding() {
    if (!location.hash || location.hash.length < 2) return;
    var id = decodeURIComponent(location.hash.slice(1));
    window.addEventListener("load", function () {
      setTimeout(function () {
        var el = document.getElementById(id);
        if (el) el.scrollIntoView({ block: "start" });
      }, 150);
    });
  }

  ready(function () {
    initTabs();
    initContactSubmit();
    initSubscribe();
    initHashLanding();
  });
})();
