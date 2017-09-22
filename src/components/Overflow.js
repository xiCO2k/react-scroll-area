import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
                className={this.props.className}
                onScroll={this.props.onScroll}
                onWheel={this.props.onWheel}
            >
                {this.props.children}
            </div>
        );
    }
}
