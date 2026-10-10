(function () {
  // writing page: show everything, or only personal or professional pieces
  var filters = document.querySelectorAll('.filters button');
  var pieces = document.querySelectorAll('.rows li[data-tag]');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var want = btn.getAttribute('data-tag');
      filters.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      pieces.forEach(function (li) {
        li.hidden = want !== 'all' && li.getAttribute('data-tag') !== want;
      });
    });
  });
})();
