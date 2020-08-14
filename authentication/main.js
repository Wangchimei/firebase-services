document.addEventListener('DOMContentLoaded', function () {
  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var collapsible = document.querySelectorAll('.collapsible');
  M.Collapsible.init(collapsible);
});