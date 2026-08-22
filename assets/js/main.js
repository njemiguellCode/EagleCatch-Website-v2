// Shared helpers + nav + dark mode toggle
(function () {
  var t = document.getElementById("navToggle");
  var n = document.getElementById("nav");
  if (t && n)
    t.addEventListener("click", function () {
      n.classList.toggle("open");
    });

  // Dark mode toggle
  var html = document.documentElement;
  var stored = localStorage.getItem("ec-theme");
  if (stored === "light") {
    html.classList.remove("dark");
  } else if (stored === "dark") {
    html.classList.add("dark");
  } else if (!stored) {
    // First visit: respect system preference, default dark
    var prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    if (prefersLight) html.classList.remove("dark");
    else html.classList.add("dark");
  }

  // SVG icon helpers
  function sunIcon() {
    var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("viewBox", "0 0 24 24");
    s.setAttribute("width", "18");
    s.setAttribute("height", "18");
    s.setAttribute("fill", "none");
    s.setAttribute("stroke", "currentColor");
    s.setAttribute("stroke-width", "2");
    s.setAttribute("stroke-linecap", "round");
    var c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c.setAttribute("cx", "12");
    c.setAttribute("cy", "12");
    c.setAttribute("r", "5");
    s.appendChild(c);
    var p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42");
    s.appendChild(p);
    return s;
  }
  function moonIcon() {
    var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("viewBox", "0 0 24 24");
    s.setAttribute("width", "18");
    s.setAttribute("height", "18");
    s.setAttribute("fill", "none");
    s.setAttribute("stroke", "currentColor");
    s.setAttribute("stroke-width", "2");
    s.setAttribute("stroke-linecap", "round");
    var p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z");
    s.appendChild(p);
    return s;
  }

  // Create toggle button and insert into nav
  var toggle = document.createElement("button");
  toggle.className = "theme-toggle";
  toggle.setAttribute("aria-label", "Toggle dark mode");
  toggle.appendChild(html.classList.contains("dark") ? sunIcon() : moonIcon());
  toggle.addEventListener("click", function () {
    var isDark = html.classList.toggle("dark");
    localStorage.setItem("ec-theme", isDark ? "dark" : "light");
    toggle.innerHTML = "";
    toggle.appendChild(isDark ? sunIcon() : moonIcon());
  });
  if (n) n.appendChild(toggle);
})();

window.EC = {
  badgeClass: function (status) {
    if (status === "Claimed") return "badge badge-claimed";
    if (status === "Found") return "badge badge-found";
    return "badge badge-lost";
  },
  formatDate: function (iso) {
    var d = new Date(iso + "T00:00:00");
    return isNaN(d)
      ? iso
      : d.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  },
  itemCard: function (it) {
    return (
      "" +
      '<a class="card card-hover item-card" href="item.html?id=' +
      encodeURIComponent(it.id) +
      '">' +
      '<div class="row"><span class="item-id">' +
      it.id +
      "</span>" +
      '<span class="' +
      window.EC.badgeClass(it.status) +
      '">' +
      it.status +
      "</span></div>" +
      '<h3 class="item-title">' +
      it.name +
      "</h3>" +
      '<p class="text-muted" style="margin:0">' +
      it.description +
      "</p>" +
      '<div class="row"><span class="text-muted" style="font-size:.8rem">' +
      it.location +
      "</span>" +
      '<span class="text-muted" style="font-size:.8rem">' +
      window.EC.formatDate(it.dateFound) +
      "</span></div>" +
      "</a>"
    );
  },
  search: function (query, category) {
    var q = (query || "").trim().toLowerCase();
    return (window.ITEMS || []).filter(function (it) {
      var matchQ =
        !q ||
        it.id.toLowerCase().indexOf(q) > -1 ||
        it.name.toLowerCase().indexOf(q) > -1 ||
        it.category.toLowerCase().indexOf(q) > -1;
      var matchC = !category || category === "All" || it.category === category;
      return matchQ && matchC;
    });
  },
};
