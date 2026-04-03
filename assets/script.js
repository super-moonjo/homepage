document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('[data-menu-toggle]');
  const globalNav = document.querySelector('.global-nav');

  if (navToggle && globalNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = globalNav.classList.toggle('open');
      document.body.classList.toggle('menu-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.textContent = isOpen ? '닫기' : '메뉴';
    });

    globalNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 1040) {
          globalNav.classList.remove('open');
          document.body.classList.remove('menu-open');
          navToggle.setAttribute('aria-expanded', 'false');
          navToggle.textContent = '메뉴';
        }
      });
    });
  }

  const tabGroups = document.querySelectorAll('[data-tab-group]');

  const activateTab = (group, tabId, updateHash = true) => {
    const buttons = group.querySelectorAll('[data-tab-btn]');
    const panels = group.querySelectorAll('[data-tab-panel]');

    buttons.forEach(btn => {
      const match = btn.dataset.tabBtn === tabId;
      btn.classList.toggle('active', match);
      btn.setAttribute('aria-selected', String(match));
    });

    panels.forEach(panel => {
      const match = panel.dataset.tabPanel === tabId;
      panel.classList.toggle('active', match);
      panel.hidden = !match;
    });

    if (updateHash) {
      const nextHash = `tab-${tabId}`;
      history.replaceState(null, '', `#${nextHash}`);
    }

    requestAnimationFrame(() => resizeAllIframes(group));
  };

  tabGroups.forEach(group => {
    const buttons = group.querySelectorAll('[data-tab-btn]');
    const defaultTab = group.dataset.defaultTab || (buttons[0] && buttons[0].dataset.tabBtn);

    buttons.forEach(btn => {
      btn.addEventListener('click', () => activateTab(group, btn.dataset.tabBtn));
    });

    const hash = window.location.hash.replace('#tab-', '');
    const hasHashMatch = [...buttons].some(btn => btn.dataset.tabBtn === hash);
    activateTab(group, hasHashMatch ? hash : defaultTab, false);
  });

  function resizeIframe(iframe) {
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      if (!doc) return;
      const body = doc.body;
      const html = doc.documentElement;
      const height = Math.max(
        body ? body.scrollHeight : 0,
        html ? html.scrollHeight : 0,
        body ? body.offsetHeight : 0,
        html ? html.offsetHeight : 0,
        body ? body.clientHeight : 0,
        html ? html.clientHeight : 0
      );
      if (height) {
        iframe.style.height = `${height + 8}px`;
      }
    } catch (error) {
      // same-origin pages are expected; silently ignore if inaccessible
    }
  }

  function resizeAllIframes(scope = document) {
    scope.querySelectorAll('iframe[data-auto-resize]').forEach(resizeIframe);
  }

  document.querySelectorAll('iframe[data-auto-resize]').forEach(iframe => {
    iframe.addEventListener('load', () => {
      resizeIframe(iframe);
      setTimeout(() => resizeIframe(iframe), 250);
      setTimeout(() => resizeIframe(iframe), 900);
    });
  });

  window.addEventListener('resize', () => resizeAllIframes(document));
  setTimeout(() => resizeAllIframes(document), 400);
  setTimeout(() => resizeAllIframes(document), 1200);

  const topButtons = document.querySelectorAll('[data-scroll-top]');
  topButtons.forEach(btn => {
    btn.addEventListener('click', event => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
});
