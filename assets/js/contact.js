(function () {
  var form = document.getElementById("contactForm");
  if (!form) return;
  var item = new URLSearchParams(window.location.search).get("item");
  if (item) {
    document.getElementById("subject").value = "Claim for " + item;
    document.getElementById("message").value =
      "Hi EagleCatch team, I would like to claim item " + item + ". ";
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    document.getElementById("formStatus").hidden = false;
    form.reset();
  });
})();
