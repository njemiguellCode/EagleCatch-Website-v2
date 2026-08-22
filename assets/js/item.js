(function () {
  function esc(s) {
    var d = document.createElement("div");
    d.appendChild(document.createTextNode(s));
    return d.innerHTML;
  }

  var root = document.getElementById("itemRoot");
  var id = new URLSearchParams(window.location.search).get("id") || "";
  var it = (window.ITEMS || []).filter(function (x) {
    return x.id.toLowerCase() === id.trim().toLowerCase();
  })[0];

  if (!it) {
    root.innerHTML =
      '<div class="empty"><h1>Item not found</h1>' +
      '<p>We could not find an item with the ID \u201c' +
      esc(id || "\u2014") +
      '\u201d.</p>' +
      '<a class="btn btn-primary" href="find.html">Back to search</a></div>';
    return;
  }

  document.title = it.name + " \u2014 EagleCatch";
  var extra = "";
  if (it.additional) {
    extra = Object.keys(it.additional)
      .map(function (k) {
        return (
          "<li><span>" + esc(k) + "</span><span>" + esc(it.additional[k]) + "</span></li>"
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
    esc(it.id) +
    "</span>" +
    '<span class="' +
    window.EC.badgeClass(it.status) +
    '">' +
    esc(it.status) +
    "</span>" +
    "</div>" +
    '<h1 style="margin-top:.75rem">' +
    esc(it.name) +
    "</h1>" +
    '<p class="text-muted">' +
    esc(it.description) +
    "</p>" +
    '<ul class="meta-list mt-8">' +
    "<li><span>Category</span><span>" +
    esc(it.category) +
    "</span></li>" +
    "<li><span>Found at</span><span>" +
    esc(it.location) +
    "</span></li>" +
    "<li><span>Date found</span><span>" +
    esc(window.EC.formatDate(it.dateFound)) +
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
