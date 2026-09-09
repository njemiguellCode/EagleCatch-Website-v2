(function () {
  var form = document.getElementById("contactForm");
  if (!form) return;
  var status = document.getElementById("formStatus");
  var TO = "nickoseser@gmail.com";

  var item = new URLSearchParams(window.location.search).get("item");
  if (item) {
    document.getElementById("subject").value = "Claim for " + item;
    document.getElementById("message").value =
      "Hi EagleCatch team,\n\nI would like to claim item " + item + ".";
  }

  window.EC.wireValidation(form);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!window.EC.validateForm(form)) return;

    var name = document.getElementById("name").value.trim();
    var email = document.getElementById("email").value.trim();
    var subject = document.getElementById("subject").value.trim();
    var message = document.getElementById("message").value.trim();

    var fields = [
      ["From", name],
      ["Email", email, "replyto"],
      ["Message", message]
    ];

    window.EC.setSending(form, true);
    status.hidden = true;

    window.EC.deliverForm(TO, subject, fields)
      .then(function () {
        form.reset();
        status.hidden = false;
        status.innerHTML =
          '<strong style="color:var(--gold)">Message sent!</strong> It was delivered to the EagleCatch team. They will reply to <strong>' +
          window.EC.esc(email) + "</strong> as soon as they can.";
      })
      .catch(function () {
        status.hidden = false;
        status.innerHTML =
          '<strong style="color:var(--destructive)">We could not send your message automatically.</strong> ' +
          '<a href="' + window.EC.mailtoLink(TO, subject, fields) + '">Click here to send it with your email app instead</a>.';
      })
      .then(function () {
        window.EC.setSending(form, false);
      });
  });
})();
