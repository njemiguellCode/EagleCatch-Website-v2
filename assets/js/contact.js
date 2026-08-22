(function () {
  var form = document.getElementById("contactForm");
  if (!form) return;
  var status = document.getElementById("formStatus");
  var TO = "eaglecatch@aski.edu.ph";

  var item = new URLSearchParams(window.location.search).get("item");
  if (item) {
    document.getElementById("subject").value = "Claim for " + item;
    document.getElementById("message").value =
      "Hi EagleCatch team,\n\nI would like to claim item " + item + ".";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var name = document.getElementById("name").value.trim();
    var email = document.getElementById("email").value.trim();
    var subject = document.getElementById("subject").value.trim();
    var message = document.getElementById("message").value.trim();

    if (!name || !email || !subject || !message) return;

    var body = message + "\n\n---\nFrom: " + name + "\nEmail: " + email;
    var mailto =
      "mailto:" + TO +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

    window.location.href = mailto;

    status.hidden = false;
    status.textContent =
      "Your email client should open with the message pre-filled. Send it to complete your message.";
  });
})();
