'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _DOMHelper = require('../helpers/DOMHelper');

var _DOMHelper2 = _interopRequireDefault(_DOMHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var style = {
    'outer': 'ScrollArea__outer___37v-o',
    'overflow': 'ScrollArea__overflow___3EGck',
    'inner': 'ScrollArea__inner___34zZx',
    'track': 'ScrollArea__track___1Rpps',
    'handler': 'ScrollArea__handler___hkHU7',
    'handlerHover': 'ScrollArea__handlerHover___coLlQ',
    'handlerIsDragging': 'ScrollArea__handlerIsDragging___34UZt',
    'trackHidden': 'ScrollArea__trackHidden_____l1I'
};

var ScrollArea = function (_Component) {
    _inherits(ScrollArea, _Component);

    function ScrollArea(props) {
        _classCallCheck(this, ScrollArea);

        var _this = _possibleConstructorReturn(this, (ScrollArea.__proto__ || Object.getPrototypeOf(ScrollArea)).call(this, props));

        _this.state = {
            trackActive: props.trackVisible,
            trackHandlerHeight: 0,
            innerMargin: -1,
            innerHeight: 0,
            outerHeight: 0,
            isDragging: false
        };
        return _this;
    }

    _createClass(ScrollArea, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.onResize(true);
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            if (this.getInnerHeight() !== this.getInnerHeight(true)) {
                this.onResize();
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            clearTimeout(this.scrollTrackVisibleTimeout);
        }
    }, {
        key: 'getOuterHeight',
        value: function getOuterHeight() {
            var fromState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (fromState) {
                return this.state.outerHeight;
            }

            if (process.env.NODE_ENV === 'testing') {
                return parseInt(this.props.height || 0, 10);
            }

            return parseInt(this.props.height || this.refs['outer'].offsetHeight, 10);
        }
    }, {
        key: 'getInnerHeight',
        value: function getInnerHeight() {
            var fromState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (fromState) {
                return this.state.innerHeight;
            }

            if (process.env.NODE_ENV === 'testing') {
                return this.props.testInnerHeight;
            }

            return this.refs['inner'].offsetHeight;
        }
    }, {
        key: 'getTrackHeight',
        value: function getTrackHeight() {
            var fromState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            return this.getOuterHeight(fromState) - this.props.handlerMargin;
        }
    }, {
        key: 'getTrackHandlerRatio',
        value: function getTrackHandlerRatio() {
            var fromState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            var innerHeight = this.getInnerHeight(fromState),
                trackHeight = this.getTrackHeight(fromState);

            if (!innerHeight || !trackHeight) {
                return 0;
            }

            return innerHeight / trackHeight;
        }
    }, {
        key: 'getTrackHandlerHeight',
        value: function getTrackHandlerHeight(trackHeight) {
            if (!trackHeight) {
                return 0;
            }

            return Math.max(this.props.minHandlerHeight, Math.round(trackHeight / this.getTrackHandlerRatio()));
        }
    }, {
        key: 'getTrackHandlerTop',
        value: function getTrackHandlerTop() {
            var scrollTop = this.getScrollTop(),
                innerHeight = this.getInnerHeight(true),
                trackHeight = this.getTrackHeight(true),
                trackHandlerHeight = this.getTrackHandlerHeight(trackHeight);

            if (trackHandlerHeight === this.props.minHandlerHeight) {
                return (trackHeight - trackHandlerHeight) * (scrollTop / (innerHeight - trackHeight));
            }

            if (!scrollTop) {
                return 0;
            }

            return Math.round(scrollTop / this.getTrackHandlerRatio());
        }
    }, {
        key: 'getInnerMargin',
        value: function getInnerMargin() {
            var outer = this.refs['outer'],
                inner = this.refs['inner'];

            if (!inner.offsetWidth || !outer.offsetWidth) {
                return -1;
            }

            return inner.offsetWidth - outer.offsetWidth - 1;
        }
    }, {
        key: 'getScrollTop',
        value: function getScrollTop() {
            return this.refs['overflow'] && this.refs['overflow'].scrollTop || 0;
        }
    }, {
        key: 'onMouseWheel',
        value: function onMouseWheel(event) {
            var scrollTop = this.getScrollTop(),
                innerHeight = this.getInnerHeight(),
                outerHeight = this.getOuterHeight();

            if (!_DOMHelper2.default.isChildOf(event.target, this.refs['outer'], true)) {
                return;
            }

            if (event.deltaY > 0 && scrollTop >= innerHeight - outerHeight || event.deltaY < 0 && scrollTop === 0) {
                event.stopPropagation();
                event.preventDefault();
                return;
            }
        }
    }, {
        key: 'onResize',
        value: function onResize() {
            var fromMount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            var outerHeight = this.getOuterHeight(),
                trackHandlerHeight = this.getTrackHandlerHeight(outerHeight),
                state = {
                innerHeight: this.getInnerHeight(),
                trackHandlerHeight: trackHandlerHeight,
                outerHeight: outerHeight
            };

            if (this.state.innerMargin === -1) {
                state.innerMargin = this.getInnerMargin();
            }

            this.setState(state);
        }
    }, {
        key: 'onScroll',
        value: function onScroll() {
            if (this.props.onScroll) {
                var data = {
                    scrollTop: this.getScrollTop(),
                    innerHeight: this.getInnerHeight(),
                    outerHeight: this.getOuterHeight()
                };
                data.complete = (data.scrollTop + data.outerHeight) / data.innerHeight;

                this.props.onScroll(data, this);
            }

            this.forceUpdate();
        }
    }, {
        key: 'onTrackHandlerDragging',
        value: function onTrackHandlerDragging(offsetY) {
            this.refs['overflow'].scrollTop = offsetY * this.getTrackHandlerRatio(true);
        }
    }, {
        key: 'onMouseEnter',
        value: function onMouseEnter() {
            if (this.props.trackHidden || this.props.trackVisible || this.getOuterHeight(true) >= this.getInnerHeight(true)) {
                return;
            }

            clearTimeout(this.scrollTrackVisibleTimeout);
            this.setState({ trackActive: true });
        }
    }, {
        key: 'onMouseLeave',
        value: function onMouseLeave() {
            var _this2 = this;

            if (this.props.trackHidden || this.props.trackVisible || this.getOuterHeight(true) >= this.getInnerHeight(true)) {
                return;
            }

            if (!this.props.trackHideTime) {
                this.setState({ trackActive: false });
                return;
            }

            this.scrollTrackVisibleTimeout = _lodash2.default.delay(function () {
                _this2.setState({ trackActive: false });
            }, this.props.trackHideTime);
        }
    }, {
        key: 'onMouseDown',
        value: function onMouseDown(event) {
            var handlerPosition = _DOMHelper2.default.position(this.refs['handler']),
                handlerOffset = _DOMHelper2.default.offset(this.refs['handler']),
                originalY = handlerPosition.top,
                startY = event.pageY;

            if (event.pageX < handlerOffset.left) {
                return;
            }

            this.setState({
                isDragging: true,
                startY: startY, originalY: originalY
            });

            this.onMouseMoveFn = this.onMouseMove.bind(this);
            this.onMouseUpFn = this.onMouseUp.bind(this);
            window.addEventListener('mousemove', this.onMouseMoveFn, false);
            window.addEventListener('mouseup', this.onMouseUpFn, false);
        }
    }, {
        key: 'onMouseUp',
        value: function onMouseUp() {
            this.setState({
                isDragging: false,
                handlerHover: false
            });

            _DOMHelper2.default.ignoreSelection();

            window.removeEventListener('mouseup', this.onMouseUpFn);
            window.removeEventListener('mousemove', this.onMouseMoveFn);
        }
    }, {
        key: 'onMouseMove',
        value: function onMouseMove(event) {
            if (!this.state.isDragging) {
                return;
            }

            var deltaY = event.pageY - this.state.startY,
                offsetY = this.state.originalY + deltaY;

            _DOMHelper2.default.ignoreSelection();
            this.onTrackHandlerDragging(offsetY);
        }
    }, {
        key: 'onMouseMoveHover',
        value: function onMouseMoveHover(event) {
            if (this.state.isDragging) {
                return;
            }

            var handlerOffset = _DOMHelper2.default.offset(this.refs['handler']),
                handlerHover = false;

            if (event.pageX > handlerOffset.left) {
                handlerHover = true;
            }

            this.setState({ handlerHover: handlerHover });
        }
    }, {
        key: 'triggerScroll',
        value: function triggerScroll() {
            this.onScroll();
        }
    }, {
        key: 'getTrackClassNames',
        value: function getTrackClassNames() {
            var classNames = [style.track];

            if (!this.state.trackActive) {
                classNames.push(style.trackHidden);
            }

            return classNames.join(' ');
        }
    }, {
        key: 'getHandleClassNames',
        value: function getHandleClassNames() {
            var classNames = [style.handler];

            if (this.state.isDragging) {
                classNames.push(style.handlerIsDragging);
            }

            if (this.state.handlerHover) {
                classNames.push(style.handlerHover);
            }

            return classNames.join(' ');
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                {
                    ref: 'outer',
                    style: {
                        width: this.props.width,
                        height: this.props.height
                    },
                    className: style.outer,
                    onMouseEnter: this.onMouseEnter.bind(this),
                    onMouseLeave: this.onMouseLeave.bind(this),
                    onMouseDown: this.onMouseDown.bind(this),
                    onMouseMove: this.onMouseMoveHover.bind(this)
                },
                _react2.default.createElement(
                    'div',
                    {
                        ref: 'overflow',
                        className: style.overflow,
                        onScroll: this.onScroll.bind(this),
                        onWheel: this.onMouseWheel.bind(this)
                    },
                    _react2.default.createElement(
                        'div',
                        {
                            ref: 'inner',
                            className: style.inner,
                            style: { marginRight: this.state.innerMargin }
                        },
                        this.props.children
                    )
                ),
                _react2.default.createElement(
                    'div',
                    {
                        ref: 'track',
                        className: this.getTrackClassNames()
                    },
                    _react2.default.createElement('div', {
                        ref: 'handler',
                        className: this.getHandleClassNames(),
                        style: {
                            height: this.state.trackHandlerHeight,
                            top: this.getTrackHandlerTop()
                        }
                    })
                )
            );
        }
    }]);

    return ScrollArea;
}(_react.Component);

ScrollArea.propTypes = {
    width: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
    height: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
    trackHidden: _propTypes2.default.bool,
    trackHideTime: _propTypes2.default.number,
    minHandlerHeight: _propTypes2.default.number,
    handlerMargin: _propTypes2.default.number,
    onScroll: _propTypes2.default.func,

    //for testing purpose
    testInnerHeight: _propTypes2.default.number
};
ScrollArea.defaultProps = {
    trackVisible: false,
    trackHidden: false,
    trackHideTime: 1000,
    minHandlerHeight: 70,
    handlerMargin: 4,

    //for testing purpose
    testInnerHeight: 0
};
exports.default = ScrollArea;