(function () {
  function esc(s) {
    var d = document.createElement("div");
    d.appendChild(document.createTextNode(s));
    return d.innerHTML;
  }

  var backUrl = "find.html";
  try {
    var ref = document.referrer || "";
    if (ref.indexOf("find.html") > -1) backUrl = ref;
  } catch (e) {}

  var root = document.getElementById("itemRoot");
  var id = new URLSearchParams(window.location.search).get("id") || "";
  var it = (window.ITEMS || []).filter(function (x) {
    return x.id.toLowerCase() === id.trim().toLowerCase();
  })[0];

  if (!it) {
    root.innerHTML =
      '<div class="empty"><h1>Item not found</h1>' +
      '<p>We could not find an item with the ID “' +
      esc(id || "—") +
      '”.</p>' +
      '<a class="btn btn-primary" href="' + backUrl + '">Back to search</a></div>';
    return;
  }

  document.title = it.name + " — EagleCatch";
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

  // Build claim form HTML (hidden by default)
  var claimFormHtml = "";
  if (it.status !== "Claimed") {
    claimFormHtml =
      '<div id="claimFormWrap" style="display:none;margin-top:1.5rem">' +
      '<hr style="border:none;border-top:1px dashed color-mix(in oklab, var(--border) 80%, transparent);margin:0 0 1.5rem" />' +
      '<h3 style="margin-bottom:0.25rem">Claim this item</h3>' +
      '<p class="text-muted" style="margin-bottom:1rem;font-size:0.9rem">Fill out the form below and the team will verify your claim within 24 hours.</p>' +
      '<form id="claimForm" class="form-grid">' +
      '<div class="grid grid-2">' +
      '<div class="field"><label for="claimName">Your full name *</label><input class="input" id="claimName" placeholder="e.g. Juan Dela Cruz" required /></div>' +
      '<div class="field"><label for="claimEmail">Your email *</label><input class="input" id="claimEmail" type="email" placeholder="you@aski.edu.ph" required /></div>' +
      '</div>' +
      '<div class="field"><label for="claimStudentId">Student ID *</label><input class="input" id="claimStudentId" placeholder="e.g. ASKI-2026-0001" required /></div>' +
      '<div class="field"><label for="claimReason">Why is this yours? *</label><textarea class="textarea" id="claimReason" placeholder="Describe any identifying details: where you last had it, unique marks, why you recognize it..." required style="min-height:6rem"></textarea></div>' +
      '<button class="btn btn-primary" type="submit">' +
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>' +
      'Submit claim' +
      '</button>' +
      '<p class="text-muted" id="claimStatus" hidden></p>' +
      '</form>' +
      '</div>';
  }

  // Build claimed state HTML
  var claimedHtml = "";
  if (it.status === "Claimed") {
    claimedHtml =
      '<div style="margin-top:1rem;padding:1.25rem;border-radius:var(--radius-lg);background:color-mix(in oklab, var(--muted) 50%, transparent);border:1px solid var(--border)">' +
      '<p style="margin:0 0 0.75rem;font-weight:600">Believe this is yours?</p>' +
      '<p class="text-muted" style="margin:0 0 1rem;font-size:0.9rem">If you think this item belongs to you, contact the EagleCatch team with proof of ownership.</p>' +
      '<a class="btn btn-outline" href="contact.html?item=' + encodeURIComponent(it.id) + '">Contact the team</a>' +
      '</div>';
  }

  root.innerHTML =
    '<a class="btn btn-ghost" href="' + backUrl + '">← Back to search</a>' +
    '<div class="card mt-8">' +
    '<div class="row" style="display:flex;justify-content:space-between;align-items:center;gap:1rem">' +
    '<span class="item-id">' + esc(it.id) + '</span>' +
    '<span class="' + window.EC.badgeClass(it.status) + '">' + esc(it.status) + '</span>' +
    '</div>' +
    '<h1 style="margin-top:.75rem">' + esc(it.name) + '</h1>' +
    '<p class="text-muted">' + esc(it.description) + '</p>' +
    '<ul class="meta-list mt-8">' +
    '<li><span>Category</span><span>' + esc(it.category) + '</span></li>' +
    '<li><span>Found at</span><span>' + esc(it.location) + '</span></li>' +
    '<li><span>Date found</span><span>' + esc(window.EC.formatDate(it.dateFound)) + '</span></li>' +
    extra +
    '</ul>' +
    '<div class="btn-group" style="justify-content:flex-start">' +
    (it.status === "Claimed"
      ? '<span class="text-muted">This item has already been claimed.</span>'
      : '<button class="btn btn-primary" id="claimBtn" type="button">Claim this item</button>') +
    '</div>' +
    claimedHtml +
    '</div>' +
    claimFormHtml;

  // Wire up claim button and form
  var claimBtn = document.getElementById("claimBtn");
  var claimWrap = document.getElementById("claimFormWrap");
  var claimForm = document.getElementById("claimForm");
  var claimStatus = document.getElementById("claimStatus");
  var TO = "eaglecatch@aski.edu.ph";

  if (claimBtn && claimWrap) {
    claimBtn.addEventListener("click", function () {
      var hidden = claimWrap.style.display === "none";
      claimWrap.style.display = hidden ? "block" : "none";
      if (hidden) {
        claimWrap.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  if (claimForm) {
    claimForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("claimName").value.trim();
      var email = document.getElementById("claimEmail").value.trim();
      var studentId = document.getElementById("claimStudentId").value.trim();
      var reason = document.getElementById("claimReason").value.trim();

      if (!name || !email || !studentId || !reason) return;

      var subject = "[CLAIM] " + it.name + " (" + it.id + ")";
            var body =
        "ITEM CLAIM\n" +
        "================================\n\n" +
        "ITEM DETAILS\n" +
        "ID:          " + it.id + "\n" +
        "Name:        " + it.name + "\n" +
        "Category:    " + it.category + "\n" +
        "Location:    " + it.location + "\n" +
        "Date Found:  " + it.dateFound + "\n" +
        "\n================================\n" +
        "CLAIMANT DETAILS\n" +
        "Name:        " + name + "\n" +
        "Email:       " + email + "\n" +
        "Student ID:  " + studentId + "\n" +
        "\nWHY IS THIS YOURS?\n" +
        reason + "\n";

      var mailto =
        "mailto:" + TO +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      window.location.href = mailto;

      claimStatus.hidden = false;
      claimStatus.innerHTML =
        '<strong style="color:var(--gold)">Claim submitted!</strong> Your email client should open with the details pre-filled. Send the email to complete your claim. The team will verify and respond within 24 hours.';
    });
  }
})();