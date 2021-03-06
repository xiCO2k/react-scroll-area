function position(elem) {
    if (!elem) {
        return;
    }

    return {
        left: elem.offsetLeft,
        top: elem.offsetTop
    };
}

function offset(elem) {
    let docElem, rect;

    if (!elem) {
        return {};
    }

    rect = elem.getBoundingClientRect();

    // Make sure element is not hidden (display: none) or disconnected
    if ( rect.width || rect.height || elem.getClientRects().length ) {
        docElem = elem.ownerDocument.documentElement;

        return {
            top: rect.top + window.pageYOffset - docElem.clientTop,
            left: rect.left + window.pageXOffset - docElem.clientLeft
        };
    }

    return {};
}

/**
  *  Check if ChildNode is a child of the parentNode
  *  @param DOMNode child
  *  @param DOMNode parent
  *  @param boolean checkEqual if true it will compare if the child is the same as the parent
  *  @return boolean
 */
function isChildOf(child, parent, checkEqual = false) {
    let found = false;

    if (!(parent instanceof NodeList)) {
        parent = [parent];
    }

    for (let i; i < parent.length; i++) {
        let _child = child;

        if (found) break;
        if (checkEqual && _child === parent[i]) continue;

        while ((_child = _child.parentNode) && _child !== parent[i]);
        found = !!_child;
    }

    return found;
}

function ignoreSelection() {
    if (document.selection) {
        document.selection.empty();
        return;
    }

    if (window.getSelection) {
        window.getSelection().removeAllRanges();
    }
}

function getHeight(elem, defaultValue = 0) {
    return elem && elem.offsetHeight || defaultValue;
}

function getWidth(elem, defaultValue = 0) {
    return elem && elem.offsetHeight || defaultValue;
}

function scrollTo(element, to, duration) {
    if (duration <= 0) return;

    let difference = to - element.scrollTop,
        perTick = difference / duration * 10;

    setTimeout(() => {
        element.scrollTop = element.scrollTop + perTick;
        if (element.scrollTop === to) return;
        scrollTo(element, to, duration - 10);
    }, 10);
}

export default { offset, position, isChildOf, ignoreSelection, getHeight, getWidth, scrollTo };
