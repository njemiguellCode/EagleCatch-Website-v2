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
    document.title = "Item not found — EagleCatch";
    var shown = id.trim();
    var suggestions = [];
    var digits = shown.replace(/\D/g, "");
    if (digits.length >= 3) {
      suggestions = (window.ITEMS || []).filter(function (x) {
        return x.id.replace(/\D/g, "").indexOf(digits) > -1;
      }).slice(0, 3);
    }
    if (!suggestions.length && shown) {
      var low = shown.toLowerCase();
      suggestions = (window.ITEMS || []).filter(function (x) {
        return x.name.toLowerCase().indexOf(low) > -1;
      }).slice(0, 3);
    }
    var sugHtml = "";
    if (suggestions.length) {
      sugHtml =
        '<p class="empty-hint">Were you looking for one of these?</p>' +
        '<div class="empty-actions">' +
        suggestions.map(function (s) {
          return (
            '<a class="btn btn-outline" href="item.html?id=' + encodeURIComponent(s.id) + '">' +
            '<span class="item-id">' + esc(s.id) + "</span>&nbsp;" + esc(s.name) +
            "</a>"
          );
        }).join("") +
        "</div>";
    }
    root.innerHTML =
      '<div class="empty">' +
      '<div class="empty-icon" aria-hidden="true">' +
      '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/><path d="M8 11h6"/></svg>' +
      "</div>" +
      '<h1 class="empty-title">' + (shown ? "Item not found" : "No item ID given") + "</h1>" +
      "<p>" +
      (shown
        ? "We could not find an item with the ID \u201C" + esc(shown) + "\u201D. Double-check the ID or search the board."
        : "This page needs an item ID. Browse the board to find what you're looking for.") +
      "</p>" +
      '<div class="empty-actions">' +
      '<a class="btn btn-primary" href="' + backUrl + '">Back to search</a>' +
      '<a class="btn btn-outline" href="report.html">Report a found item</a>' +
      "</div>" +
      sugHtml +
      "</div>";
    var notFoundTitle = root.querySelector(".empty-title");
    if (notFoundTitle) notFoundTitle.setAttribute("tabindex", "-1");
    root.addEventListener("keydown", function (e) {
      if (e.key === "Escape") window.location.href = backUrl;
    });
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
    (it.photo
      ? '<img class="item-photo" src="' + esc(it.photo) + '" alt="Photo of ' + esc(it.name) + '" />'
      : "") +
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
  var TO = "nickoseser@gmail.com";

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
    window.EC.wireValidation(claimForm);
    claimForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!window.EC.validateForm(claimForm)) return;
      var name = document.getElementById("claimName").value.trim();
      var email = document.getElementById("claimEmail").value.trim();
      var studentId = document.getElementById("claimStudentId").value.trim();
      var reason = document.getElementById("claimReason").value.trim();

      if (!name || !email || !studentId || !reason) return;

      var subject = "[CLAIM] " + it.name + " (" + it.id + ")";
      var fields = [
        ["Item ID", it.id],
        ["Item name", it.name],
        ["Category", it.category],
        ["Found at", it.location],
        ["Date found", it.dateFound],
        ["Claimant name", name, "replyto"],
        ["Claimant email", email],
        ["Student ID", studentId],
        ["Why is this yours?", reason]
      ];

      window.EC.setSending(claimForm, true);
      claimStatus.hidden = true;

      window.EC.deliverForm(TO, subject, fields)
        .then(function () {
          claimForm.reset();
          claimStatus.hidden = false;
          claimStatus.innerHTML =
            '<strong style="color:var(--gold)">Claim submitted!</strong> It was delivered to the EagleCatch team. They will verify your claim and respond to <strong>' +
            esc(email) + "</strong> within 24 hours.";
        })
        .catch(function () {
          claimStatus.hidden = false;
          claimStatus.innerHTML =
            '<strong style="color:var(--destructive)">We could not send your claim automatically.</strong> ' +
            '<a href="' + window.EC.mailtoLink(TO, subject, fields) + '">Click here to send it with your email app instead</a>.';
        })
        .then(function () {
          window.EC.setSending(claimForm, false);
        });
    });
  }
})();