import React, { Component } from 'react';
import PropTypes from 'prop-types';
import className from 'classnames';
import style from './Inner.css';

export { style };
export default class Inner extends Component {
    static propTypes = {
        innerMargin: PropTypes.number,
        className: PropTypes.string,
        children: PropTypes.node
    };

    constructor(props) {
        super(props);

        this.state = {
            node: null
        }
    }

    render() {
        return (
            <div
                ref={r => this.node = r}
                className={className(style.inner, this.props.className)}
                style={{marginRight: this.props.innerMargin}}
            >
                {this.props.children}
            </div>
        );
    }
}
