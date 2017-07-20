'use strict';

/**
 * Adding the message listener.
 */
chrome.runtime.onMessage.addListener((request) => {
    if (request.type == 'paste') {
        insertText(request.data);
    }
});

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

    el.addEventListener('pastingLorem', insertTextHandler);
    el.focus();
    el.dispatchEvent(event);
    el.removeEventListener('pastingLorem', insertTextHandler);
}

/**
 * Helper function for dealing with textareas and pre-filled fields
 */
let insertTextHandler = (event) => {
    let element = event.target;
    let text = event.detail.text;
    let supportedInputTypes = ['password', 'search', 'text'];

    if ( element.tagName.toLowerCase() == 'input' && inArray(element.type.toLowerCase(), supportedInputTypes) || element.tagName.toLowerCase() == 'textarea' ){
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
    }else if (element.tagName.toLowerCase() == 'iframe'){
        // Javascript editors
        let frameContent = element.contentDocument || element.contentWindow.document;
        let els = frameContent.querySelectorAll('body');
        if (els.length > 0){
            var body = els[0];

            // CKEditor
            if (element.hasAttribute('class') && element.getAttribute('class') == 'cke_pasteframe'){
                body.innerHTML = text;
            }
            // TinyMCE
            else if (body.hasAttribute('id') && body.getAttribute('id') == 'tinymce'){
                body.appendChild(frameContent.createTextNode(text));

                // TODO : Use tinyMCE API
            }
        }
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