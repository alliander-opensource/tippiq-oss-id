function waitUntilURLContains(browser, text, timeout) {
  const specTimeout = timeout || 10000;

  return browser.driver
      .wait(() => browser.driver.getCurrentUrl()
      .then(currentUrl => currentUrl.includes(text)), specTimeout);
}

function waitUntilURLIsLoaded(browser, url, timeout) {
  const specTimeout = timeout || 10000;

  return browser.driver
    .wait(() => browser.driver.getCurrentUrl()
      .then(currentUrl => url === currentUrl), specTimeout);
}

function getLocalstorageValue(browser, key) {
  return browser.executeScript(`return window.localStorage.getItem('${key}');`);
}

module.exports.waitUntilURLContains = waitUntilURLContains;
module.exports.waitUntilURLIsLoaded = waitUntilURLIsLoaded;
module.exports.getLocalstorageValue = getLocalstorageValue;