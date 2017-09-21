'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.style = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classname = require('classname');

var _classname2 = _interopRequireDefault(_classname);

var _DOMHelper = require('../helpers/DOMHelper');

var _DOMHelper2 = _interopRequireDefault(_DOMHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var style = {
    'handler': 'Handler__handler___1Y841',
    'hover': 'Handler__hover___2edsf',
    'dragging': 'Handler__dragging___3Cd15'
};
exports.style = style;

var Handler = function (_Component) {
    _inherits(Handler, _Component);

    function Handler(props) {
        _classCallCheck(this, Handler);

        var _this = _possibleConstructorReturn(this, (Handler.__proto__ || Object.getPrototypeOf(Handler)).call(this, props));

        _this.references = {};
        return _this;
    }

    _createClass(Handler, [{
        key: 'getRatio',
        value: function getRatio() {
            var innerHeight = this.props.innerHeight,
                outerHeight = this.props.outerHeight;

            if (!innerHeight || !outerHeight) {
                return 0;
            }

            return innerHeight / outerHeight;
        }
    }, {
        key: 'getHeight',
        value: function getHeight() {
            if (!this.props.outerHeight) {
                return 0;
            }

            return Math.min(Math.max(this.getMinHeight(), Math.round(this.props.outerHeight / this.getRatio())), this.props.outerHeight);
        }
    }, {
        key: 'getMinHeight',
        value: function getMinHeight() {
            return Math.min(this.props.outerHeight, this.props.minHeight);
        }
    }, {
        key: 'getTop',
        value: function getTop() {
            var scrollTop = this.props.scrollTop,
                innerHeight = this.props.innerHeight,
                trackHeight = this.props.outerHeight,
                handlerHeight = this.getHeight();

            if (handlerHeight === this.getMinHeight()) {
                if (!trackHeight) {
                    return 0;
                }

                return (trackHeight - handlerHeight) * (scrollTop / (innerHeight - trackHeight));
            }

            if (!scrollTop) {
                return 0;
            }

            return Math.round(scrollTop / this.getRatio());
        }
    }, {
        key: 'getOffset',
        value: function getOffset() {
            var offset = _DOMHelper2.default.offset(this.references.handler);

            if (process.env.NODE_ENV === 'testing') {
                offset = { top: 0, left: this.props.outerWidth - 5 };
            }

            return offset;
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this,
                _className;

            return _react2.default.createElement('div', {
                ref: function ref(r) {
                    return _this2.references.handler = r;
                },
                className: (0, _classname2.default)((_className = {}, _defineProperty(_className, style.handler, true), _defineProperty(_className, style.dragging, this.props.isDragging), _defineProperty(_className, style.hover, this.props.isHover), _defineProperty(_className, this.props.className, true), _className)),
                style: {
                    height: this.getHeight(),
                    top: this.getTop()
                }
            });
        }
    }]);

    return Handler;
}(_react.Component);

Handler.propTypes = {
    className: _propTypes2.default.string,
    isDragging: _propTypes2.default.bool,
    isHover: _propTypes2.default.bool,
    minHeight: _propTypes2.default.number,

    scrollTop: _propTypes2.default.number,
    outerWidth: _propTypes2.default.number,
    outerHeight: _propTypes2.default.number,
    innerHeight: _propTypes2.default.number
};
Handler.defaultProps = {
    className: ''
};
exports.default = Handler;