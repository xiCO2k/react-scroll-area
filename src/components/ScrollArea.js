import React, { Component } from 'react';
import _ from 'lodash';

import DOMHelper from '../helpers/DOMHelper';
import style from './ScrollArea.css';

export default class ScrollArea extends Component {
    constructor(props) {
        super(props);

        this.minTrackHandlerHeight = 70;
        this.handlerMargin = 4;
        this.scrollTrackVisibleTimeout = false;
        this.unMounted = false;

        this.state = {
            trackVisible: false,
            trackHidden: props.trackHidden,
            innerMargin: -1,

            innerHeight: 0,
            outerHeight: 0,
            trackHandlerHeight: 0,

            isDragging: false
        };
    }

    componentDidMount() {
        this.onResize(true);
    }

    componentDidUpdate() {
        if (this.getInnerHeight() !== this.state.innerHeight) {
            this.onResize();
        }
    }

    componentWillUnmount() {
        this.unMounted = true;
    }

    getOuterHeight(fromState = false) {
        return fromState ?
            this.state.outerHeight :
            this.refs['outer'] && this.refs['outer'].offsetHeight;
    }

    getTrackHeight(fromState = false) {
        return this.getOuterHeight(fromState) - this.handlerMargin;
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
            this.minTrackHandlerHeight,
            Math.round((trackHeight) / this.getTrackHandlerRatio())
        );
    }

    getTrackHandlerTop() {
        let scrollTop = this.getScrollTop(),
            innerHeight = this.getInnerHeight(true),
            trackHeight = this.getTrackHeight(true),
            trackHandlerHeight = this.getTrackHandlerHeight(trackHeight);

        if (trackHandlerHeight === this.minTrackHandlerHeight) {
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

    getScrollTopAnimTime() {
        return this.props.scrollTopAnimTime || 400;
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
            trackHandlerHeight = this.getTrackHandlerHeight(outerHeight);

        let state = {
            innerHeight: this.getInnerHeight(),
            trackHandlerHeight,
            outerHeight
        }

        if (this.state.innerMargin === -1) {
            state.innerMargin = this.getInnerMargin();
        }

        this.setState(state);
    }

    onScroll() {
        if (_.isFunction(this.props.onScroll)) {
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
        if (this.props.trackHidden) {
            return;
        }

        clearTimeout(this.scrollTrackVisibleTimeout);
        this.setState({ trackVisible: true });
    }

    onMouseLeave() {
        if (this.props.trackHidden) {
            return;
        }

        this.scrollTrackVisibleTimeout = _.delay(() => {
            if(this.unMounted) {
                return;
            }

            this.setState({ trackVisible: false });
        }, 1000);
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

        this.ignoreSelection();

        window.removeEventListener('mouseup', this.onMouseUpFn);
        window.removeEventListener('mousemove', this.onMouseMoveFn);
    }

    onMouseMove(event) {
        if (!this.state.isDragging) {
            return;
        }

        let deltaY = event.pageY - this.state.startY,
            originalY = this.state.originalY,
            offsetY = originalY + deltaY;

        this.ignoreSelection();
        this.onTrackHandlerDragging(offsetY);
    }

    onMouseMoveHover(event) {
        if (this.state.isDragging) {
            return;
        }

        let handlerOffset = DOMHelper.offset(this.refs['handler']) || {},
            handlerHover = false;

        if (event.pageX > handlerOffset.left) {
            handlerHover = true;
        }

        this.setState({ handlerHover });
    }

    ignoreSelection() {
        if (document.selection) {
            document.selection.empty();
        } else {
            window.getSelection().removeAllRanges();
        }
    }

    isTrackVisible() {
        return this.props.trackHidden ? false : this.state.trackVisible;
    }

    triggerScroll() {
        this.onScroll();
    }

    getTrackClassNames() {
        let classNames = [style.track];

        if (!this.isTrackVisible()) {
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
                ref="outer"
                className={style.outer}
                onMouseEnter={this.onMouseEnter.bind(this)}
                onMouseLeave={this.onMouseLeave.bind(this)}
                onMouseDown={this.onMouseDown.bind(this)}
                onMouseMove={this.onMouseMoveHover.bind(this)}
            >
                <div
                    ref="overflow"
                    className={style.overflow}
                    onScroll={this.onScroll.bind(this)}
                    onWheel={this.onMouseWheel.bind(this)}
                >
                    <div
                        ref="inner"
                        className={style.inner}
                        style={{marginRight: this.state.innerMargin}}
                    >
                        {this.props.children}
                    </div>
                </div>
                <div
                    ref="track"
                    className={this.getTrackClassNames()}
                >
                    <div
                        ref="handler"
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
