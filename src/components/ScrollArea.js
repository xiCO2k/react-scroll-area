import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import DOMHelper from '../helpers/DOMHelper';
import style from './ScrollArea.css';

export default class ScrollArea extends Component {

    static propTypes = {
        width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

        trackHidden: PropTypes.bool,
        trackHideTime: PropTypes.number,

        minHandlerHeight: PropTypes.number,
        handlerMargin: PropTypes.number,

        onScroll: PropTypes.func
    };

    static defaultProps = {
        trackVisible: false,
        trackHidden: false,
        trackHideTime: 1000,
        minHandlerHeight: 70,
        handlerMargin: 4
    };

    constructor(props) {
        super(props);

        this.state = {
            trackActive: props.trackVisible,
            trackHandlerHeight: 0,
            innerMargin: -1,
            innerHeight: 0,
            outerHeight: 0,
            isDragging: false
        };
    }

    componentDidMount() {
        this.onResize(true);
    }

    componentDidUpdate() {
        if (this.getInnerHeight() !== this.getInnerHeight(true)) {
            this.onResize();
        }
    }

    componentWillUnmount() {
        clearTimeout(this.scrollTrackVisibleTimeout);
    }

    getOuterHeight(fromState = false) {
        return fromState ?
            this.state.outerHeight :
            this.refs['outer'] && this.refs['outer'].offsetHeight;
    }

    getTrackHeight(fromState = false) {
        return this.getOuterHeight(fromState) - this.props.handlerMargin;
    }

    getTrackHandlerRatio(fromState = false) {
        let innerHeight = this.getInnerHeight(fromState),
            trackHeight = this.getTrackHeight(fromState);

        if (!innerHeight || !trackHeight) {
            return 0;
        }

        return innerHeight / trackHeight;
    }

    getTrackHandlerHeight(trackHeight) {
        if (!trackHeight) {
            return 0;
        }

        return Math.max(
            this.props.minHandlerHeight,
            Math.round((trackHeight) / this.getTrackHandlerRatio())
        );
    }

    getTrackHandlerTop() {
        let scrollTop = this.getScrollTop(),
            innerHeight = this.getInnerHeight(true),
            trackHeight = this.getTrackHeight(true),
            trackHandlerHeight = this.getTrackHandlerHeight(trackHeight);

        if (trackHandlerHeight === this.props.minHandlerHeight) {
            return (
                (trackHeight - trackHandlerHeight) *
                (scrollTop / (innerHeight - trackHeight))
            );
        }

        if (!scrollTop) {
            return 0;
        }

        return Math.round(scrollTop / this.getTrackHandlerRatio());
    }

    getInnerMargin() {
        let outer = this.refs['outer'],
            inner = this.refs['inner'];

        if (!inner.offsetWidth || !outer.offsetWidth) {
            return -1;
        }

        return (inner.offsetWidth - outer.offsetWidth) - 1;
    }

    getInnerHeight(fromState = false) {
        return fromState ? this.state.innerHeight :
            this.refs['inner'] && this.refs['inner'].offsetHeight;
    }

    getScrollTop() {
        return this.refs['overflow'] && this.refs['overflow'].scrollTop || 0;
    }

    onMouseWheel(event) {
        var scrollTop = this.getScrollTop(),
            innerHeight = this.getInnerHeight(),
            outerHeight = this.getOuterHeight();

        if (!DOMHelper.isChildOf(event.target, this.refs['outer'], true)) {
            return;
        }

        if ((event.deltaY > 0 && scrollTop >= innerHeight - outerHeight) ||
            (event.deltaY < 0 && scrollTop === 0)) {
            event.stopPropagation();
            event.preventDefault();
            return;
        }
    }

    onResize(fromMount = false) {
        let outerHeight = this.getOuterHeight(),
            trackHandlerHeight = this.getTrackHandlerHeight(outerHeight),
            state = {
                innerHeight: this.getInnerHeight(),
                trackHandlerHeight,
                outerHeight
            };

        if (this.state.innerMargin === -1) {
            state.innerMargin = this.getInnerMargin();
        }

        this.setState(state);
    }

