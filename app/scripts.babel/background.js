'use strict';

/**
 * Retrieve the current content of the system clipboard.
 */
let getContentFromClipboard = () => {
    var result = '';
    var temp = document.getElementById('temp');
    temp.value = '';
    temp.select();
    if (document.execCommand('paste')) {
        result = temp.value;
    }
    temp.value = '';
    return result;
}

/**
 * Send the value that should be pasted to the content script.
 */
let sendPasteToContentScript = toBePasted => {
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
let onClickHandler = (info, tab) => {
    if (info.menuItemId === 'loremPastum-short') {
        sendPasteToContentScript('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
    }else if (info.menuItemId === 'loremPastum-medium') {
    	sendPasteToContentScript('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. ');
    }else if (info.menuItemId === 'loremPastum-large') {
    	sendPasteToContentScript('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit. Ut velit mauris, egestas sed, gravida nec, ornare ut, mi. Aenean ut orci vel massa suscipit pulvinar. Nulla sollicitudin. Fusce varius, ligula non tempus aliquam, nunc turpis ullamcorper nibh, in tempus sapien eros vitae ligula.');
    }
}

// Register the click handler for our context menu.
chrome.contextMenus.onClicked.addListener(onClickHandler);

// Set up the context menu items
chrome.runtime.onInstalled.addListener((details) => {
    let parentItem = chrome.contextMenus.create({
        'title': 'Lorem Pastum',
        'id': 'loremPastum',
        'contexts': ['editable']
	});
    chrome.contextMenus.create({
        'title': 'Paste sentence',
        'id': 'loremPastum-short',
        'contexts': ['editable'],
        'parentId': parentItem
	});
    chrome.contextMenus.create({
        'title': 'Paste short paragraph',
        'id': 'loremPastum-medium',
        'contexts': ['editable'],
        'parentId': parentItem
	});
    chrome.contextMenus.create({
        'title': 'Paste long paragraph',
        'id': 'loremPastum-large',
        'contexts': ['editable'],
        'parentId': parentItem
	});
});