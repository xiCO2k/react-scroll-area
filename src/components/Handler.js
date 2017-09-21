import React, { Component } from 'react';
import PropTypes from 'prop-types';
import className from 'classname';

import style from './Handler.css';
import DOMHelper from '../helpers/DOMHelper';

export { style };
export default class Handler extends Component {
    static propTypes = {
        className: PropTypes.string,
        isDragging: PropTypes.bool,
        isHover: PropTypes.bool,
        minHeight: PropTypes.number,

        scrollTop: PropTypes.number,
        outerWidth: PropTypes.number,
        outerHeight: PropTypes.number,
        innerHeight: PropTypes.number
    };

    static defaultProps = {
        className: ''
    };

    constructor(props) {
        super(props);

        this.references = {};
    }

    getRatio() {
        let innerHeight = this.props.innerHeight,
            outerHeight = this.props.outerHeight;

        if (!innerHeight || !outerHeight) {
            return 0;
        }

        return innerHeight / outerHeight;
    }

    getHeight() {
        if (!this.props.outerHeight) {
            return 0;
        }

        return Math.min(Math.max(
            this.getMinHeight(),
            Math.round(this.props.outerHeight / this.getRatio())
        ), this.props.outerHeight);
    }

    getMinHeight() {
        return Math.min(this.props.outerHeight, this.props.minHeight);
    }

    getTop() {
        let scrollTop = this.props.scrollTop,
            innerHeight = this.props.innerHeight,
            trackHeight = this.props.outerHeight,
            handlerHeight = this.getHeight();

        if (handlerHeight === this.getMinHeight()) {
            if (!trackHeight) {
                return 0;
            }

            return (
                (trackHeight - handlerHeight) *
                (scrollTop / (innerHeight - trackHeight))
            );
        }

        if (!scrollTop) {
            return 0;
        }

        return Math.round(scrollTop / this.getRatio());
    }

    getOffset() {
        let offset = DOMHelper.offset(this.references.handler);

        if (process.env.NODE_ENV === 'testing') {
            offset = { top: 0, left: this.props.outerWidth - 5};
        }

        return offset;
    }

    render() {
        return (
            <div
                ref={r => this.references.handler = r}
                className={className({
                    [style.handler]: true,
                    [style.dragging]: this.props.isDragging,
                    [style.hover]: this.props.isHover,
                    [this.props.className]: true
                })}
                style={{
                    height: this.getHeight(),
                    top: this.getTop()
                }}
            />
        );
    }
}
