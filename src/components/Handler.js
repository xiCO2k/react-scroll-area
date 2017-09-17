import _ from 'lodash';
import React, { Component } from 'react';

import DOMHelper from '../helpers/DOMHelper';

export default class Handler extends Component {
    getPosition() {
        return DOMHelper.position(this.refs['handler']);
    }

    getOffset() {
        let offset = DOMHelper.offset(this.refs['handler']);

        if (process.env.NODE_ENV === 'testing') {
            offset = { top: 0, left: this.props.outerWidth - 5};
        }

        return offset;
    }
    render() {
        return (
            <div
                ref='handler'
                className={this.props.className}
                style={{
                    height: this.props.height,
                    top: this.props.top
                }}
            />
        );
    }
}
