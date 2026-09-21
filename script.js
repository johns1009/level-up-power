(function () {
  "use strict";

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");
  var mobileQuery = window.matchMedia("(max-width: 760px)");

  function setMenu(open) {
    if (!nav || !toggle || !menu) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.inert = mobileQuery.matches && !open;
    document.body.classList.toggle("menu-open", mobileQuery.matches && open);
  }

  if (nav && toggle && menu) {
    setMenu(false);

    toggle.addEventListener("click", function () {
      setMenu(!nav.classList.contains("is-open"));
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setMenu(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", function (event) {
      if (nav.classList.contains("is-open") && !nav.contains(event.target)) setMenu(false);
    });

    mobileQuery.addEventListener("change", function () { setMenu(false); });
  }

  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (event) {
      var name = document.getElementById("name").value.trim();
      var company = document.getElementById("company").value.trim();
      var email = document.getElementById("email").value.trim();
      var message = document.getElementById("message").value.trim();
      var body = [
        "Name: " + name,
        "Company: " + (company || "Not provided"),
        "Email: " + email,
        "",
        message
      ].join("\n");

      event.preventDefault();
      var status = document.getElementById("form-status");
      if (status) status.textContent = "Opening your email app with a draft to info@leveluppower.biz.";
      window.location.href = "mailto:info@leveluppower.biz?subject=" +
        encodeURIComponent("Level Up Power inquiry") + "&body=" + encodeURIComponent(body);
    });
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealTargets = document.querySelectorAll(
    ".value-card, .layer-card, .industry-card, .partnership-note, .journey-diagram, .contact-form"
  );

  if ("IntersectionObserver" in window && !reduceMotion) {
    revealTargets.forEach(function (el) { el.classList.add("reveal"); });
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -32px 0px" });
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  }

  var sectionLinks = Array.from(document.querySelectorAll('.nav-menu a[href^="#"]'))
    .filter(function (link) { return link.getAttribute("href") !== "#top" && !link.classList.contains("nav-cta"); });
  var sections = sectionLinks.map(function (link) {
    return document.querySelector(link.getAttribute("href"));
  }).filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach(function (link) { link.removeAttribute("aria-current"); });
        var active = sectionLinks.find(function (link) {
          return link.getAttribute("href") === "#" + entry.target.id;
        });
        if (active) active.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
    sections.forEach(function (section) { sectionObserver.observe(section); });
  }
})();


  // One-line diagram: animate current along conductors into PDUs
  (function animateOneLine() {
    if (reduceMotion) return;
    var pulses = document.querySelectorAll(".sld-pulse");
    if (!pulses.length) return;
    var start = null;
    var durs = [2600, 3000, 2200];
    var delays = [0, 300, 600];
    function frame(ts) {
      if (start == null) start = ts;
      var t = ts - start;
      pulses.forEach(function (el, i) {
        var dur = durs[i] || 2400;
        var delay = delays[i] || 0;
        var local = ((t - delay) % dur + dur) % dur;
        var offset = -(local / dur) * 100;
        el.style.strokeDasharray = "10 90";
        el.style.strokeDashoffset = String(offset);
      });
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();
