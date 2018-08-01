chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.storage.local.get(function(result) {
    var index = tab.index + 1;
    chrome.tabs.create({'url': result.orig_id, 'index': index});
  })
});

chrome.tabs.onCreated.addListener(function(tab) {
  // send a message to original tab
  chrome.tabs.query({active: true, lastFocusedWindow: true},
    function(tabs) {
      originalTab = tabs[0];
      orig_url = originalTab.url;
      orig_id = tab.id;
      chrome.storage.local.set({orig_id: orig_url})
  })
});
