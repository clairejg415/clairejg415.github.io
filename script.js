(function () {
  // the picture's hotspots are SVG groups, so they take you to their page
  // on click, and on Enter for the one that is keyboard-reachable
  document.querySelectorAll('[data-href]').forEach(function (t) {
    var go = function () { window.location.href = t.getAttribute('data-href'); };
    t.addEventListener('click', go);
    t.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); go(); }
    });
  });
})();
