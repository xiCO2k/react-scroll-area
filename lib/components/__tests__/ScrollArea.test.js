'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ScrollArea = require('../ScrollArea');

var _ScrollArea2 = _interopRequireDefault(_ScrollArea);

var _enzyme = require('enzyme');

var _reactTestRenderer = require('react-test-renderer');

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

it('renders correctly', function () {
    var wrapper = (0, _enzyme.shallow)(_react2.default.createElement(
        _ScrollArea2.default,
        null,
        'Lorem Ipsum'
    ));

    expect(wrapper).toMatchSnapshot();
});

it('shows the scroll track when mouse enter', function () {
    var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_ScrollArea2.default, null));

    expect(wrapper.state('trackVisible')).toEqual(false);

    wrapper.instance().onMouseEnter();

    expect(wrapper.state('trackVisible')).toEqual(true);
});

it('should not show the track when mouse enter when the props.trackHidden is true', function () {
    var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_ScrollArea2.default, { trackHidden: true }));

    expect(wrapper.state('trackVisible')).toEqual(false);

    wrapper.instance().onMouseEnter();

    expect(wrapper.state('trackVisible')).toEqual(false);
});

it('should call the callback props.onScroll when scrolling if its a prop', function (done) {
    var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_ScrollArea2.default, { onScroll: function onScroll() {
            return done();
        } }));
    wrapper.instance().triggerScroll();
});