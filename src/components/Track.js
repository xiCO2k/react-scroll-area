import _ from 'lodash';
import React, { Component } from 'react';

export default class Track extends Component {
    render() {
        return (
            <div
                ref='track'
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
