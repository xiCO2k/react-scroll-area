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

  // if (parent) {
  //   parent = [parent];
  // }

  _.each(parent, (_parent) => {
    if (found) {
      return false;
    }

    let _child = child;

    if(checkEqual && _child === _parent) return true;
    while ((_child = _child.parentNode) && _child !== _parent);
    found = !!_child;
  });

  return found;
}

export default { offset, position, isChildOf };
