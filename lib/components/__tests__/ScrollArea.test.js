'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ScrollArea = require('../ScrollArea');

var _ScrollArea2 = _interopRequireDefault(_ScrollArea);

var _enzyme = require('enzyme');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('rendering', function () {
    it('renders correctly', function () {
        expect((0, _enzyme.shallow)(_react2.default.createElement(_ScrollArea2.default, null))).toMatchSnapshot();
    });

    it('has the width and height sent by the props', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_ScrollArea2.default, { width: '100px', height: '100px' })),
            style = wrapper.ref('outer').getNode().style;

        expect(style.width).toBe('100px');
        expect(style.height).toBe('100px');
    });
});

describe('interaction', function () {
    it('should not show the track if the "outer" is taller than the "inner"', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_ScrollArea2.default, null));

        expect(wrapper.state('trackActive')).toBe(false);

        wrapper.instance().onMouseEnter();

        expect(wrapper.state('trackActive')).toBe(false);
    });

    it('shows the scroll track when mouse enter', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_ScrollArea2.default, { width: '100px', height: '100px', testInnerHeight: 200 }));

        wrapper.instance().onResize();

        expect(wrapper.state('trackActive')).toBe(false);

        wrapper.instance().onMouseEnter();

        expect(wrapper.state('trackActive')).toBe(true);
    });

    it('checks if the track is hidden after props.trackHideTime', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_ScrollArea2.default, { trackHideTime: 100, width: '100px', height: '100px', testInnerHeight: 200 }));

        jest.useFakeTimers();

        expect(wrapper.state('trackActive')).toBe(false);

        wrapper.instance().onMouseEnter();
        expect(wrapper.state('trackActive')).toBe(true);

        wrapper.instance().onMouseLeave();
        jest.runTimersToTime(100);
        expect(wrapper.state('trackActive')).toBe(false);
    });

    it('not show the track when mouseEnter if the props.trackHidden is true', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_ScrollArea2.default, { width: '100px', height: '100px', testInnerHeight: 200, trackHidden: true }));

        expect(wrapper.state('trackActive')).toBe(false);

        wrapper.instance().onMouseEnter();

        expect(wrapper.state('trackActive')).toBe(false);
    });

    it('checks if the track is always visible', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_ScrollArea2.default, { trackVisible: true, trackHideTime: 0 }));

        expect(wrapper.state('trackActive')).toBe(true);

        wrapper.instance().onMouseEnter();
        wrapper.instance().onMouseLeave();

        expect(wrapper.state('trackActive')).toBe(true);
    });

    it('calls the callback props.onScroll', function () {
        var props = { onScroll: jest.fn() },
            wrapper = (0, _enzyme.mount)(_react2.default.createElement(_ScrollArea2.default, props));

        wrapper.instance().triggerScroll();

        expect(props.onScroll).toHaveBeenCalledTimes(1);
    });

    it('sets "handlerHover: true" when handler area is hovered');
    it('sets "isDragging: true" when handler area is onMouseDown');

    it('should scroll to bottom when the goToBottom() is called');
    it('should scroll to top when the goToTop() is called');
    it('should scroll to "pos" when the  goToPos() is called');
});