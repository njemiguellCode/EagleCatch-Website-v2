(function () {
  var form = document.getElementById("reportForm");
  if (!form) return;
  var status = document.getElementById("formStatus");
  var TO = "eaglecatch@aski.edu.ph";

  // Set default date to today
  var dateInput = document.getElementById("itemDate");
  if (dateInput) {
    var today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var name = document.getElementById("reporterName").value.trim();
    var email = document.getElementById("reporterEmail").value.trim();
    var itemName = document.getElementById("itemName").value.trim();
    var category = document.getElementById("itemCategory").value;
    var description = document.getElementById("itemDescription").value.trim();
    var location = document.getElementById("itemLocation").value.trim();
    var date = document.getElementById("itemDate").value;
    var notes = document.getElementById("reporterNotes").value.trim();

    if (!name || !email || !itemName || !category || !description || !location || !date) return;

    var subject = "[FOUND] " + itemName + " \u2014 " + category;

    var body =
      "FOUND ITEM REPORT\n" +
      "================================\n\n" +
      "ITEM DETAILS\n" +
      "Name:        " + itemName + "\n" +
      "Category:    " + category + "\n" +
      "Description: " + description + "\n" +
      "Location:    " + location + "\n" +
      "Date Found:  " + date + "\n" +
      (notes ? "\nADDITIONAL NOTES\n" + notes + "\n" : "") +
      "\n================================\n" +
      "REPORTED BY\n" +
      "Name:  " + name + "\n" +
      "Email: " + email + "\n";

    var mailto =
      "mailto:" + TO +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

    window.location.href = mailto;

    status.hidden = false;
    status.innerHTML =
      '<strong style="color:var(--gold)">Report submitted!</strong> Your email client should open with the details pre-filled. Send the email to complete your report. The team will review it and add the item to the Find board within 24 hours.';
  });
})();
