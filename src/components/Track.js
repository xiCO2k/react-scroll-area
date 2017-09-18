import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Track extends Component {
    static propTypes = {
        className: PropTypes.string,
        height: PropTypes.number,
        top: PropTypes.number,
        children: PropTypes.element
    }

    render() {
        return (
            <div
                className={this.props.className}
                style={{
                    top: this.props.top,
                    height: this.props.height
                }}
            >
                {this.props.children}
            </div>
        );
    }
}
