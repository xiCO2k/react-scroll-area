'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Overflow = function (_Component) {
    _inherits(Overflow, _Component);

    function Overflow() {
        _classCallCheck(this, Overflow);

        return _possibleConstructorReturn(this, (Overflow.__proto__ || Object.getPrototypeOf(Overflow)).apply(this, arguments));
    }

    _createClass(Overflow, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                'div',
                {
                    ref: function ref(r) {
                        return _this2.node = r;
                    },
                    className: this.props.className,
                    onScroll: this.props.onScroll,
                    onWheel: this.props.onWheel
                },
                this.props.children
            );
        }
    }]);

    return Overflow;
}(_react.Component);

Overflow.propTypes = {
    className: _propTypes2.default.string,
    onScroll: _propTypes2.default.func,
    onWheel: _propTypes2.default.func,
    children: _propTypes2.default.element
};
exports.default = Overflow;