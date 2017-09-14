'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ScrollArea = require('../ScrollArea');

var _ScrollArea2 = _interopRequireDefault(_ScrollArea);

var _enzyme = require('enzyme');

var _reactTestRenderer = require('react-test-renderer');

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import jsdom from 'jsdom'

// const doc = new jsdom.JSDOM('<!doctype html><html><body></body></html>')
// const win = doc.defaultView

// global.document = doc
// global.window = win

// propagateToGlobal(win)

// function propagateToGlobal (window) {
//   for (let key in window) {
//     if (!window.hasOwnProperty(key)) continue
//     if (key in global) continue

//     global[key] = window[key]
//   }
// }

it('renders correctly', function () {
    var comp = (0, _enzyme.shallow)(_react2.default.createElement(
        _ScrollArea2.default,
        null,
        'Analytcs'
    ));

    expect(comp).toMatchSnapshot();
});

// it('should have the same width and height of the parent DOM', () => {
//     expect(true).toEqual(true);
// });

// it('shows the scroll track when mouse enter', () => {
//     expect(true).toEqual(true);
// });

// it('should not show the track when mouse enter when the props.trackHidden is true', () => {
//     expect(true).toEqual(true);
// });

// it('should change the class to handlerHover when the scroll handler is hovered', () => {
//     expect(true).toEqual(true);
// });