function addZhEnBreaks(node) {
    const skipTags = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'OBJECT'];

    if (skipTags.includes(node.nodeName)) {
        return;
    }
    if (node.nextSibling) {
        let lastChar = getLastChar(node);
        let firstCharNextSibling = getFirstChar(node.nextSibling);

        if (lastChar && firstCharNextSibling && isChinese(lastChar) !== isChinese(firstCharNextSibling)) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                node.insertAdjacentHTML('afterend', '<span class="zh-en-break"></span>');
            } else {
                let enzhBreak = document.createElement('span');
                enzhBreak.className = 'zh-en-break';
                node.parentNode.insertBefore(enzhBreak, node.nextSibling);
            }
        }
    }

    if (node.nodeType === Node.TEXT_NODE) {
        let textContent = Array.from(node.textContent);
        let newContent = '';
        for (let i = 0; i < textContent.length - 1; i++) {
            newContent += textContent[i];
            if (isChinese(textContent[i]) !== isChinese(textContent[i + 1])) {
                newContent += '<span class="zh-en-break"></span>';
            }
        }
        newContent += textContent[textContent.length - 1];
        node.textContent = '';
        let wrapper = document.createElement('span');
        wrapper.innerHTML = newContent;
        while (wrapper.firstChild) {
            node.parentNode.insertBefore(wrapper.firstChild, node);
        }
        node.remove();
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        let children = Array.from(node.childNodes);
        for (let i = 0; i < children.length; i++) {
            addZhEnBreaks(children[i]);
        }
    }
}

function isChinese(char) {
    return /[\u{3000}-\u{303F}\u{3040}-\u{309F}\u{30A0}-\u{30FF}\u{FF01}-\u{FF60}\u{FFE0}-\u{FFE6}\u{FF10}-\u{FF19}\u{FF21}-\u{FF3A}\u{FF41}-\u{FF5A}\u{4E00}-\u{9FFF}\u{AC00}-\u{D7A3}\u{3400}-\u{4DBF}\u{20000}-\u{2A6DF}\u{2A700}-\u{2B73F}\u{2B740}-\u{2B81F}\u{2B820}-\u{2CEAF}\u{2CEB0}-\u{2EBEF}\u{30000}-\u{3134F}\u{31350}-\u{323AF}\u{2EBF0}-\u{2EE5F}“‘’”]/u.test(char);
}

function getLastChar(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        let textArray = Array.from(node.textContent);
        return textArray[textArray.length - 1];
    } else if (node.nodeType === Node.ELEMENT_NODE && node.childNodes.length > 0) {
        return getLastChar(node.childNodes[node.childNodes.length - 1]);
    }
    return null;
}

function getFirstChar(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        let textArray = Array.from(node.textContent);
        return textArray[0];
    } else if (node.nodeType === Node.ELEMENT_NODE && node.childNodes.length > 0) {
        return getFirstChar(node.childNodes[0]);
    }
    return null;
}

document.addEventListener('DOMContentLoaded', function() {
  addZhEnBreaks(document.body)
});
