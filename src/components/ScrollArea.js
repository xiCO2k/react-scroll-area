import React, { Component } from 'react';
import _ from 'lodash';
import $ from 'jquery';

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
        this.onScrollTop();
    }

    componentDidUpdate() {
        if (this.getInnerHeight() !== this.state.innerHeight) {
            this.onResize();
        }

        this.onScrollTop();
    }

    componentWillUnmount() {
        this.unMounted = true;
    }

    getOuterHeight(fromState = false) {
        let $outer = $(this.refs['outer']);

        if (fromState) {
            return this.state.outerHeight;
        }

        return $outer.outerHeight();
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

        let ratio = this.getTrackHandlerRatio(),
            handlerHeight = Math.round((trackHeight) / ratio);

        return Math.max(
            this.minTrackHandlerHeight,
            handlerHeight
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
        let $outer = $(this.refs['outer']),
            $inner = $(this.refs['inner']);

        if (!$inner.width() || !$outer.width()) {
            return -1;
        }

        return ($inner.width() - $outer.width()) - 1;
    }

    getInnerHeight(fromState = false) {
        var $inner = $(this.refs['inner']);

        if (fromState) {
            return this.state.innerHeight;
        }

        return $inner.height();
    }

    getScrollTop() {
        var $overflow = $(this.refs['overflow']);

        return $overflow.scrollTop() || 0;
    }

    getScrollTopAnimTime() {
        return this.props.scrollTopAnim ? this.props.scrollTopAnimTime || 400 : 0;
    }

    onMouseWheel(event) {
        var $target = $(event.target),
            scrollTop = this.getScrollTop(),
            innerHeight = this.getInnerHeight(),
            outerHeight = this.getOuterHeight();

        if ((!$target.is($(this.refs['outer'])) &&
            !$target.parents('.scroll-outer:first').is($(this.refs['outer']))
            ) || $target.is("textarea")) {
            return;
        }

        if (event.originalEvent.wheelDelta < 0 &&
            scrollTop >= innerHeight - outerHeight) {

            event.stopPropagation();
            event.preventDefault();

            return;
        } else if (event.originalEvent.wheelDelta >= 0 && scrollTop === 0) {
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

    onScrollTop(scrollTopPos = false, scrollToBottom = false, noAnim = false) {
        let $elem = $(this.refs['outer']),
            $overflow = $(this.refs['overflow']),
            $inner = $(this.refs['inner']),
            method = 'animate',
            scrollTop = this.props.scrollTopPos || scrollTopPos,
            actualScrollTop = this.getScrollTop(),
            relativeScrollTop = (scrollTop + actualScrollTop) - $elem.offset().top;

        if (this.props.scrollToBottom || scrollToBottom) {
            relativeScrollTop = $inner.height();
            scrollTop = true;
        }

        if (scrollTop !== false) {
            $overflow.stop();

            if (noAnim) {
                $overflow.scrollTop(relativeScrollTop);

                if (_.isFunction(this.props.scrollTopCallback)) {
                    this.props.scrollTopCallback();
                }

                return;
            }

            $overflow[method]({
                scrollTop: relativeScrollTop
            }, this.getScrollTopAnimTime());

            _.delay(() => {
                if (!_.isFunction(this.props.scrollTopCallback)) {
                    return;
                }

                this.props.scrollTopCallback();
            }, this.getScrollTopAnimTime());
        }
    }

    goToBottom(noAnim = false) {
        this.onScrollTop(false, true, noAnim);
    }

    goToPos(pos, noAnim = false) {
        this.onScrollTop(pos, false, noAnim);
    }

    onScroll() {
        let data = {
            scrollTop: this.getScrollTop(),
            innerHeight: this.getInnerHeight(),
            outerHeight: this.getOuterHeight(),
            complete: 0
        };

        data.complete = (data.scrollTop + data.outerHeight) / data.innerHeight;

        if (_.isFunction(this.props.onScroll)) {
            this.props.onScroll(data, this);
        }

        this.forceUpdate();
    }

    onTrackHandlerDragging(event, dd) {
        let top = dd.offsetY,
            scrollTop = top * this.getTrackHandlerRatio(true);

        $(this.refs['overflow'])
            .scrollTop(scrollTop);
    }

    isTrackVisible() {
        if (this.props.trackHidden) {
            return false;
        }

        return this.state.trackVisible;
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

    onMouseEnter() {
        clearTimeout(this.scrollTrackVisibleTimeout);

        this.setState({
            trackVisible: true
        });
    }

    onMouseLeave() {
        this.scrollTrackVisibleTimeout = _.delay(() => {
            if(this.unMounted) {
                return;
            }

            this.setState({
                trackVisible: false
            });
        }, 1000);
    }

    onMouseDown(event) {
        let handlerPosition = $(this.refs['handler']).position() || {},
            handlerOffset = $(this.refs['handler']).offset() || {},
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
        this.setState({ isDragging: false, handlerHover: false });

        this.ignoreSelection();

        window.removeEventListener('mouseup', this.onMouseUpFn);
        window.removeEventListener('mousemove', this.onMouseMoveFn);
    }

    onMouseMove(event) {
        if (!this.state.isDragging) {
            return;
        }

        this.ignoreSelection();

        let deltaY = event.pageY - this.state.startY,
            originalY = this.state.originalY,
            offsetY = originalY + deltaY;

        this.onTrackHandlerDragging({}, { offsetY });
    }

    onMouseMoveHover(event) {
        if (this.state.isDragging) {
            return;
        }

        let handlerOffset = $(this.refs['handler']).offset() || {};

        if (event.pageX > handlerOffset.left) {
            this.setState({
                handlerHover: true
            });
        } else {
            this.setState({
                handlerHover: false
            });
        }
    }

    ignoreSelection() {
        if (document.selection) {
            document.selection.empty();
        } else {
            window.getSelection().removeAllRanges();
        }
    }

    triggerScroll() {
        this.onScroll();
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
                    onWheel={this.onMouseWheel.bind(this)}
                    onScroll={this.onScroll.bind(this)}
                >
                    <div
                        ref="inner"
                        className={`${style.inner} clearfix`}
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
