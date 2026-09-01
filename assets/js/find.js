(function () {
  var results = document.getElementById("results");
  var empty = document.getElementById("empty");
  var q = document.getElementById("q");
  var cat = document.getElementById("cat");
  var sort = document.getElementById("sort");
  var resultCount = document.getElementById("resultCount");

  var cats = ["All"].concat(
    (window.ITEMS || [])
      .map(function (i) {
        return i.category;
      })
      .filter(function (v, i, a) {
        return a.indexOf(v) === i;
      })
      .sort(),
  );
  cat.innerHTML = cats
    .map(function (c) {
      return "<option>" + c + "</option>";
    })
    .join("");

  function applySort(list) {
    var v = sort ? sort.value : "newest";
    var copy = list.slice();
    if (v === "newest") {
      copy.sort(function (a, b) { return b.dateFound.localeCompare(a.dateFound); });
    } else if (v === "oldest") {
      copy.sort(function (a, b) { return a.dateFound.localeCompare(b.dateFound); });
    } else if (v === "az") {
      copy.sort(function (a, b) { return a.name.localeCompare(b.name); });
    } else if (v === "za") {
      copy.sort(function (a, b) { return b.name.localeCompare(a.name); });
    }
    return copy;
  }

  function render() {
    var all = window.EC.search(q.value, cat.value);
    var list = applySort(all);
    results.innerHTML = list.map(window.EC.itemCard).join("");
    empty.hidden = list.length > 0;
    if (resultCount) {
      var total = (window.ITEMS || []).length;
      if (all.length === total) {
        resultCount.textContent = "Showing all " + total + " items";
      } else {
        resultCount.textContent = "Showing " + all.length + " of " + total + " items";
      }
      resultCount.hidden = list.length === 0;
    }
  }

  var params = new URLSearchParams(window.location.search);
  if (params.get("q")) q.value = params.get("q");
  if (params.get("cat")) cat.value = params.get("cat");
  if (params.get("sort") && sort) sort.value = params.get("sort");

  document.getElementById("findForm").addEventListener("submit", function (e) {
    e.preventDefault();
    render();
  });
  cat.addEventListener("change", render);
  if (sort) sort.addEventListener("change", render);
  q.addEventListener("input", render);
  document.getElementById("resetBtn").addEventListener("click", function () {
    q.value = "";
    cat.value = "All";
    if (sort) sort.value = "newest";
    render();
  });
  render();

  // Autocomplete for find page
  var ac = document.getElementById("findAutocomplete");
  if (!ac) return;
  var activeIndex = -1;
  var esc = window.EC.esc;

  function getMatches(query) {
    var qu = (query || "").trim().toLowerCase();
    if (!qu) return [];
    return (window.ITEMS || []).filter(function (it) {
      return (
        it.id.toLowerCase().indexOf(qu) > -1 ||
        it.name.toLowerCase().indexOf(qu) > -1 ||
        it.category.toLowerCase().indexOf(qu) > -1
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

  q.addEventListener("input", function () {
    renderAC(getMatches(q.value));
  });

  q.addEventListener("keydown", function (e) {
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
        "item.html?id=" + items[activeIndex].getAttribute("data-id");
    } else if (e.key === "Escape") {
      ac.hidden = true;
      activeIndex = -1;
    }
  });

  q.addEventListener("blur", function () {
    setTimeout(function () {
      ac.hidden = true;
      activeIndex = -1;
    }, 150);
  });
})();
