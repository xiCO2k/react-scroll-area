import React, { Component } from 'react';
import PropTypes from 'prop-types';
import className from 'classname';
import style from './Overflow.css';

export { style };
export default class Overflow extends Component {
    static propTypes = {
        className: PropTypes.string,
        onScroll: PropTypes.func,
        onWheel: PropTypes.func,
        children: PropTypes.node
    };

    render() {
        return (
            <div
                ref={r => this.node = r}
                className={className(style.overflow, this.props.className)}
                onScroll={this.props.onScroll}
                onWheel={this.props.onWheel}
            >
                {this.props.children}
            </div>
        );
    }
}
