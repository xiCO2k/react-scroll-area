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
});

describe('interaction', function () {
    it('shows the scroll track when mouse enter', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_ScrollArea2.default, null));

        expect(wrapper.state('trackVisible')).toEqual(false);

        wrapper.instance().onMouseEnter();

        expect(wrapper.state('trackVisible')).toEqual(true);
    });

    it('not show the track when mouseEnter if the props.trackHidden is true', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_ScrollArea2.default, { trackHidden: true }));

        expect(wrapper.state('trackVisible')).toEqual(false);

        wrapper.instance().onMouseEnter();

        expect(wrapper.state('trackVisible')).toEqual(false);
    });

    it('should call the callback props.onScroll when scrolling if its a prop', function () {
        var props = { onScroll: jest.fn() },
            wrapper = (0, _enzyme.mount)(_react2.default.createElement(_ScrollArea2.default, props));

        wrapper.instance().triggerScroll();

        expect(props.onScroll).toHaveBeenCalledTimes(1);
    });
});