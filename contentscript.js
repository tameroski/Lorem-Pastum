'use strict';

/**
 * Insert text using a custom event.
 */
function insertText(text) {

    var el = document.activeElement;

    var event = new CustomEvent(
        "pastingLorem", 
        {
            detail: {
                text: text
            },
            bubbles: true,
            cancelable: true
        }
    );

    el.addEventListener("pastingLorem", function(e){
        insertAtCaret(e.target, e.detail.text);
    });

    el.focus();
    el.dispatchEvent(event);
}

/**
 * Adding the message listener.
 */
chrome.runtime.onMessage.addListener(function(request) {
    if (request.type === 'paste') {
        insertText(request.data);
    }
});

/**
 * Helper function for dealing with textareas and pre-filled fields
 */
function insertAtCaret(element, text) {
    var supportedInputTypes = ['password', 'search', 'text'];

    if (element.tagName.toLowerCase() === 'textarea' || inArray(element.type.toLowerCase(), supportedInputTypes)){
        var scrollPos = element.scrollTop;
        var caretPos = element.selectionStart;

        var front = (element.value).substring(0, caretPos);
        var back = (element.value).substring(element.selectionEnd, element.value.length);
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
function inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}