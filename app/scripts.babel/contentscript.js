'use strict';

/**
 * Insert text using a custom event.
 */
let insertText = text => {

    var el = document.activeElement;

    let event = new CustomEvent(
        'pastingLorem', {
            detail: {
                text: text
            },
            bubbles: true,
            cancelable: true
        }
    );

    el.addEventListener('pastingLorem', function(e){
        insertAtCaret(e.target, e.detail.text);
    });

    el.focus();
    el.dispatchEvent(event);
}

/**
 * Adding the message listener.
 */
chrome.runtime.onMessage.addListener((request) => {
    if (request.type === 'paste') {
        insertText(request.data);
    }
});

/**
 * Helper function for dealing with textareas and pre-filled fields
 */
let insertAtCaret = (element, text) => {
    let supportedInputTypes = ['password', 'search', 'text'];

    if (element.tagName.toLowerCase() === 'textarea' || inArray(element.type.toLowerCase(), supportedInputTypes)){
        let scrollPos = element.scrollTop;
        var caretPos = element.selectionStart;

        let front = (element.value).substring(0, caretPos);
        let back = (element.value).substring(element.selectionEnd, element.value.length);
        element.value = front + text + back;
        caretPos = caretPos + text.length;
        element.selectionStart = caretPos;
        element.selectionEnd = caretPos;
        element.focus();
        element.scrollTop = scrollPos;
    }else{
        element.value = text;
    }
}

/**
 * Array helper
 */
let inArray = (needle, haystack) => {
    for(var i = 0; i < haystack.length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}