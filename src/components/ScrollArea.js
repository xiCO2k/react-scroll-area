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
        trackMargin: PropTypes.number,
        onScroll: PropTypes.func,

        //for testing purpose
        testInnerHeight: PropTypes.number
    };

    static defaultProps = {
        trackVisible: false,
        trackHidden: false,
        trackHideTime: 1000,
        minHandlerHeight: 70,
        trackMargin: 4,

        //for testing purpose
        testInnerHeight: 0
    };

    constructor(props) {
        super(props);

        this.state = {
            trackActive: props.trackVisible,
            handlerHeight: 0,
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

    getOuterWidth() {
        return parseInt(this.props.width || DOMHelper.getWidth(this.refs['outer']), 10);
    }

    getOuterHeight(fromState = false) {
        if (fromState && this.state.outerHeight) {
            return this.state.outerHeight;
        }

        if (process.env.NODE_ENV === 'testing') {
            return parseInt(this.props.height || 0, 10);
        }

        return parseInt(this.props.height || DOMHelper.getHeight(this.refs['outer']), 10);
    }

    getInnerHeight(fromState = false) {
        if (fromState) {
            return this.state.innerHeight;
        }

        if (process.env.NODE_ENV === 'testing') {
            return this.props.testInnerHeight;
        }

        return DOMHelper.getHeight(this.refs['inner']);
    }

    getTrackHeight(fromState = false) {
        return this.getOuterHeight(fromState) - this.props.trackMargin;
    }

    getHandlerRatio(fromState = false) {
        let innerHeight = this.getInnerHeight(fromState),
            trackHeight = this.getTrackHeight(fromState);

        if (!innerHeight || !trackHeight) {
            return 0;
        }

        return innerHeight / trackHeight;
    }

    getHandlerHeight(trackHeight) {
        if (!trackHeight) {
            return 0;
        }

        return Math.min(Math.max(
            this.props.minHandlerHeight,
            Math.round((trackHeight) / this.getHandlerRatio())
        ), trackHeight);
    }

    getMinHandlerHeight() {
        return Math.min(this.getTrackHeight(true), this.props.minHandlerHeight);
    }

    getHandlerTop() {
        let scrollTop = this.getScrollTop(),
            innerHeight = this.getInnerHeight(true),
            trackHeight = this.getTrackHeight(true),
            handlerHeight = this.getHandlerHeight(trackHeight);


        if (handlerHeight === this.getMinHandlerHeight()) {
            if (!trackHeight) {
                throw new TypeError('the trackHeight can\'t be zero');
            }

            return (
                (trackHeight - handlerHeight) *
                (scrollTop / (innerHeight - trackHeight))
            );
        }

        if (!scrollTop) {
            return 0;
        }



        return Math.round(scrollTop / this.getHandlerRatio());
    }

    getInnerMargin() {
        let outer = this.refs['outer'],
            inner = this.refs['inner'];

        if (!inner.offsetWidth || !outer.offsetWidth) {
            return -1;
        }

        return (inner.offsetWidth - outer.offsetWidth) - 1;
    }

    getScrollTop(target = this.refs['overflow']) {
        return target && target.scrollTop || 0;
    }

    isTrackNeedEvents() {
        return !this.props.trackHidden &&
            !this.props.trackVisible &&
            this.getInnerHeight(true) > this.getOuterHeight(true);
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
            trackHeight = this.getTrackHeight(),
            handlerHeight = this.getHandlerHeight(trackHeight),
            state = {
                innerHeight: this.getInnerHeight(),
                handlerHeight,
                outerHeight
            };

        if (this.state.innerMargin === -1) {
            state.innerMargin = this.getInnerMargin();
        }

        this.setState(state);
    }

    onScroll() {
        if (!this.isTrackNeedEvents()) {
            this.forceUpdate();
            return;
        }

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

    onMouseEnter() {
        if (!this.isTrackNeedEvents()) {
            return;
        }

        clearTimeout(this.scrollTrackVisibleTimeout);
        this.setState({ trackActive: true });
    }

    onMouseLeave() {
        if (!this.isTrackNeedEvents() || this.state.isDragging) {
            return;
        }

        this.hideTrack();
    }

    onMouseDown(event) {
        let position = DOMHelper.position(this.refs['handler']),
            offset = DOMHelper.offset(this.refs['handler']);

        if (process.env.NODE_ENV === 'testing') {
            offset = { top: 0, left: this.getOuterWidth() - 5 };
        }

        if (event.pageX < offset.left || !this.state.handlerHover) {
            return;
        }

        this.setState({
            isDragging: true,
            trackActive: !this.props.trackHidden,
            startY: event.pageY,
            originalY: position.top
        });

        this.onMouseMoveFn = this.onMouseMove.bind(this);
        this.onMouseUpFn = this.onMouseUp.bind(this);
        window.addEventListener('mousemove', this.onMouseMoveFn, false);
        window.addEventListener('mouseup', this.onMouseUpFn, false);
    }

    onMouseUp(event) {
        this.setState({
            isDragging: false,
            handlerHover: false
        });

        DOMHelper.ignoreSelection();

        if (!DOMHelper.isChildOf(event.target, this.refs['outer']) &&
            this.isTrackNeedEvents()) {
            this.hideTrack();
        }

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

        this.refs['overflow'].scrollTop = Math.max(Math.min(
            Math.floor(offsetY * this.getHandlerRatio(true)),
            this.getInnerHeight(true) - this.getOuterHeight(true)
        ), 0);
    }

    onMouseMoveHover(event) {
        if (this.state.isDragging || !this.state.trackActive) {
            return;
        }

        let offset = DOMHelper.offset(this.refs['handler']),
            handlerHover = false;

        if (process.env.NODE_ENV === 'testing') {
            offset = { top: 0, left: this.getOuterWidth() - 5};
        }

        if (event.pageX > offset.left) {
            handlerHover = true;
        }

        this.setState({ handlerHover });
    }

    hideTrack() {
        if (!this.props.trackHideTime) {
            this.setState({ trackActive: false });
            return;
        }

        this.scrollTrackVisibleTimeout = _.delay(() => {
            this.setState({ trackActive: false });
        }, this.props.trackHideTime);
    }

    triggerScroll() {
        this.onScroll();

        return this;
    }

    goToPos(scrollTop, duration = 0) {
        let overflow = this.refs['overflow'];

        if (duration) {
            DOMHelper.scrollTo(overflow, scrollTop, duration);
            return;
        }

        overflow.scrollTop = scrollTop;

        return this;
    }

    goToTop(duration = 0) {
        return this.goToPos(0, duration);
    }

    goToBottom(duration = 0) {
        return this.goToPos(this.getInnerHeight(true) - this.getOuterHeight(true), duration);
    }

    getTrackClassNames() {
        let classNames = [style.track];

        if (!this.state.trackActive) {
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
                    style={{
                        top: this.props.trackMargin / 2,
                        height: this.getTrackHeight(true)
                    }}
                >
                    <div
                        ref='handler'
                        className={this.getHandleClassNames()}
                        style={{
                            height: this.state.handlerHeight,
                            top: this.getHandlerTop()
                        }}
                    />
                </div>
            </div>
        );
    }
}
