import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DOMHelper from '../helpers/DOMHelper';

export default class Handler extends Component {
    static propTypes = {
        outerWidth: PropTypes.number,
        className: PropTypes.string,
        height: PropTypes.number,
        top: PropTypes.number
    }

    constructor(props) {
        super(props);

        this.references = {};
    }

    getPosition() {
        return DOMHelper.position(this.references.handler);
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
                className={this.props.className}
                style={{
                    height: this.props.height,
                    top: this.props.top
                }}
            />
        );
    }
}
