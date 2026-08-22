(function () {
  var root = document.getElementById("itemRoot");
  var id = new URLSearchParams(window.location.search).get("id") || "";
  var it = (window.ITEMS || []).filter(function (x) {
    return x.id.toLowerCase() === id.trim().toLowerCase();
  })[0];

  if (!it) {
    root.innerHTML =
      '<div class="empty"><h1>Item not found</h1>' +
      '<p>We could not find an item with the ID "' +
      (id || "—") +
      '".</p>' +
      '<a class="btn btn-primary" href="find.html">Back to search</a></div>';
    return;
  }

  document.title = it.name + " — EagleCatch";
  var extra = "";
  if (it.additional) {
    extra = Object.keys(it.additional)
      .map(function (k) {
        return (
          "<li><span>" + k + "</span><span>" + it.additional[k] + "</span></li>"
        );
      })
      .join("");
  }

  root.innerHTML =
    "" +
    '<a class="btn btn-ghost" href="find.html">&larr; Back to search</a>' +
    '<div class="card mt-8">' +
    '<div class="row" style="display:flex;justify-content:space-between;align-items:center;gap:1rem">' +
    '<span class="item-id">' +
    it.id +
    "</span>" +
    '<span class="' +
    window.EC.badgeClass(it.status) +
    '">' +
    it.status +
    "</span>" +
    "</div>" +
    '<h1 style="margin-top:.75rem">' +
    it.name +
    "</h1>" +
    '<p class="text-muted">' +
    it.description +
    "</p>" +
    '<ul class="meta-list mt-8">' +
    "<li><span>Category</span><span>" +
    it.category +
    "</span></li>" +
    "<li><span>Found at</span><span>" +
    it.location +
    "</span></li>" +
    "<li><span>Date found</span><span>" +
    window.EC.formatDate(it.dateFound) +
    "</span></li>" +
    extra +
    "</ul>" +
    '<div class="btn-group" style="justify-content:flex-start">' +
    (it.status === "Claimed"
      ? '<span class="text-muted">This item has already been claimed.</span>'
      : '<a class="btn btn-primary" href="contact.html?item=' +
        encodeURIComponent(it.id) +
        '">Claim this item</a>') +
    "</div>" +
    "</div>";
})();
