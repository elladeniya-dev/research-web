// OutfitIQ — R26-IT-052 project website

(function () {
  // Header: add a border once the page scrolls
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Mobile nav
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    var setOpen = function (open) {
      links.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    toggle.addEventListener("click", function () { setOpen(!links.classList.contains("open")); });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("open")) { setOpen(false); toggle.focus(); }
    });
  }

  // Scroll reveal
  var revealEls = document.querySelectorAll(".reveal, .reveal-stagger");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (revealEls.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("in"); });
    } else {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
      revealEls.forEach(function (el) { revealObserver.observe(el); });
    }
  }

  // Domain page: highlight the section currently in view
  var tocLinks = document.querySelectorAll(".toc a");
  if (tocLinks.length && "IntersectionObserver" in window) {
    var byId = {};
    tocLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        tocLinks.forEach(function (a) { a.classList.remove("active"); });
        var link = byId[entry.target.id];
        if (link) link.classList.add("active");
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  // Milestones page: drop-down picks which assessment is shown
  var select = document.getElementById("milestone-select");
  if (select) {
    var panels = document.querySelectorAll(".milestone-panel");
    var timelineButtons = document.querySelectorAll("[data-milestone]");
    var show = function (id) {
      panels.forEach(function (p) { p.hidden = p.id !== id; });
      timelineButtons.forEach(function (btn) {
        var current = btn.getAttribute("data-milestone") === id;
        btn.parentNode.classList.toggle("current", current);
        if (current) btn.setAttribute("aria-current", "step"); else btn.removeAttribute("aria-current");
      });
      select.value = id;
      if (history.replaceState) history.replaceState(null, "", "#" + id);
    };
    select.addEventListener("change", function () { show(select.value); });
    timelineButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        show(btn.getAttribute("data-milestone"));
        select.focus();
      });
    });
    var fromHash = location.hash.slice(1);
    show(document.getElementById(fromHash) ? fromHash : select.value);

    // Progress summary in the page header
    var items = document.querySelectorAll(".timeline li");
    var done = document.querySelectorAll(".timeline li.done").length;
    var countEl = document.getElementById("ms-count");
    var barEl = document.getElementById("ms-bar");
    if (countEl) countEl.textContent = done + " of " + items.length;
    if (barEl && items.length) barEl.style.width = Math.round((done / items.length) * 100) + "%";
  }

  // Contact page: build a pre-filled email in the visitor's mail app
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var to = form.getAttribute("data-to");
      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      var subject = form.elements.subject.value.trim() || "Enquiry about OutfitIQ (R26-IT-052)";
      var message = form.elements.message.value.trim();
      var body = "Dear OutfitIQ Research Team,\n\n" + message +
        "\n\nKind regards,\n" + name + (email ? "\n" + email : "");
      location.href = "mailto:" + to +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
    });
  }
})();
