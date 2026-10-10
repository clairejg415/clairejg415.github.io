(function () {
  var overlay = document.getElementById('overlay');
  var page = [document.querySelector('main'), document.querySelector('footer')];
  var activePanel = null;
  var opener = null;

  function openPanel(id, trigger) {
    var panel = document.getElementById('panel-' + id);
    if (!panel) return;
    if (activePanel) closePanel(true);
    opener = trigger || null;
    overlay.classList.add('visible');
    panel.hidden = false;
    void panel.offsetWidth;   // apply the unhidden state first so the fade-in runs
    panel.classList.add('open');
    var closeBtn = panel.querySelector('.close');
    if (closeBtn) closeBtn.focus();
    // the rest of the page goes inert so keyboard and screen readers stay in the panel
    page.forEach(function (el) { if (el) el.inert = true; });
    document.body.classList.add('no-scroll');
    activePanel = panel;
  }

  function closePanel(keepFocus) {
    if (!activePanel) return;
    var panel = activePanel;
    panel.classList.remove('open');
    panel.hidden = true;
    overlay.classList.remove('visible');
    page.forEach(function (el) { if (el) el.inert = false; });
    document.body.classList.remove('no-scroll');
    activePanel = null;
    // send focus back where it came from; picture hotspots that aren't focusable fall back to the menu
    if (!keepFocus) {
      var back = opener && opener.tabIndex >= 0 ? opener
        : document.querySelector('.menu-item[data-panel="' + panel.id.replace('panel-', '') + '"]');
      if (back) back.focus();
    }
    opener = null;
  }

  document.querySelectorAll('[data-panel]').forEach(function (t) {
    t.addEventListener('click', function () {
      openPanel(t.getAttribute('data-panel'), t);
    });
    // the picture's hotspots are SVG groups, not buttons, so give them button keys
    if (t.tagName.toLowerCase() !== 'button') {
      t.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openPanel(t.getAttribute('data-panel'), t);
        }
      });
    }
  });

  document.querySelectorAll('.panel .close').forEach(function (btn) {
    btn.addEventListener('click', function () { closePanel(); });
  });

  overlay.addEventListener('click', function () { closePanel(); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePanel();
  });
})();
