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

var _classname = require('classname');

var _classname2 = _interopRequireDefault(_classname);

var _DOMHelper = require('../helpers/DOMHelper');

var _DOMHelper2 = _interopRequireDefault(_DOMHelper);

var _Track = require('./Track');

var _Track2 = _interopRequireDefault(_Track);

var _Overflow = require('./Overflow');

var _Overflow2 = _interopRequireDefault(_Overflow);

var _Inner = require('./Inner');

var _Inner2 = _interopRequireDefault(_Inner);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var style = {
    'outer': 'ScrollArea__outer___37v-o',
    'overflow': 'ScrollArea__overflow___3EGck',
    'inner': 'ScrollArea__inner___34zZx'
};

var ScrollArea = function (_Component) {
    _inherits(ScrollArea, _Component);

    function ScrollArea(props) {
        _classCallCheck(this, ScrollArea);

        var _this = _possibleConstructorReturn(this, (ScrollArea.__proto__ || Object.getPrototypeOf(ScrollArea)).call(this, props));

        _this.state = {
            trackActive: props.trackVisible,
            innerMargin: -1,
            innerHeight: 0,
            outerHeight: 0,
            isDragging: false
        };

        _this.references = {};
        return _this;
    }

    _createClass(ScrollArea, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.validateProps(); //It throws
            this.onResize();
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            if (this.getInnerHeight() !== this.state.innerHeight) {
                this.onResize();
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            clearTimeout(this.scrollTrackVisibleTimeout);
        }
    }, {
        key: 'validateProps',
        value: function validateProps() {
            if (this.props.width && !/^([0-9]+)(%|px)?$/.test(this.props.width)) {
                throw new TypeError('Invalid width, must be a numeric or percentage.');
            }

            if (this.props.height && !/^([0-9]+)(%|px)?$/.test(this.props.height)) {
                throw new TypeError('Invalid height, must be a numeric or percentage.');
            }
        }
    }, {
        key: 'getOuterWidth',
        value: function getOuterWidth() {
            var width = this.props.width,
                isPercentage = /%/.test(width);

            if (isPercentage) {
                var percentage = parseInt(width, 10) / 100;

                return process.env.NODE_ENV === 'testing' ? this.props.testParentWidth * percentage : _DOMHelper2.default.getWidth(this.references.outer) * percentage;
            }

            return parseInt(this.props.width || _DOMHelper2.default.getWidth(this.references.outer) || 0, 10);
        }
    }, {
        key: 'getOuterHeight',
        value: function getOuterHeight() {
            var height = this.props.height,
                isPercentage = /%/.test(height);

            if (isPercentage) {
                var percentage = parseInt(height, 10) / 100;

                return process.env.NODE_ENV === 'testing' ? this.props.testParentHeight * percentage : _DOMHelper2.default.getHeight(this.references.outer) * percentage;
            }

            return parseInt(this.props.height || _DOMHelper2.default.getHeight(this.references.outer) || 0, 10);
        }
    }, {
        key: 'getInnerHeight',
        value: function getInnerHeight() {
            return process.env.NODE_ENV === 'testing' ? this.props.testInnerHeight : _DOMHelper2.default.getHeight(this.references.inner.node);
        }
    }, {
        key: 'getInnerMargin',
        value: function getInnerMargin() {
            var outer = this.references.outer,
                inner = this.references.inner.node;

            if (!inner.offsetWidth || !outer.offsetWidth) {
                return -1;
            }

            return inner.offsetWidth - outer.offsetWidth - 1;
        }
    }, {
        key: 'getScrollTop',
        value: function getScrollTop() {
            var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.references.overflow;

            return target && target.node.scrollTop || 0;
        }
    }, {
        key: 'isTrackNeedEvents',
        value: function isTrackNeedEvents() {
            return !this.props.trackHidden && !this.props.trackVisible && this.getInnerHeight() > this.state.outerHeight;
        }
    }, {
        key: 'onResize',
        value: function onResize() {
            var state = {
                innerHeight: this.getInnerHeight(),
                outerHeight: this.getOuterHeight()
            };

            if (this.state.innerMargin === -1) {
                state.innerMargin = this.getInnerMargin();
            }

            this.setState(state);
        }
    }, {
        key: 'onWheel',
        value: function onWheel(event) {
            var scrollTop = this.getScrollTop(),
                innerHeight = this.getInnerHeight(),
                outerHeight = this.getOuterHeight();

            if (!_DOMHelper2.default.isChildOf(event.target, this.references.outer, true)) {
                return;
            }

            if (event.deltaY > 0 && scrollTop >= innerHeight - outerHeight || event.deltaY < 0 && scrollTop === 0) {
                event.stopPropagation();
                event.preventDefault();
            }
        }
    }, {
        key: 'onScroll',
        value: function onScroll() {
            if (!this.isTrackNeedEvents()) {
                this.forceUpdate();
                return;
            }

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
        key: 'onMouseEnter',
        value: function onMouseEnter() {
            if (!this.isTrackNeedEvents()) {
                return;
            }

            clearTimeout(this.scrollTrackVisibleTimeout);
            this.setState({ trackActive: true });
        }
    }, {
        key: 'onMouseLeave',
        value: function onMouseLeave() {
            if (!this.isTrackNeedEvents() || this.state.isDragging) {
                return;
            }

            this.hideTrack();
        }
    }, {
        key: 'onMouseDown',
        value: function onMouseDown(event) {
            var offset = this.references.track.getOffset();

            if (event.pageX < offset.left || !this.state.trackHover) {
                return;
            }

            this.setState({
                isDragging: true,
                trackActive: !this.props.trackHidden,
                startY: event.pageY,
                originalY: this.references.track.getHeight() * (this.getScrollTop() / this.state.innerHeight)
            });

            this.onMouseMoveFn = this.onMouseMove.bind(this);
            this.onMouseUpFn = this.onMouseUp.bind(this);
            window.addEventListener('mousemove', this.onMouseMoveFn, false);
            window.addEventListener('mouseup', this.onMouseUpFn, false);
        }
    }, {
        key: 'onMouseUp',
        value: function onMouseUp(event) {
            this.setState({
                isDragging: false,
                trackHover: false
            });

            _DOMHelper2.default.ignoreSelection();

            if (!_DOMHelper2.default.isChildOf(event.target, this.references.outer) && this.isTrackNeedEvents()) {
                this.hideTrack();
            }

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

            this.references.overflow.node.scrollTop = Math.max(Math.min(Math.floor(offsetY * (this.state.innerHeight / (this.state.outerHeight - this.props.trackMargin))), this.state.innerHeight - this.state.outerHeight), 0);
        }
    }, {
        key: 'onMouseMoveHover',
        value: function onMouseMoveHover(event) {
            if (this.state.isDragging || !this.state.trackActive) {
                return;
            }

            var offset = this.references.track.getOffset(),
                trackHover = event.pageX > offset.left;

            this.setState({ trackHover: trackHover });
        }
    }, {
        key: 'hideTrack',
        value: function hideTrack() {
            var _this2 = this;

            if (!this.props.trackHideTime) {
                this.setState({ trackActive: false });
                return;
            }

            this.scrollTrackVisibleTimeout = _lodash2.default.delay(function () {
                _this2.setState({ trackActive: false });
            }, this.props.trackHideTime);
        }
    }, {
        key: 'triggerScroll',
        value: function triggerScroll() {
            this.onScroll();
            return this;
        }
    }, {
        key: 'goToPos',
        value: function goToPos(scrollTop) {
            var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            var overflow = this.references.overflow.node;

            duration ? _DOMHelper2.default.scrollTo(overflow, scrollTop, duration) : overflow.scrollTop = scrollTop;

            return this;
        }
    }, {
        key: 'goToTop',
        value: function goToTop() {
            var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

            return this.goToPos(0, duration);
        }
    }, {
        key: 'goToBottom',
        value: function goToBottom() {
            var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

            return this.goToPos(this.state.innerHeight - this.state.outerHeight, duration);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            return _react2.default.createElement(
                'div',
                {
                    ref: function ref(r) {
                        return _this3.references.outer = r;
                    },
                    style: {
                        width: this.props.width,
                        height: this.props.height
                    },
                    className: (0, _classname2.default)(style.outer, this.props.className),
                    onMouseEnter: this.onMouseEnter.bind(this),
                    onMouseLeave: this.onMouseLeave.bind(this),
                    onMouseDown: this.onMouseDown.bind(this),
                    onMouseMove: this.onMouseMoveHover.bind(this)
                },
                _react2.default.createElement(
                    _Overflow2.default,
                    {
                        ref: function ref(r) {
                            return _this3.references.overflow = r;
                        },
                        className: (0, _classname2.default)(style.overflow, this.props.overflowClassName),
                        onScroll: this.onScroll.bind(this),
                        onWheel: this.onWheel.bind(this)
                    },
                    _react2.default.createElement(
                        _Inner2.default,
                        {
                            ref: function ref(r) {
                                return _this3.references.inner = r;
                            },
                            className: (0, _classname2.default)(style.inner, this.props.innerClassName),
                            innerMargin: this.state.innerMargin
                        },
                        this.props.children
                    )
                ),
                _react2.default.createElement(_Track2.default, {
                    ref: function ref(r) {
                        return _this3.references.track = r;
                    },

                    className: this.props.trackClassName,
                    handlerClassName: this.props.handlerClassName,

                    isActive: this.state.trackActive,
                    isDragging: this.state.isDragging,
                    isHover: this.state.trackHover,
                    margin: this.props.trackMargin,
                    minHandlerHeight: this.props.minHandlerHeight,
                    scrollTop: this.getScrollTop(),
                    outerWidth: this.getOuterWidth(),
                    outerHeight: this.state.outerHeight,
                    innerHeight: this.state.innerHeight
                })
            );
        }
    }]);

    return ScrollArea;
}(_react.Component);

