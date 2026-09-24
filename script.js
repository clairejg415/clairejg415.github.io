(function () {
  var overlay = document.getElementById('overlay');
  var hotspots = document.querySelectorAll('.hotspot');
  var activePanel = null;

  function openPanel(id) {
    var panel = document.getElementById('panel-' + id);
    if (!panel) return;
    overlay.classList.add('visible');
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    activePanel = panel;
    var closeBtn = panel.querySelector('.close');
    if (closeBtn) closeBtn.focus();
  }

  function closePanel() {
    if (!activePanel) return;
    activePanel.classList.remove('open');
    activePanel.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('visible');
    document.body.classList.remove('no-scroll');
    activePanel = null;
  }

  hotspots.forEach(function (h) {
    h.addEventListener('click', function () {
      openPanel(h.getAttribute('data-panel'));
    });
    h.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openPanel(h.getAttribute('data-panel'));
      }
    });
  });

  document.querySelectorAll('.panel .close').forEach(function (btn) {
    btn.addEventListener('click', closePanel);
  });

  overlay.addEventListener('click', closePanel);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePanel();
  });
})();
