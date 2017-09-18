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

var _Track = require('./Track');

var _Track2 = _interopRequireDefault(_Track);

var _Handler = require('./Handler');

var _Handler2 = _interopRequireDefault(_Handler);

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
            handlerHeight: 0,
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
        key: 'getOuterWidth',
        value: function getOuterWidth() {
            return parseInt(this.props.width || _DOMHelper2.default.getWidth(this.refs['outer']), 10);
        }
    }, {
        key: 'getOuterHeight',
        value: function getOuterHeight() {
            var fromState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (fromState && this.state.outerHeight) {
                return this.state.outerHeight;
            }

            if (process.env.NODE_ENV === 'testing') {
                return parseInt(this.props.height || 0, 10);
            }

            return parseInt(this.props.height || _DOMHelper2.default.getHeight(this.refs['outer']), 10);
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

            return _DOMHelper2.default.getHeight(this.refs['inner']);
        }
    }, {
        key: 'getTrackHeight',
        value: function getTrackHeight() {
            var fromState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            return this.getOuterHeight(fromState) - this.props.trackMargin;
        }
    }, {
        key: 'getHandlerRatio',
        value: function getHandlerRatio() {
            var fromState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            var innerHeight = this.getInnerHeight(fromState),
                trackHeight = this.getTrackHeight(fromState);

            if (!innerHeight || !trackHeight) {
                return 0;
            }

            return innerHeight / trackHeight;
        }
    }, {
        key: 'getHandlerHeight',
        value: function getHandlerHeight(trackHeight) {
            if (!trackHeight) {
                return 0;
            }

            return Math.min(Math.max(this.props.minHandlerHeight, Math.round(trackHeight / this.getHandlerRatio())), trackHeight);
        }
    }, {
        key: 'getMinHandlerHeight',
        value: function getMinHandlerHeight() {
            return Math.min(this.getTrackHeight(true), this.props.minHandlerHeight);
        }
    }, {
        key: 'getHandlerTop',
        value: function getHandlerTop() {
            var scrollTop = this.getScrollTop(),
                innerHeight = this.getInnerHeight(true),
                trackHeight = this.getTrackHeight(true),
                handlerHeight = this.getHandlerHeight(trackHeight);

            if (handlerHeight === this.getMinHandlerHeight()) {
                if (!trackHeight) {
                    return 0;
                    // throw new TypeError('the trackHeight can\'t be zero');
                }

                return (trackHeight - handlerHeight) * (scrollTop / (innerHeight - trackHeight));
            }

            if (!scrollTop) {
                return 0;
            }

            return Math.round(scrollTop / this.getHandlerRatio());
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
            var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.refs['overflow'];

            return target && target.scrollTop || 0;
        }
    }, {
        key: 'isTrackNeedEvents',
        value: function isTrackNeedEvents() {
            return !this.props.trackHidden && !this.props.trackVisible && this.getInnerHeight(true) > this.getOuterHeight(true);
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
                trackHeight = this.getTrackHeight(),
                handlerHeight = this.getHandlerHeight(trackHeight),
                state = {
                innerHeight: this.getInnerHeight(),
                handlerHeight: handlerHeight,
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
            var position = this.refs['handler'].getPosition(),
                offset = this.refs['handler'].getOffset();

            if (event.pageX < offset.left || !this.state.handlerHover) {
                return;
            }

            this.setState({
                isDragging: true,
                trackActive: !this.props.trackHidden,
                startY: event.pageY,
                originalY: this.getTrackHeight(true) * (this.getScrollTop() / this.getInnerHeight(true))
            });

            //handlerHeight = 70
            //height = 100
            //innerheight = 200
            //ScrollTop = 100
            // trackMargin = 10
            //pos 0 --> top --> 0 -- 1
            //pos 30 --> top --> 50 -- 1,66666667

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
                handlerHover: false
            });

            _DOMHelper2.default.ignoreSelection();

            if (!_DOMHelper2.default.isChildOf(event.target, this.refs['outer']) && this.isTrackNeedEvents()) {
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

            this.refs['overflow'].scrollTop = Math.max(Math.min(Math.floor(offsetY * this.getHandlerRatio(true)), this.getInnerHeight(true) - this.getOuterHeight(true)), 0);
        }
    }, {
        key: 'onMouseMoveHover',
        value: function onMouseMoveHover(event) {
            if (this.state.isDragging || !this.state.trackActive) {
                return;
            }

            var offset = this.refs['handler'].getOffset(),
                handlerHover = false;

            if (event.pageX > offset.left) {
                handlerHover = true;
            }

            this.setState({ handlerHover: handlerHover });
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

            var overflow = this.refs['overflow'];

            if (duration) {
                _DOMHelper2.default.scrollTo(overflow, scrollTop, duration);
                return;
            }

            overflow.scrollTop = scrollTop;

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

            return this.goToPos(this.getInnerHeight(true) - this.getOuterHeight(true), duration);
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
                    _Track2.default,
                    {
                        ref: 'track',
                        className: this.getTrackClassNames(),
                        top: this.props.trackMargin / 2,
                        height: this.getTrackHeight(true)
                    },
                    _react2.default.createElement(_Handler2.default, {
                        ref: 'handler',
                        className: this.getHandleClassNames(),
                        top: this.getHandlerTop(),
                        height: this.state.handlerHeight,
                        outerWidth: this.getOuterWidth()
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
    trackMargin: _propTypes2.default.number,
    onScroll: _propTypes2.default.func,

    //for testing purpose
    testInnerHeight: _propTypes2.default.number
};
ScrollArea.defaultProps = {
    trackVisible: false,
    trackHidden: false,
    trackHideTime: 1000,
    minHandlerHeight: 70,
    trackMargin: 4,

    //for testing purpose
    testInnerHeight: 0
};
exports.default = ScrollArea;