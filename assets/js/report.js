(function () {
  var form = document.getElementById("reportForm");
  if (!form) return;
  var status = document.getElementById("formStatus");
  var TO = "nickoseser@gmail.com";

  // Set default date to today
  var dateInput = document.getElementById("itemDate");
  if (dateInput) {
    var today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
  }

  window.EC.wireValidation(form);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!window.EC.validateForm(form)) return;

    var name = document.getElementById("reporterName").value.trim();
    var email = document.getElementById("reporterEmail").value.trim();
    var itemName = document.getElementById("itemName").value.trim();
    var category = document.getElementById("itemCategory").value;
    var description = document.getElementById("itemDescription").value.trim();
    var location = document.getElementById("itemLocation").value.trim();
    var date = document.getElementById("itemDate").value;
    var notes = document.getElementById("reporterNotes").value.trim();

    var subject = "[FOUND] " + itemName + " \u2014 " + category;
    var fields = [
      ["Item name", itemName],
      ["Category", category],
      ["Description", description],
      ["Location found", location],
      ["Date found", date],
      ["Additional notes", notes || "\u2014"],
      ["Reporter name", name, "replyto"],
      ["Reporter email", email]
    ];

    window.EC.setSending(form, true);
    status.hidden = true;

    window.EC.deliverForm(TO, subject, fields)
      .then(function () {
        form.reset();
        if (dateInput) {
          dateInput.value = new Date().toISOString().split("T")[0];
        }
        status.hidden = false;
        status.innerHTML =
          '<strong style="color:var(--gold)">Report submitted!</strong> It was delivered to the EagleCatch team. They will review it and add the item to the Find board within 24 hours. Please hand the item to the SSG desk if you have not already.';
      })
      .catch(function () {
        status.hidden = false;
        status.innerHTML =
          '<strong style="color:var(--destructive)">We could not send your report automatically.</strong> ' +
          '<a href="' + window.EC.mailtoLink(TO, subject, fields) + '">Click here to send it with your email app instead</a>.';
      })
      .then(function () {
        window.EC.setSending(form, false);
      });
  });
})();
