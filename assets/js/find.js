(function () {
  var results = document.getElementById("results");
  var empty = document.getElementById("empty");
  var q = document.getElementById("q");
  var cat = document.getElementById("cat");

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

  function render() {
    var list = window.EC.search(q.value, cat.value);
    results.innerHTML = list.map(window.EC.itemCard).join("");
    empty.hidden = list.length > 0;
  }

  var params = new URLSearchParams(window.location.search);
  if (params.get("q")) q.value = params.get("q");

  document.getElementById("findForm").addEventListener("submit", function (e) {
    e.preventDefault();
    render();
  });
  cat.addEventListener("change", render);
  q.addEventListener("input", render);
  document.getElementById("resetBtn").addEventListener("click", function () {
    q.value = "";
    cat.value = "All";
    render();
  });
  render();
})();
