'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
    it('calls the callback props.onScroll', function () {
        var props = { onScroll: jest.fn(), testInnerHeight: 200 },
            wrapper = (0, _enzyme.mount)(_react2.default.createElement(_ScrollArea2.default, props));

        wrapper.instance().triggerScroll();

        expect(props.onScroll).toHaveBeenCalledTimes(1);
    });

    it('should scroll to bottom when the goToBottom() is called', function () {
        var props = {
            width: '100px',
            height: '100px',
            testInnerHeight: 200
        },
            bottomPos = props.testInnerHeight - parseInt(props.height, 10),
            wrapper = (0, _enzyme.mount)(_react2.default.createElement(_ScrollArea2.default, props));

        jest.useFakeTimers();

        wrapper.instance().goToBottom();
        expect(wrapper.ref('overflow').getNode().scrollTop).toBe(bottomPos);

        wrapper.ref('overflow').getNode().scrollTop = 0;
        wrapper.instance().goToBottom(400);

        jest.runTimersToTime(400);

        expect(wrapper.ref('overflow').getNode().scrollTop).toBe(bottomPos);
    });

    it('should scroll to top when the goToTop() is called', function () {
        var props = {
            width: '100px',
            height: '100px',
            testInnerHeight: 200,
            minHandlerHeight: 1,
            handlerMargin: 0
        },
            bottomPos = props.testInnerHeight - parseInt(props.height, 10),
            wrapper = (0, _enzyme.mount)(_react2.default.createElement(_ScrollArea2.default, props));

        jest.useFakeTimers();

        wrapper.ref('overflow').getNode().scrollTop = 100;
        wrapper.instance().triggerScroll().goToTop();

        expect(wrapper.ref('overflow').getNode().scrollTop).toBe(0);

        wrapper.ref('overflow').getNode().scrollTop = 100;
        wrapper.instance().triggerScroll().goToTop(400);

        jest.runTimersToTime(400);

        expect(wrapper.ref('overflow').getNode().scrollTop).toBe(0);
    });

    it('should scroll to "pos" when the goToPos() is called', function () {
        var props = {
            width: '100px',
            height: '100px',
            testInnerHeight: 200
        },
            bottomPos = props.testInnerHeight - parseInt(props.height, 10),
            wrapper = (0, _enzyme.mount)(_react2.default.createElement(_ScrollArea2.default, props));

        jest.useFakeTimers();

        wrapper.instance().goToPos(100);
        expect(wrapper.ref('overflow').getNode().scrollTop).toBe(100);

        wrapper.instance().goToPos(50, 400);

        jest.runTimersToTime(400);

        expect(wrapper.ref('overflow').getNode().scrollTop).toBe(50);
    });

    describe('track', function () {
        it('should not show if the "outer" is >= than the "inner"', function () {
            var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_ScrollArea2.default, null));

            expect(wrapper.state('trackActive')).toBe(false);

            wrapper.instance().onMouseEnter();

            expect(wrapper.state('trackActive')).toBe(false);
        });

        it('shows when mouse enter', function () {
            var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_ScrollArea2.default, {
                width: '100px',
                height: '100px',
                testInnerHeight: 200
            }));

            expect(wrapper.state('trackActive')).toBe(false);

            wrapper.instance().onMouseEnter();

            expect(wrapper.state('trackActive')).toBe(true);
        });

        it('checks if is hidden after props.trackHideTime', function () {
            var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_ScrollArea2.default, {
                width: '100px',
                height: '100px',
                testInnerHeight: 200,
                trackHideTime: 100
            }));

            jest.useFakeTimers();

            expect(wrapper.state('trackActive')).toBe(false);

            wrapper.instance().onMouseEnter();
            expect(wrapper.state('trackActive')).toBe(true);

            wrapper.instance().onMouseLeave();
            jest.runTimersToTime(100);
            expect(wrapper.state('trackActive')).toBe(false);
        });

        it('should not hide if isDragging is true', function () {
            var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_ScrollArea2.default, {
                width: '100px',
                height: '100px',
                testInnerHeight: 200,
                trackHideTime: 0
            }));

            //Sets isDragging to True
            wrapper.instance().onMouseEnter();
            wrapper.instance().onMouseMoveHover({ pageX: 96 });
            wrapper.instance().onMouseDown({ pageX: 96 });
            wrapper.instance().onMouseLeave();

            expect(wrapper.state('trackActive')).toBe(true);
        });

        it('not show when mouseEnter if the props.trackHidden is true', function () {
            var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_ScrollArea2.default, {
                width: '100px',
                height: '100px',
                testInnerHeight: 200,
                trackHidden: true
            }));

            expect(wrapper.state('trackActive')).toBe(false);

            wrapper.instance().onMouseEnter();

            expect(wrapper.state('trackActive')).toBe(false);
        });

        it('checks if is always visible if the props.trackVisible is true', function () {
            var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_ScrollArea2.default, {
                trackVisible: true,
                trackHideTime: 0
            }));

            expect(wrapper.state('trackActive')).toBe(true);

            wrapper.instance().onMouseEnter();
            wrapper.instance().onMouseLeave();

            expect(wrapper.state('trackActive')).toBe(true);
        });

        it('checks if the handle works when scrolling if props.trackVisible is true', function () {
            var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_ScrollArea2.default, {
                width: '100px',
                height: '100px',
                testInnerHeight: 200,
                trackVisible: true,
                trackHideTime: 0,
                minHandlerHeight: 1,
                handlerMargin: 0
            }));

            wrapper.instance().goToBottom();
            wrapper.instance().triggerScroll();
            expect(wrapper.ref('handler').getNode().style.top).toBe('50px');
        });
    });

    describe('handler', function () {
        var props = {
            width: '100px',
            height: '100px',
            testInnerHeight: 200
        };

        it('sets "handlerHover: true" when the area is hovered', function () {
            var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_ScrollArea2.default, props));

            wrapper.instance().onMouseEnter();
            wrapper.instance().onMouseMoveHover({ pageX: 96 });
            expect(wrapper.state("handlerHover")).toBe(true);
        });

        it('sets "isDragging: true" when the area is onMouseDown()', function () {
            var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_ScrollArea2.default, props));

            wrapper.instance().onMouseEnter();
            wrapper.instance().onMouseMoveHover({ pageX: 96 });
            wrapper.instance().onMouseDown({ pageX: 96 });
            expect(wrapper.state("isDragging")).toBe(true);
        });

        it('not sets "isDragging: true" when the area is onMouseDown() if track is not visible', function () {
            var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_ScrollArea2.default, props));

            wrapper.instance().onMouseDown({ pageX: 96 });
            expect(wrapper.state("isDragging")).toBe(false);
        });

        it('changes the scrollTop when isDragging', function () {
            var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_ScrollArea2.default, props));

            wrapper.instance().onMouseEnter();
            wrapper.instance().onMouseMoveHover({ pageX: 96 });
            wrapper.instance().onMouseDown({ pageX: 96, pageY: 0 });
            wrapper.instance().onMouseMoveFn({ pageY: 10 });
            expect(wrapper.ref('overflow').getNode().scrollTop).toBe(20);

            wrapper.instance().onMouseMoveFn({ pageY: 5 });
            expect(wrapper.ref('overflow').getNode().scrollTop).toBe(10);

            //Test the minimum
            wrapper.instance().onMouseMoveFn({ pageY: -2 });
            expect(wrapper.ref('overflow').getNode().scrollTop).toBe(0);

            //Test the maximum
            wrapper.instance().onMouseMoveFn({ pageY: 10000 });
            expect(wrapper.ref('overflow').getNode().scrollTop).toBe(props.testInnerHeight - parseInt(props.height, 10));
        });

        it('hides track when onMouseUp on window if isDragging is true', function () {
            var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_ScrollArea2.default, _extends({}, props, { trackHideTime: 0 })));

            wrapper.instance().onMouseEnter();
            wrapper.instance().onMouseMoveHover({ pageX: 96 });
            wrapper.instance().onMouseDown({ pageX: 96 });
            wrapper.instance().onMouseLeave();
            wrapper.instance().onMouseUpFn({ target: window });

            expect(wrapper.state("trackActive")).toBe(false);
        });

        it('should not hide track when onMouseUp on window with "isDragging: true" if trackVisible is true', function () {
            var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_ScrollArea2.default, _extends({}, props, { trackVisible: true, trackHideTime: 0 })));

            wrapper.instance().onMouseEnter();
            wrapper.instance().onMouseMoveHover({ pageX: 96 });
            wrapper.instance().onMouseDown({ pageX: 96 });
            wrapper.instance().onMouseLeave();
            wrapper.instance().onMouseUpFn({ target: window });

            expect(wrapper.state("trackActive")).toBe(true);
        });

        it('changes the top after scrolling', function () {
            var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_ScrollArea2.default, props));

            wrapper.ref('overflow').getNode().scrollTop = 100;
            wrapper.instance().onScroll();

            expect(wrapper.ref('handler').getNode().style.top).toBe("25px");

            wrapper.ref('overflow').getNode().scrollTop = 0;
            wrapper.instance().onScroll();

            expect(wrapper.ref('handler').getNode().style.top).toBe("0px");
        });

        it('has the right height based on the inner height', function () {
            var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_ScrollArea2.default, _extends({}, props, {
                testInnerHeight: 100,
                handlerMargin: 0
            })));

            expect(wrapper.ref('handler').getNode().style.height).toBe(props.height);
        });

        it('can not have more height than the track height', function () {
            var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_ScrollArea2.default, _extends({}, props, {
                testInnerHeight: 1,
                handlerMargin: 0
            })));

            expect(wrapper.ref('handler').getNode().style.height).toBe(props.height);
        });

        it('subtracts the height if the props.handlerMargin has value', function () {
            var margin = 10,
                wrapper = (0, _enzyme.mount)(_react2.default.createElement(_ScrollArea2.default, _extends({}, props, {
                testInnerHeight: 100,
                handlerMargin: margin
            })));

            expect(wrapper.ref('handler').getNode().style.height).toBe(100 - margin + "px");
        });

        it('limits the minimum height to the value props.minHandlerHeight', function () {
            var minHandlerHeight = 90,
                wrapper = (0, _enzyme.mount)(_react2.default.createElement(_ScrollArea2.default, _extends({}, props, {
                testInnerHeight: 1000,
                handlerMargin: 0,
                minHandlerHeight: minHandlerHeight
            })));

            expect(wrapper.ref('handler').getNode().style.height).toBe(minHandlerHeight + "px");
        });

        it('not limits the minimum height to the value props.minHandlerHeight if its bigger than the outer height', function () {
            var minHandlerHeight = 101,
                wrapper = (0, _enzyme.mount)(_react2.default.createElement(_ScrollArea2.default, _extends({}, props, {
                testInnerHeight: 1000,
                handlerMargin: 0,
                minHandlerHeight: minHandlerHeight
            })));

            expect(wrapper.ref('handler').getNode().style.height).toBe("100px");
        });
    });
});