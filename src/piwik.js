let url = 'http://localhost:8080/';
let siteId = 2;
let previousPath;

/**
 * Push.
 * @function push
 * @param {Array} array Logging array
 * @returns {void}
 */
function push(array) {
  if (__CLIENT__) {
    window._paq.push(array); // eslint-disable-line no-underscore-dangle
  }
}

/**
 * Track.
 * @function track
 * @returns {void}
 */
function track() {
  if (__CLIENT__) {
    const currentPath = `${window.location.protocol}//${window.location.host + window.location.pathname}`;

    if (previousPath === currentPath) {
      return;
    }

    push(['setDocumentTitle', document.title]);
    push(['setCustomUrl', currentPath]);
    push(['trackPageView']);

    previousPath = currentPath;
  }
}

if (__CLIENT__) {
  const hostname = window.location.hostname;

  if (/tippiq\.(nl|rocks)$/.test(hostname)) {
    url = 'https://tippiq-beheer.piwik.pro/';
  }

  if (hostname === 'id.tippiq.nl') { // Production
    siteId = 7;
  } else if (hostname === 'id-acc.tippiq.nl') { // Acceptance
    siteId = 17;
  } else if (hostname === 'id-test.tippiq.rocks') { // Test
    siteId = 21;
  }

  // eslint-disable-next-line dot-notation
  window._paq = window['_paq'] || []; // eslint-disable-line no-underscore-dangle

  push(['setSiteId', siteId]);
  push(['setTrackerUrl', `${url}piwik.php`]);
  push(['enableLinkTracking']);

  const scriptTag = document.createElement('script');
  scriptTag.type = 'text/javascript';
  scriptTag.defer = true;
  scriptTag.async = true;
  scriptTag.src = `${url}piwik.js`;
  const adjacentScriptTag = document.getElementsByTagName('script')[0];
  if (adjacentScriptTag) {
    adjacentScriptTag.parentNode.insertBefore(scriptTag, adjacentScriptTag);
  }
}

const piwik = {
  push,
  track,
};

export default piwik;
