'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _DOMHelper = require('../helpers/DOMHelper');

var _DOMHelper2 = _interopRequireDefault(_DOMHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Handler = function (_Component) {
    _inherits(Handler, _Component);

    function Handler() {
        _classCallCheck(this, Handler);

        return _possibleConstructorReturn(this, (Handler.__proto__ || Object.getPrototypeOf(Handler)).apply(this, arguments));
    }

    _createClass(Handler, [{
        key: 'getPosition',
        value: function getPosition() {
            return _DOMHelper2.default.position(this.refs['handler']);
        }
    }, {
        key: 'getOffset',
        value: function getOffset() {
            var offset = _DOMHelper2.default.offset(this.refs['handler']);

            if (process.env.NODE_ENV === 'testing') {
                offset = { top: 0, left: this.props.outerWidth - 5 };
            }

            return offset;
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement('div', {
                ref: 'handler',
                className: this.props.className,
                style: {
                    height: this.props.height,
                    top: this.props.top
                }
            });
        }
    }]);

    return Handler;
}(_react.Component);

exports.default = Handler;