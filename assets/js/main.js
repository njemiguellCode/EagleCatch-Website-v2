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

function esc(s) {
  var d = document.createElement("div");
  d.appendChild(document.createTextNode(s));
  return d.innerHTML;
}

// Animated stat counters (home page only)
(function () {
  var row = document.getElementById("statsRow");
  if (!row) return;
  var nums = row.querySelectorAll(".stat-number[data-stat]");
  if (!nums.length) return;

  // Calculate stats from window.ITEMS
  var items = window.ITEMS || [];
  var stats = {
    total: items.length,
    claimed: items.filter(function (i) { return i.status === "Claimed"; }).length,
    categories: items.map(function (i) { return i.category; }).filter(function (v, i, a) { return a.indexOf(v) === i; }).length
  };

  // Set data-target from calculated stats
  nums.forEach(function (el) {
    var key = el.getAttribute("data-stat");
    if (key && stats[key] !== undefined) {
      el.setAttribute("data-target", stats[key]);
    }
  });

  var observed = false;
  function animateCountUp() {
    if (observed) return;
    observed = true;
    nums.forEach(function (el) {
      var target = parseInt(el.getAttribute("data-target"), 10);
      if (isNaN(target)) return;
      var duration = 1500;
      var start = performance.now();
      function step(now) {
        var progress = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.round(eased * target);
        el.textContent = current + (target >= 100 ? "+" : "");
        if (progress < 1) requestAnimationFrame(step);
      }
      el.textContent = "0";
      requestAnimationFrame(step);
    });
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        animateCountUp();
        io.disconnect();
      }
    }, { threshold: 0.1, rootMargin: '50px' });
    io.observe(row);
    // Fallback: if already in view, animate after a short delay
    setTimeout(function () {
      if (!observed) animateCountUp();
    }, 500);
  } else {
    animateCountUp();
  }
})();

window.EC = {
  esc: esc,
  badgeClass: function (status) {
    if (status === "Claimed") return "badge badge-claimed";
    if (status === "Found") return "badge badge-found";
    return "badge badge-lost";
  },
  statusStripClass: function (status) {
    if (status === "Found") return "strip-found";
    if (status === "Claimed") return "strip-claimed";
    return "strip-available";
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
  setFieldError: function (el, msg) {
    if (!el) return;
    var field = el.closest(".field") || el.parentElement;
    var err = field ? field.querySelector(".field-error") : null;
    if (msg) {
      el.setAttribute("aria-invalid", "true");
      if (!err) {
        err = document.createElement("p");
        err.className = "field-error";
        err.setAttribute("role", "alert");
        field.appendChild(err);
      }
      if (!err.id) err.id = "err-" + (el.id || "field");
      el.setAttribute("aria-describedby", err.id);
      err.textContent = msg;
    } else {
      el.removeAttribute("aria-invalid");
      el.removeAttribute("aria-describedby");
      if (err) err.remove();
    }
  },
  validateForm: function (form) {
    if (!form) return true;
    var ok = true;
    var firstBad = null;
    var fields = form.querySelectorAll(
      "input[required], select[required], textarea[required]"
    );
    Array.prototype.forEach.call(fields, function (el) {
      var val = (el.value || "").trim();
      var msg = "";
      if (!val) msg = "This field is required.";
      else if (
        el.type === "email" &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
      )
        msg = "Please enter a valid email address.";
      window.EC.setFieldError(el, msg);
      if (msg) {
        ok = false;
        if (!firstBad) firstBad = el;
      }
    });
    if (firstBad) firstBad.focus();
    return ok;
  },
  wireValidation: function (form) {
    if (!form) return;
    form.addEventListener("input", function (e) {
      var t = e.target;
      if (t && t.getAttribute && t.getAttribute("aria-invalid") === "true") {
        window.EC.setFieldError(t, "");
      }
    });
  },
  deliverForm: function (to, subject, fields) {
    var payload = {
      _subject: subject,
      _template: "table",
      _captcha: "false"
    };
    fields.forEach(function (f) {
      payload[f[0]] = f[1];
      if (f[2] === "replyto") payload._replyto = f[1];
    });
    return fetch("https://formsubmit.co/ajax/" + encodeURIComponent(to), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload)
    }).then(function (r) {
      return r.json().then(function (data) {
        var ok =
          r.ok &&
          (data.success === true || data.success === "true");
        if (!ok) {
          throw new Error(data.message || "The form service rejected the submission.");
        }
        return data;
      });
    });
  },
  mailtoLink: function (to, subject, fields) {
    var body = fields
      .map(function (f) { return f[0] + ": " + f[1]; })
      .join("\n");
    return (
      "mailto:" + to +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body)
    );
  },
  setSending: function (form, sending) {
    var btn = form ? form.querySelector('button[type="submit"]') : null;
    if (!btn) return;
    if (sending) {
      btn.setAttribute("data-label", btn.textContent.trim());
      btn.textContent = "Sending\u2026";
      btn.disabled = true;
  } else {
      var label = btn.getAttribute("data-label");
      btn.textContent = label || "Submit";
      btn.disabled = false;
    }
  },
  pinIcon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:3px;opacity:.6"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  chevronIcon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:.4;transition:opacity .2s"><path d="M9 18l6-6-6-6"/></svg>',
  itemCard: function (it) {
    var stripClass = window.EC.statusStripClass(it.status);
    return (
      "" +
      '<a class="card card-hover item-card ' + stripClass + '" href="item.html?id=' +
      encodeURIComponent(it.id) +
      '">' +
      (it.photo
        ? '<img class="item-thumb" src="' + esc(it.photo) + '" alt="" loading="lazy" />'
        : "") +
      '<div class="row"><span class="item-id">' +
      esc(it.id) +
      "</span>" +
      '<span class="' +
      window.EC.badgeClass(it.status) +
      '">' +
      esc(it.status) +
      "</span></div>" +
      '<h3 class="item-title">' +
      esc(it.name) +
      "</h3>" +
      '<p class="text-muted" style="margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">' +
      esc(it.description) +
      "</p>" +
      '<div class="row item-card-footer"><span class="text-muted item-card-location">' +
      window.EC.pinIcon +
      esc(it.location) +
      "</span>" +
      '<span class="text-muted item-card-date">' +
      esc(window.EC.formatDate(it.dateFound)) +
      window.EC.chevronIcon +
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
