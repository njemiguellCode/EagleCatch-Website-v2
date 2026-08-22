// Shared helpers + nav
(function () {
  var t = document.getElementById("navToggle");
  var n = document.getElementById("nav");
  if (t && n)
    t.addEventListener("click", function () {
      n.classList.toggle("open");
    });
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
