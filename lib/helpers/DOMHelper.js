'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    var docElem = void 0,
        rect = void 0;

    if (!elem) {
        return {};
    }

    rect = elem.getBoundingClientRect();

    // Make sure element is not hidden (display: none) or disconnected
    if (rect.width || rect.height || elem.getClientRects().length) {
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
function isChildOf(child, parent) {
    var checkEqual = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var found = false;

    if (!(parent instanceof NodeList)) {
        parent = [parent];
    }

    _lodash2.default.each(parent, function (_parent) {
        var _child = child;

        if (found) return false;
        if (checkEqual && _child === _parent) return true;

        while ((_child = _child.parentNode) && _child !== _parent) {}
        found = !!_child;
    });

    return found;
}

function ignoreSelection() {
    if (document.selection) {
        document.selection.empty();
    } else {
        window.getSelection().removeAllRanges();
    }
}

function getHeight(elem) {
    var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    return elem && elem.offsetHeight || defaultValue;
}

function getWidth(elem) {
    var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    return elem && elem.offsetHeight || defaultValue;
}

exports.default = { offset: offset, position: position, isChildOf: isChildOf, ignoreSelection: ignoreSelection, getHeight: getHeight, getWidth: getWidth };