    onScroll() {
        if (this.props.onScroll) {
            let data = {
                scrollTop: this.getScrollTop(),
                innerHeight: this.getInnerHeight(),
                outerHeight: this.getOuterHeight()
            };
            data.complete = (data.scrollTop + data.outerHeight) / data.innerHeight;

            this.props.onScroll(data, this);
        }

        this.forceUpdate();
    }

    onTrackHandlerDragging(offsetY) {
        this.refs['overflow'].scrollTop = offsetY * this.getTrackHandlerRatio(true);
    }

    onMouseEnter() {
        if (this.props.trackHidden ||
            this.props.trackVisible) {
            return;
        }

        clearTimeout(this.scrollTrackVisibleTimeout);
        this.setState({ trackActive: true });
    }

    onMouseLeave() {
        if (this.props.trackHidden ||
            this.props.trackVisible) {
            return;
        }

        if (!this.props.trackHideTime) {
            this.setState({ trackActive: false });
            return;
        }

        this.scrollTrackVisibleTimeout = _.delay(() => {
            this.setState({ trackActive: false });
        }, this.props.trackHideTime);
    }

    onMouseDown(event) {
        let handlerPosition = DOMHelper.position(this.refs['handler']),
            handlerOffset = DOMHelper.offset(this.refs['handler']),
            originalY = handlerPosition.top,
            startY = event.pageY;

        if (event.pageX < handlerOffset.left) {
            return;
        }

        this.setState({
            isDragging: true,
            startY, originalY
        });

        this.onMouseMoveFn = this.onMouseMove.bind(this);
        this.onMouseUpFn = this.onMouseUp.bind(this);
        window.addEventListener('mousemove', this.onMouseMoveFn, false);
        window.addEventListener('mouseup', this.onMouseUpFn, false);
    }

    onMouseUp() {
        this.setState({
            isDragging: false,
            handlerHover: false
        });

        DOMHelper.ignoreSelection();

        window.removeEventListener('mouseup', this.onMouseUpFn);
        window.removeEventListener('mousemove', this.onMouseMoveFn);
    }

    onMouseMove(event) {
        if (!this.state.isDragging) {
            return;
        }

        let deltaY = event.pageY - this.state.startY,
            offsetY = this.state.originalY + deltaY;

        DOMHelper.ignoreSelection();
        this.onTrackHandlerDragging(offsetY);
    }

    onMouseMoveHover(event) {
        if (this.state.isDragging) {
            return;
        }

        let handlerOffset = DOMHelper.offset(this.refs['handler']),
            handlerHover = false;

        if (event.pageX > handlerOffset.left) {
            handlerHover = true;
        }

        this.setState({ handlerHover });
    }

    triggerScroll() {
        this.onScroll();
    }

    getTrackClassNames() {
        let classNames = [style.track];

        if (!this.state.trackActive) {
            classNames.push(style.trackHidden);
        }

        if (this.getOuterHeight(true) > this.getInnerHeight(true)) {
            classNames.push(style.trackHidden);
        }

        return classNames.join(' ');
    }

    getHandleClassNames() {
        let classNames = [style.handler];

        if (this.state.isDragging) {
            classNames.push(style.handlerIsDragging);
        }

        if (this.state.handlerHover) {
            classNames.push(style.handlerHover);
        }

        return classNames.join(' ');
    }

    render() {
        return (
            <div
                ref='outer'
                style={{
                    width: this.props.width,
                    height: this.props.height
                }}
                className={style.outer}
                onMouseEnter={this.onMouseEnter.bind(this)}
                onMouseLeave={this.onMouseLeave.bind(this)}
                onMouseDown={this.onMouseDown.bind(this)}
                onMouseMove={this.onMouseMoveHover.bind(this)}
            >
                <div
                    ref='overflow'
                    className={style.overflow}
                    onScroll={this.onScroll.bind(this)}
                    onWheel={this.onMouseWheel.bind(this)}
                >
                    <div
                        ref='inner'
                        className={style.inner}
                        style={{marginRight: this.state.innerMargin}}
                    >
                        {this.props.children}
                    </div>
                </div>
                <div
                    ref='track'
                    className={this.getTrackClassNames()}
                >
                    <div
                        ref='handler'
                        className={this.getHandleClassNames()}
                        style={{
                            height: this.state.trackHandlerHeight,
                            top: this.getTrackHandlerTop()
                        }}
                    />
                </div>
            </div>
        );
    }
}
