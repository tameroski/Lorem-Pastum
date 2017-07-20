'use strict';

/**
 * Send the value that should be pasted to the content script.
 */
let sendPasteToContentScript = toBePasted => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {type: 'paste', data: toBePasted}
        );
    });
}

/**
 * The function that will handle our context menu clicks.
 */
let onClickHandler = (info, tab) => {
    if (info.menuItemId === 'loremPastum-short') {
        sendPasteToContentScript('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
    }else if (info.menuItemId === 'loremPastum-medium') {
    	sendPasteToContentScript('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. ');
    }else if (info.menuItemId === 'loremPastum-large') {
    	sendPasteToContentScript('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
    }
}

// Register the click handler for our context menu.
chrome.contextMenus.onClicked.addListener(onClickHandler);

// Set up the context menu items
chrome.runtime.onInstalled.addListener((details) => {
    let parentItem = chrome.contextMenus.create({
        'title': chrome.i18n.getMessage('menuName'),
        'id': 'loremPastum',
        'contexts': ['editable']
	});
    chrome.contextMenus.create({
        'title': chrome.i18n.getMessage('menuItemShortPaste'),
        'id': 'loremPastum-short',
        'contexts': ['editable'],
        'parentId': parentItem
	});
    chrome.contextMenus.create({
        'title': chrome.i18n.getMessage('menuItemMediumPaste'),
        'id': 'loremPastum-medium',
        'contexts': ['editable'],
        'parentId': parentItem
	});
    chrome.contextMenus.create({
        'title': chrome.i18n.getMessage('menuItemLargePaste'),
        'id': 'loremPastum-large',
        'contexts': ['editable'],
        'parentId': parentItem
	});
});