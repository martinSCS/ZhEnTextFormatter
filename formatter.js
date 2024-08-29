function addZhEnBreaks(node) {
    const skipTags = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'OBJECT', 'PRE', 'CODE'];

    if (skipTags.includes(node.nodeName)) {
        return;
    }
    if (node.classList) {
        if (node.classList.contains('no-zh-en-break')) {
            node.classList.remove('no-zh-en-break');
            if (node.classList.length === 0) {
                node.removeAttribute('class');
            }
            return;
        }
    }

    if (node.nextSibling && !isBlockElement(node) && !/^[\s\n]*$/.test(node.textContent)) {
        let lastChar = getLastChar(node);
        let firstCharNextSibling = getFirstChar(node.nextSibling);

        if (lastChar && firstCharNextSibling && isChinese(lastChar) !== isChinese(firstCharNextSibling)) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                node.insertAdjacentHTML('afterend', '<span class="zh-en-break"></span>');
            } else {
                let zhenBreak = document.createElement('span');
                zhenBreak.className = 'zh-en-break value';
                node.parentNode.insertBefore(zhenBreak, node.nextSibling);
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

function isBlockElement(node) {
    if (node.nodeType !== Node.ELEMENT_NODE) {
        return false;
    }
    const blockTags = ['DIV', 'P', 'SECTION', 'ARTICLE', 'HEADER', 'FOOTER', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'LI', 'TABLE', 'ASIDE', 'NAV', 'FIGURE', 'MAIN', 'FORM'];
    const display = window.getComputedStyle(node).display;

    return blockTags.includes(node.nodeName) ||
        display === 'block' ||
        display === 'flex' ||
        display === 'grid' ||
        display === 'table' ||
        display === 'list-item';
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

export default addZhEnBreaks;
