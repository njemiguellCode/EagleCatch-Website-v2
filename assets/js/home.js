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
  var form = document.getElementById("heroSearch");
  if (form)
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = document.getElementById("heroQuery").value.trim();
      window.location.href =
        "find.html" + (v ? "?q=" + encodeURIComponent(v) : "");
    });
})();
