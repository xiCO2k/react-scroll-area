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

var _Handler = require('./Handler');

var _Handler2 = _interopRequireDefault(_Handler);

var _DOMHelper = require('../helpers/DOMHelper');

var _DOMHelper2 = _interopRequireDefault(_DOMHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var style = {
    'track': 'Track__track___UisIH',
    'hidden': 'Track__hidden___ZW_yW'
};
exports.style = style;

var Track = function (_Component) {
    _inherits(Track, _Component);

    function Track(props) {
        _classCallCheck(this, Track);

        var _this = _possibleConstructorReturn(this, (Track.__proto__ || Object.getPrototypeOf(Track)).call(this, props));

        _this.state = {};
        _this.references = {};
        return _this;
    }

    _createClass(Track, [{
        key: 'getHeight',
        value: function getHeight() {
            return this.props.outerHeight - this.props.margin;
        }
    }, {
        key: 'getOffset',
        value: function getOffset() {
            var offset = _DOMHelper2.default.offset(this.references.track);

            if (process.env.NODE_ENV === 'testing') {
                offset = { top: 0, left: this.props.outerWidth - 5 };
            }

            return offset;
        }
    }, {
        key: 'getClassNames',
        value: function getClassNames() {
            var classNames = [style.track, this.props.className];

            if (!this.props.isActive) {
                classNames.push(style.hidden);
            }

            return classNames.join(' ');
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                'div',
                {
                    ref: function ref(r) {
                        return _this2.references.track = r;
                    },
                    className: this.getClassNames(),
                    style: {
                        top: this.props.margin / 2,
                        height: this.getHeight()
                    }
                },
                _react2.default.createElement(_Handler2.default, {
                    ref: function ref(r) {
                        return _this2.references.handler = r;
                    },
                    scrollTop: this.props.scrollTop,
                    outerWidth: this.props.outerWidth,
                    outerHeight: this.getHeight(),
                    innerHeight: this.props.innerHeight,
                    minHeight: this.props.minHandlerHeight,
                    isDragging: this.props.isDragging,
                    isHover: this.props.isHover
                })
            );
        }
    }]);

    return Track;
}(_react.Component);

Track.propTypes = {
    className: _propTypes2.default.string,
    margin: _propTypes2.default.number,
    isActive: _propTypes2.default.bool,
    isDragging: _propTypes2.default.bool,
    isHover: _propTypes2.default.bool,
    minHandlerHeight: _propTypes2.default.number,
    scrollTop: _propTypes2.default.number,
    outerWidth: _propTypes2.default.number,
    outerHeight: _propTypes2.default.number,
    innerHeight: _propTypes2.default.number
};
Track.defaultProps = {
    className: ''
};
exports.default = Track;