ScrollArea.propTypes = {
    width: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
    height: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),

    trackVisible: _propTypes2.default.bool,
    trackHidden: _propTypes2.default.bool,
    trackHideTime: _propTypes2.default.number,
    minHandlerHeight: _propTypes2.default.number,
    trackMargin: _propTypes2.default.number,
    onScroll: _propTypes2.default.func,
    children: _propTypes2.default.oneOfType([_propTypes2.default.element, _propTypes2.default.string]),

    className: _propTypes2.default.string,
    innerClassName: _propTypes2.default.string,
    overflowClassName: _propTypes2.default.string,
    trackClassName: _propTypes2.default.string,
    handlerClassName: _propTypes2.default.string,

    //for testing purpose
    testInnerHeight: _propTypes2.default.number,
    testParentWidth: _propTypes2.default.number,
    testParentHeight: _propTypes2.default.number
};
ScrollArea.defaultProps = {
    trackVisible: false,
    trackHidden: false,
    trackHideTime: 1000,
    minHandlerHeight: 70,
    trackMargin: 4,

    className: '',
    innerClassName: '',
    overflowClassName: '',
    trackClassName: '',
    handlerClassName: '',

    //for testing purpose
    testInnerHeight: 0,
    testParentWidth: 0,
    testParentHeight: 0
};
exports.default = ScrollArea;