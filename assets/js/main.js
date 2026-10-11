// OutfitIQ — R26-IT-052 project website

(function () {
  // Mobile nav
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
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
    var show = function (id) {
      panels.forEach(function (p) { p.hidden = p.id !== id; });
      select.value = id;
      if (history.replaceState) history.replaceState(null, "", "#" + id);
    };
    select.addEventListener("change", function () { show(select.value); });
    document.querySelectorAll("[data-milestone]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        show(btn.getAttribute("data-milestone"));
        select.focus();
      });
    });
    var fromHash = location.hash.slice(1);
    show(document.getElementById(fromHash) ? fromHash : select.value);
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
