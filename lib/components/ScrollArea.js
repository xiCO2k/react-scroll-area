'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _ScrollArea = require('./ScrollArea.css');

var _ScrollArea2 = _interopRequireDefault(_ScrollArea);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScrollArea = function (_Component) {
    _inherits(ScrollArea, _Component);

    function ScrollArea(props) {
        _classCallCheck(this, ScrollArea);

        var _this = _possibleConstructorReturn(this, (ScrollArea.__proto__ || Object.getPrototypeOf(ScrollArea)).call(this, props));

        _this.minTrackHandlerHeight = 70;
        _this.handlerMargin = 4;
        _this.scrollTrackVisibleTimeout = false;
        _this.unMounted = false;

        _this.state = {
            trackVisible: false,
            trackHidden: props.trackHidden,
            innerMargin: -1,

            innerHeight: 0,
            outerHeight: 0,
            trackHandlerHeight: 0,

            isDragging: false
        };
        return _this;
    }

    _createClass(ScrollArea, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var $elem = (0, _jquery2.default)(_reactDom2.default.findDOMNode(this)),
                $overflow = $elem.find("> ." + _ScrollArea2.default.overflow);

            this.onResize(true);
            this.onScrollTop();

            $overflow.on({
                'mousewheel': this.onMouseWheel.bind(this)
            });
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            if (this.getInnerHeight() !== this.state.innerHeight) {
                this.onResize();
            }

            this.onScrollTop();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.unMounted = true;
        }
    }, {
        key: 'getOuterHeight',
        value: function getOuterHeight() {
            var fromState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            var $outer = (0, _jquery2.default)(this.refs['outer']);

            if (fromState) {
                return this.state.outerHeight;
            }

            return $outer.outerHeight();
        }
    }, {
        key: 'getTrackHeight',
        value: function getTrackHeight() {
            var fromState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            return this.getOuterHeight(fromState) - this.handlerMargin;
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

            var ratio = this.getTrackHandlerRatio(),
                handlerHeight = Math.round(trackHeight / ratio);

            return Math.max(this.minTrackHandlerHeight, handlerHeight);
        }
    }, {
        key: 'getTrackHandlerTop',
        value: function getTrackHandlerTop() {
            var scrollTop = this.getScrollTop(),
                innerHeight = this.getInnerHeight(true),
                trackHeight = this.getTrackHeight(true),
                trackHandlerHeight = this.getTrackHandlerHeight(trackHeight);

            if (trackHandlerHeight === this.minTrackHandlerHeight) {
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
            var $outer = (0, _jquery2.default)(this.refs['outer']),
                $inner = (0, _jquery2.default)(this.refs['inner']);

            if (!$inner.width() || !$outer.width()) {
                return -1;
            }

            return $inner.width() - $outer.width() - 1;
        }
    }, {
        key: 'getInnerHeight',
        value: function getInnerHeight() {
            var fromState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            var $inner = (0, _jquery2.default)(this.refs['inner']);

            if (fromState) {
                return this.state.innerHeight;
            }

            return $inner.height();
        }
    }, {
        key: 'getScrollTop',
        value: function getScrollTop() {
            var $overflow = (0, _jquery2.default)(this.refs['overflow']);

            return $overflow.scrollTop() || 0;
        }
    }, {
        key: 'getScrollTopAnimTime',
        value: function getScrollTopAnimTime() {
            return this.props.scrollTopAnim ? this.props.scrollTopAnimTime || 400 : 0;
        }
    }, {
        key: 'onMouseWheel',
        value: function onMouseWheel(event) {
            var $target = (0, _jquery2.default)(event.target),
                scrollTop = (0, _jquery2.default)(this.refs['overflow']).scrollTop(),
                innerHeight = this.getInnerHeight(),
                outerHeight = this.getOuterHeight();

            if (!$target.is((0, _jquery2.default)(this.refs['outer'])) && !$target.parents('.scroll-outer:first').is((0, _jquery2.default)(this.refs['outer'])) || $target.is("textarea")) {
                return;
            }

            if (event.originalEvent.wheelDelta < 0 && scrollTop >= innerHeight - outerHeight) {

                event.stopPropagation();
                event.preventDefault();

                return;
            } else if (event.originalEvent.wheelDelta >= 0 && scrollTop === 0) {
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
                trackHandlerHeight = this.getTrackHandlerHeight(outerHeight);

            var state = {
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
        key: 'onScrollTop',
        value: function onScrollTop() {
            var scrollTopPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            var _this2 = this;

            var scrollToBottom = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            var noAnim = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            var $elem = (0, _jquery2.default)(this.refs['outer']),
                $overflow = (0, _jquery2.default)(this.refs['overflow']),
                $inner = (0, _jquery2.default)(this.refs['inner']),
                method = 'animate',
                scrollTop = this.props.scrollTopPos || scrollTopPos,
                actualScrollTop = $overflow.scrollTop(),
                relativeScrollTop = scrollTop + actualScrollTop - $elem.offset().top;

            if (this.props.scrollToBottom || scrollToBottom) {
                relativeScrollTop = $inner.height();
                scrollTop = true;
            }

            if (scrollTop !== false) {
                $overflow.stop();

                if (noAnim) {
                    $overflow.scrollTop(relativeScrollTop);

                    if (_lodash2.default.isFunction(this.props.scrollTopCallback)) {
                        this.props.scrollTopCallback();
                    }

                    return;
                }

                $overflow[method]({
                    scrollTop: relativeScrollTop
                }, this.getScrollTopAnimTime());

                _lodash2.default.delay(function () {
                    if (!_lodash2.default.isFunction(_this2.props.scrollTopCallback)) {
                        return;
                    }

                    _this2.props.scrollTopCallback();
                }, this.getScrollTopAnimTime());
            }
        }
    }, {
        key: 'goToBottom',
        value: function goToBottom() {
            var noAnim = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            this.onScrollTop(false, true, noAnim);
        }
    }, {
        key: 'goToPos',
        value: function goToPos(pos) {
            var noAnim = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            this.onScrollTop(pos, false, noAnim);
        }
    }, {
        key: 'onScroll',
        value: function onScroll() {
            var data = {
                scrollTop: this.getScrollTop(),
                innerHeight: this.getInnerHeight(),
                outerHeight: this.getOuterHeight(),
                complete: 0
            };

            data.complete = (data.scrollTop + data.outerHeight) / data.innerHeight;

            if (_lodash2.default.isFunction(this.props.onScroll)) {
                this.props.onScroll(data, this);
            }

            this.forceUpdate();
        }
    }, {
        key: 'onTrackHandlerDragging',
        value: function onTrackHandlerDragging(event, dd) {
            var top = dd.offsetY,
                scrollTop = top * this.getTrackHandlerRatio(true);

            (0, _jquery2.default)(this.refs['overflow']).scrollTop(scrollTop);
        }
    }, {
        key: 'isTrackVisible',
        value: function isTrackVisible() {
            if (this.props.trackHidden) {
                return false;
            }

            return this.state.trackVisible;
        }
    }, {
        key: 'getTrackClassNames',
        value: function getTrackClassNames() {
            var classNames = [_ScrollArea2.default.track];

            if (!this.isTrackVisible()) {
                classNames.push(_ScrollArea2.default.trackHidden);
            }

            if (this.getOuterHeight(true) > this.getInnerHeight(true)) {
                classNames.push(_ScrollArea2.default.trackHidden);
            }

            return classNames.join(' ');
        }
    }, {
        key: 'getHandleClassNames',
        value: function getHandleClassNames() {
            var classNames = [_ScrollArea2.default.handler];

            if (this.state.isDragging) {
                classNames.push(_ScrollArea2.default.handlerIsDragging);
            }

            if (this.state.handlerHover) {
                classNames.push(_ScrollArea2.default.handlerHover);
            }

            return classNames.join(' ');
        }
    }, {
        key: 'onMouseEnter',
        value: function onMouseEnter() {
            clearTimeout(this.scrollTrackVisibleTimeout);
            this.setState({
                trackVisible: true
            });
        }
    }, {
        key: 'onMouseLeave',
        value: function onMouseLeave() {
            var _this3 = this;

            this.scrollTrackVisibleTimeout = _lodash2.default.delay(function () {
                if (_this3.unMounted) {
                    return;
                }

                _this3.setState({
                    trackVisible: false
                });
            }, 1000);
        }
    }, {
        key: 'onMouseDown',
        value: function onMouseDown(event) {
            var handlerPosition = (0, _jquery2.default)(this.refs['handler']).position() || {},
                handlerOffset = (0, _jquery2.default)(this.refs['handler']).offset() || {},
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
            this.setState({ isDragging: false, handlerHover: false });

            this.ignoreSelection();

            window.removeEventListener('mouseup', this.onMouseUpFn);
            window.removeEventListener('mousemove', this.onMouseMoveFn);
        }
    }, {
        key: 'onMouseMove',
        value: function onMouseMove(event) {
            if (!this.state.isDragging) {
                return;
            }

            this.ignoreSelection();

            var deltaY = event.pageY - this.state.startY,
                originalY = this.state.originalY,
                offsetY = originalY + deltaY;

            this.onTrackHandlerDragging({}, { offsetY: offsetY });
        }
    }, {
        key: 'onMouseMoveHover',
        value: function onMouseMoveHover(event) {
            if (this.state.isDragging) {
                return;
            }

            var handlerOffset = (0, _jquery2.default)(this.refs['handler']).offset() || {};

            if (event.pageX > handlerOffset.left) {
                this.setState({
                    handlerHover: true
                });
            } else {
                this.setState({
                    handlerHover: false
                });
            }
        }
    }, {
        key: 'ignoreSelection',
        value: function ignoreSelection() {
            if (document.selection) {
                document.selection.empty();
            } else {
                window.getSelection().removeAllRanges();
            }
        }
    }, {
        key: 'triggerScroll',
        value: function triggerScroll() {
            this.onScroll();
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                {
                    ref: 'outer',
                    className: _ScrollArea2.default.outer,
                    onMouseEnter: this.onMouseEnter.bind(this),
                    onMouseLeave: this.onMouseLeave.bind(this),
                    onMouseDown: this.onMouseDown.bind(this),
                    onMouseMove: this.onMouseMoveHover.bind(this)
                },
                _react2.default.createElement(
                    'div',
                    {
                        ref: 'overflow',
                        className: _ScrollArea2.default.overflow,
                        onScroll: this.onScroll.bind(this)
                    },
                    _react2.default.createElement(
                        'div',
                        {
                            ref: 'inner',
                            className: _ScrollArea2.default.inner + ' clearfix',
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

exports.default = ScrollArea;