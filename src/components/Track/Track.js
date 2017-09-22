import React, { Component } from 'react';
import PropTypes from 'prop-types';
import className from 'classname';
import Handler from './Handler/Handler';
import style from './Track.css';
import DOMHelper from '../../helpers/DOMHelper';

export { style };
export default class Track extends Component {
    static propTypes = {
        className: PropTypes.string,
        handlerClassName: PropTypes.string,
        margin: PropTypes.number,
        isActive: PropTypes.bool,
        isDragging: PropTypes.bool,
        isHover: PropTypes.bool,
        minHandlerHeight: PropTypes.number,
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

        this.state = {};
        this.references = {};
    }

    getHeight() {
        return this.props.outerHeight - this.props.margin;
    }

    getOffset() {
        let offset = DOMHelper.offset(this.references.track);

        if (process.env.NODE_ENV === 'testing') {
            offset = { top: 0, left: this.props.outerWidth - 5};
        }

        return offset;
    }

    render() {
        return (
            <div
                ref={r => this.references.track = r}
                className={className({
                    [style.track]: true,
                    [this.props.className]: true,
                    [style.hidden]: !this.props.isActive
                })}
                style={{
                    top: this.props.margin / 2,
                    height: this.getHeight()
                }}
            >
                <Handler
                    ref={r => this.references.handler = r}
                    className={this.props.handlerClassName}
                    scrollTop={this.props.scrollTop}
                    outerWidth={this.props.outerWidth}
                    outerHeight={this.getHeight()}
                    innerHeight={this.props.innerHeight}
                    minHeight={this.props.minHandlerHeight}
                    isDragging={this.props.isDragging}
                    isHover={this.props.isHover}
                />
            </div>
        );
    }
}
