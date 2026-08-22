(function () {
  var grid = document.getElementById("freshFinds");
  if (grid) {
    var latest = (window.ITEMS || [])
      .slice()
      .sort(function (a, b) {
        return b.dateFound.localeCompare(a.dateFound);
      })
      .slice(0, 3);
    grid.innerHTML = latest.map(window.EC.itemCard).join("");
  }

  // Hero search form submit
  var form = document.getElementById("heroSearch");
  if (form)
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = document.getElementById("heroQuery").value.trim();
      window.location.href =
        "find.html" + (v ? "?q=" + encodeURIComponent(v) : "");
    });

  // Autocomplete
  var input = document.getElementById("heroQuery");
  var ac = document.getElementById("heroAutocomplete");
  if (!input || !ac) return;

  var activeIndex = -1;
  var esc = window.EC.esc;

  function getMatches(query) {
    var q = (query || "").trim().toLowerCase();
    if (!q) return [];
    return (window.ITEMS || []).filter(function (it) {
      return (
        it.id.toLowerCase().indexOf(q) > -1 ||
        it.name.toLowerCase().indexOf(q) > -1 ||
        it.category.toLowerCase().indexOf(q) > -1
      );
    }).slice(0, 6);
  }

  function renderAC(matches) {
    if (!matches.length) {
      ac.hidden = true;
      activeIndex = -1;
      return;
    }
    activeIndex = -1;
    ac.innerHTML = matches
      .map(function (it, i) {
        return (
          '<div class="autocomplete-item" data-id="' +
          encodeURIComponent(it.id) +
          '" data-index="' + i + '">' +
          '<span class="autocomplete-name">' + esc(it.name) + "</span>" +
          '<span class="autocomplete-id">' + esc(it.id) + "</span>" +
          "</div>"
        );
      })
      .join("");
    ac.hidden = false;

    // Click handler
    var items = ac.querySelectorAll(".autocomplete-item");
    items.forEach(function (el) {
      el.addEventListener("mousedown", function (e) {
        e.preventDefault();
        window.location.href =
          "item.html?id=" + el.getAttribute("data-id");
      });
    });
  }

  function setActive(index) {
    var items = ac.querySelectorAll(".autocomplete-item");
    items.forEach(function (el, i) {
      el.classList.toggle("active", i === index);
    });
    activeIndex = index;
  }

  input.addEventListener("input", function () {
    renderAC(getMatches(input.value));
  });

  input.addEventListener("keydown", function (e) {
    var items = ac.querySelectorAll(".autocomplete-item");
    var count = items.length;
    if (ac.hidden || !count) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(activeIndex < count - 1 ? activeIndex + 1 : 0);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(activeIndex > 0 ? activeIndex - 1 : count - 1);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      window.location.href =
        "item.html?id=" +
        items[activeIndex].getAttribute("data-id");
    } else if (e.key === "Escape") {
      ac.hidden = true;
      activeIndex = -1;
    }
  });

  input.addEventListener("blur", function () {
    setTimeout(function () {
      ac.hidden = true;
      activeIndex = -1;
    }, 150);
  });
})();
