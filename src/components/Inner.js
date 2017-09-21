import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Inner extends Component {
    static propTypes = {
        innerMargin: PropTypes.number,
        className: PropTypes.string,
        children: PropTypes.node
    };

    render() {
        return (
            <div
                ref={r => this.node = r}
                className={this.props.className}
                style={{marginRight: this.props.innerMargin}}
            >
                {this.props.children}
            </div>
        );
    }
}
