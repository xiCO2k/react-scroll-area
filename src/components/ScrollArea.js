import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import className from 'classname';

import DOMHelper from '../helpers/DOMHelper';
import style from './ScrollArea.css';

import Track from './Track';
import Overflow from './Overflow';
import Inner from './Inner';

export default class ScrollArea extends Component {

    static propTypes = {
        width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

        trackVisible: PropTypes.bool,
        trackHidden: PropTypes.bool,
        trackHideTime: PropTypes.number,
        minHandlerHeight: PropTypes.number,
        trackMargin: PropTypes.number,
        onScroll: PropTypes.func,
        children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),

        className: PropTypes.string,
        innerClassName: PropTypes.string,
        overflowClassName: PropTypes.string,
        trackClassName: PropTypes.string,
        handlerClassName: PropTypes.string,

        //for testing purpose
        testInnerHeight: PropTypes.number,
        testParentWidth: PropTypes.number,
        testParentHeight: PropTypes.number
    };

    static defaultProps = {
        trackVisible: false,
        trackHidden: false,
        trackHideTime: 1000,
        minHandlerHeight: 70,
        trackMargin: 4,

        className: '',
        innerClassName: '',
        overflowClassName: '',
        trackClassName: '',
        handlerClassName: '',

        //for testing purpose
        testInnerHeight: 0,
        testParentWidth: 0,
        testParentHeight: 0
    };

    constructor(props) {
        super(props);

        this.state = {
            trackActive: props.trackVisible,
            innerMargin: -1,
            innerHeight: 0,
            outerHeight: 0,
            isDragging: false
        };

        this.references = {};
    }

    componentDidMount() {
        this.validateProps(); //It throws
        this.onResize();
    }

    componentDidUpdate() {
        if (this.getInnerHeight() !== this.state.innerHeight) {
            this.onResize();
        }
    }

    componentWillUnmount() {
        clearTimeout(this.scrollTrackVisibleTimeout);
    }

    validateProps() {
        if (this.props.width && !/^([0-9]+)(%|px)?$/.test(this.props.width)) {
            throw new TypeError('Invalid width, must be a numeric or percentage.');
        }

        if (this.props.height && !/^([0-9]+)(%|px)?$/.test(this.props.height)) {
            throw new TypeError('Invalid height, must be a numeric or percentage.');
        }
    }

    getOuterWidth() {
        let width = this.props.width,
            isPercentage = /%/.test(width);

        if (isPercentage) {
            let percentage = parseInt(width, 10) / 100;

            return process.env.NODE_ENV === 'testing' ?
                this.props.testParentWidth * percentage :
                DOMHelper.getWidth(this.references.outer) * percentage;
        }

        return parseInt(this.props.width || DOMHelper.getWidth(this.references.outer) || 0, 10);
    }

    getOuterHeight() {
        let height = this.props.height,
            isPercentage = /%/.test(height);

        if (isPercentage) {
            let percentage = parseInt(height, 10) / 100;

            return process.env.NODE_ENV === 'testing' ?
                this.props.testParentHeight * percentage :
                DOMHelper.getHeight(this.references.outer) * percentage;
        }

        return parseInt(this.props.height || DOMHelper.getHeight(this.references.outer) || 0, 10);
    }

    getInnerHeight() {
        return process.env.NODE_ENV === 'testing' ?
            this.props.testInnerHeight :
            DOMHelper.getHeight(this.references.inner.node);
    }

    getInnerMargin() {
        let outer = this.references.outer,
            inner = this.references.inner.node;

        if (!inner.offsetWidth || !outer.offsetWidth) {
            return -1;
        }

        return (inner.offsetWidth - outer.offsetWidth) - 1;
    }

    getScrollTop(target = this.references.overflow) {
        return target && target.node.scrollTop || 0;
    }

    isTrackNeedEvents() {
        return !this.props.trackHidden && !this.props.trackVisible &&
            this.getInnerHeight() > this.state.outerHeight;
    }

    onResize() {
        let state = {
            innerHeight: this.getInnerHeight(),
            outerHeight: this.getOuterHeight()
        };

        if (this.state.innerMargin === -1) {
            state.innerMargin = this.getInnerMargin();
        }

        this.setState(state);
    }

    onWheel(event) {
        let scrollTop = this.getScrollTop(),
            innerHeight = this.getInnerHeight(),
            outerHeight = this.getOuterHeight();

        if (!DOMHelper.isChildOf(event.target, this.references.outer, true)) {
            return;
        }

        if ((event.deltaY > 0 && scrollTop >= innerHeight - outerHeight) ||
            (event.deltaY < 0 && scrollTop === 0)) {
            event.stopPropagation();
            event.preventDefault();
        }
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
        if (!this.isTrackNeedEvents() ||
            this.state.isDragging) {
            return;
        }

        this.hideTrack();
    }

    onMouseDown(event) {
        let offset = this.references.track.getOffset();

        if (event.pageX < offset.left || !this.state.trackHover) {
            return;
        }

        this.setState({
            isDragging: true,
            trackActive: !this.props.trackHidden,
            startY: event.pageY,
            originalY: this.references.track.getHeight() * ((this.getScrollTop()) / this.state.innerHeight)
        });

        this.onMouseMoveFn = this.onMouseMove.bind(this);
        this.onMouseUpFn = this.onMouseUp.bind(this);
        window.addEventListener('mousemove', this.onMouseMoveFn, false);
        window.addEventListener('mouseup', this.onMouseUpFn, false);
    }

    onMouseUp(event) {
        this.setState({
            isDragging: false,
            trackHover: false
        });

        DOMHelper.ignoreSelection();

        if (!DOMHelper.isChildOf(event.target, this.references.outer) &&
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

        this.references.overflow.node.scrollTop = Math.max(Math.min(
            Math.floor(offsetY * (this.state.innerHeight / (this.state.outerHeight - this.props.trackMargin))),
            this.state.innerHeight - this.state.outerHeight
        ), 0);
    }

    onMouseMoveHover(event) {
        if (this.state.isDragging || !this.state.trackActive) {
            return;
        }

        let offset = this.references.track.getOffset(),
            trackHover = event.pageX > offset.left;

        this.setState({ trackHover });
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
        let overflow = this.references.overflow.node;

        duration ?
            DOMHelper.scrollTo(overflow, scrollTop, duration) :
            overflow.scrollTop = scrollTop;

        return this;
    }

    goToTop(duration = 0) {
        return this.goToPos(0, duration);
    }

    goToBottom(duration = 0) {
        return this.goToPos(this.state.innerHeight - this.state.outerHeight, duration);
    }

    render() {
        return (
            <div
                ref={r => this.references.outer = r}
                style={{
                    width: this.props.width,
                    height: this.props.height
                }}
                className={className(style.outer, this.props.className)}
                onMouseEnter={this.onMouseEnter.bind(this)}
                onMouseLeave={this.onMouseLeave.bind(this)}
                onMouseDown={this.onMouseDown.bind(this)}
                onMouseMove={this.onMouseMoveHover.bind(this)}
            >
                <Overflow
                    ref={r => this.references.overflow = r}
                    className={className(style.overflow, this.props.overflowClassName)}
                    onScroll={this.onScroll.bind(this)}
                    onWheel={this.onWheel.bind(this)}
                >
                    <Inner
                        ref={r => this.references.inner = r}
                        className={className(style.inner, this.props.innerClassName)}
                        innerMargin={this.state.innerMargin}
                    >
                        {this.props.children}
                    </Inner>
                </Overflow>
                <Track
                    ref={r => this.references.track = r}

                    className={this.props.trackClassName}
                    handlerClassName={this.props.handlerClassName}

                    isActive={this.state.trackActive}
                    isDragging={this.state.isDragging}
                    isHover={this.state.trackHover}
                    margin={this.props.trackMargin}
                    minHandlerHeight={this.props.minHandlerHeight}
                    scrollTop={this.getScrollTop()}
                    outerWidth={this.getOuterWidth()}
                    outerHeight={this.state.outerHeight}
                    innerHeight={this.state.innerHeight}
                />
            </div>
        );
    }
}
