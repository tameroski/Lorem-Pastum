'use strict';

/**
 * Retrieve the current content of the system clipboard.
 */
function getContentFromClipboard() {
    var result = '';
    var temp = document.getElementById('temp');
    temp.value = '';
    temp.select();
    if (document.execCommand('paste')) {
        result = temp.value;
        console.log('got value from temp field: ' + result);
    }
    temp.value = '';
    return result;
}

/**
 * Send the value that should be pasted to the content script.
 */
function sendPasteToContentScript(toBePasted) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {type: 'paste', data: toBePasted}
        );
    });
}

/**
 * The function that will handle our context menu clicks.
 */
function onClickHandler(info, tab) {
    if (info.menuItemId === 'loremPastum') {
        sendPasteToContentScript('Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.');
    }
}

// Register the click handler for our context menu.
chrome.contextMenus.onClicked.addListener(onClickHandler);

// Set up the context menu items
chrome.runtime.onInstalled.addListener(function(details) {
    chrome.contextMenus.create(
        {
            'title': 'Paste Lorem Ipsum',
            'id': 'loremPastum',
            'contexts': ['editable']
        });
});