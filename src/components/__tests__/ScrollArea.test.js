import React from 'react';
import ScrollArea from '../ScrollArea';
import { shallow, mount } from 'enzyme';

describe('rendering', () => {
    it('renders correctly', () => {
        expect(shallow(<ScrollArea />)).toMatchSnapshot();
    });

    it('has the width and height sent by the props', () => {
        const wrapper = mount(<ScrollArea width="100px" height="100px" />),
            style = wrapper.ref('outer').getNode().style;

        expect(style.width).toBe('100px');
        expect(style.height).toBe('100px');
    });
});

describe('interaction', () => {
    it('calls the callback props.onScroll', () => {
        const props = { onScroll: jest.fn(), testInnerHeight: 200 },
            wrapper = mount(<ScrollArea {...props} />);

        wrapper.instance().triggerScroll();

        expect(props.onScroll).toHaveBeenCalledTimes(1);
    });

    it('should scroll to bottom when the goToBottom() is called');
    it('should scroll to top when the goToTop() is called');
    it('should scroll to "pos" when the  goToPos() is called');

    describe('track', () => {
        it('should not show if the "outer" is >= than the "inner"', () => {
            const wrapper = mount(<ScrollArea />);

            expect(wrapper.state('trackActive')).toBe(false);

            wrapper.instance().onMouseEnter();

            expect(wrapper.state('trackActive')).toBe(false);
        });

        it('shows when mouse enter', () => {
            const wrapper = mount(<ScrollArea
                width="100px"
                height="100px"
                testInnerHeight={200}
            />);

            expect(wrapper.state('trackActive')).toBe(false);

            wrapper.instance().onMouseEnter();

            expect(wrapper.state('trackActive')).toBe(true);
        });

        it('checks if is hidden after props.trackHideTime', () => {
            const wrapper = mount(
                <ScrollArea
                    width="100px"
                    height="100px"
                    testInnerHeight={200}
                    trackHideTime={100}
                />
            );

            jest.useFakeTimers();

            expect(wrapper.state('trackActive')).toBe(false);

            wrapper.instance().onMouseEnter();
            expect(wrapper.state('trackActive')).toBe(true);

            wrapper.instance().onMouseLeave();
            jest.runTimersToTime(100);
            expect(wrapper.state('trackActive')).toBe(false);
        });

        it('should not hide if isDragging is true', () => {
            const wrapper = mount(
                <ScrollArea
                    width="100px"
                    height="100px"
                    testInnerHeight={200}
                    trackHideTime={0}
                />
            );

            //Sets isDragging to True
            wrapper.instance().onMouseEnter();
            wrapper.instance().onMouseMoveHover({ pageX: 96 });
            wrapper.instance().onMouseDown({ pageX: 96 });
            wrapper.instance().onMouseLeave();

            expect(wrapper.state('trackActive')).toBe(true);
        })

        it('not show when mouseEnter if the props.trackHidden is true', () => {
            const wrapper = mount(
                <ScrollArea
                    width="100px"
                    height="100px"
                    testInnerHeight={200}
                    trackHidden={true}
                />
            );

            expect(wrapper.state('trackActive')).toBe(false);

            wrapper.instance().onMouseEnter();

            expect(wrapper.state('trackActive')).toBe(false);
        });

        it('checks if is always visible if the props.trackVisible is true', () => {
            const wrapper = mount(
                <ScrollArea
                    trackVisible={true}
                    trackHideTime={0}
                />
            );

            expect(wrapper.state('trackActive')).toBe(true);

            wrapper.instance().onMouseEnter();
            wrapper.instance().onMouseLeave();

            expect(wrapper.state('trackActive')).toBe(true);
        });
    });

    describe('handler', () => {
        const props = {
            width: '100px',
            height: '100px',
            testInnerHeight: 200
        };

        it('sets "handlerHover: true" when the area is hovered', () => {
            const wrapper = mount(<ScrollArea {...props} />);

            wrapper.instance().onMouseEnter();
            wrapper.instance().onMouseMoveHover({ pageX: 96 });
            expect(wrapper.state("handlerHover")).toBe(true);
        });

        it('sets "isDragging: true" when the area is onMouseDown()', () => {
            const wrapper = mount(<ScrollArea {...props} />);

            wrapper.instance().onMouseEnter();
            wrapper.instance().onMouseMoveHover({ pageX: 96 });
            wrapper.instance().onMouseDown({ pageX: 96 });
            expect(wrapper.state("isDragging")).toBe(true);
        });

        it('not sets "isDragging: true" when the area is onMouseDown() if track is not visible', () => {
            const wrapper = mount(<ScrollArea {...props} />);

            wrapper.instance().onMouseDown({ pageX: 96 });
            expect(wrapper.state("isDragging")).toBe(false);
        });

        it('changes the scrollTop when isDragging', () => {
            const wrapper = mount(<ScrollArea {...props} />);

            wrapper.instance().onMouseEnter();
            wrapper.instance().onMouseMoveHover({ pageX: 96 });
            wrapper.instance().onMouseDown({ pageX: 96, pageY: 0 });
            wrapper.instance().onMouseMoveFn({ pageY: 10 });
            expect(wrapper.ref('overflow').getNode().scrollTop).toBe(20);

            wrapper.instance().onMouseMoveFn({ pageY: 5 });
            expect(wrapper.ref('overflow').getNode().scrollTop).toBe(10);

            //Test the minimum
            wrapper.instance().onMouseMoveFn({ pageY: -2 });
            expect(wrapper.ref('overflow').getNode().scrollTop).toBe(0);

            //Test the maximum
            wrapper.instance().onMouseMoveFn({ pageY: 10000 });
            expect(wrapper.ref('overflow').getNode().scrollTop).toBe(props.testInnerHeight - parseInt(props.height, 10));
        });

        it('hides track when onMouseUp on window if isDragging is true', () => {
            const wrapper = mount(<ScrollArea {...props} trackHideTime={0} />);

            wrapper.instance().onMouseEnter();
            wrapper.instance().onMouseMoveHover({ pageX: 96 });
            wrapper.instance().onMouseDown({ pageX: 96 });
            wrapper.instance().onMouseLeave();
            wrapper.instance().onMouseUpFn({ target: window });

            expect(wrapper.state("trackActive")).toBe(false);
        });

        it('should not hide track when onMouseUp on window with "isDragging: true" if trackVisible is true', () => {
            const wrapper = mount(<ScrollArea {...props} trackVisible={true} trackHideTime={0} />);

            wrapper.instance().onMouseEnter();
            wrapper.instance().onMouseMoveHover({ pageX: 96 });
            wrapper.instance().onMouseDown({ pageX: 96 });
            wrapper.instance().onMouseLeave();
            wrapper.instance().onMouseUpFn({ target: window });

            expect(wrapper.state("trackActive")).toBe(true);
        });

        it('changes the top after scrolling', () => {
            const wrapper = mount(<ScrollArea {...props} />);

            wrapper.ref('overflow').getNode().scrollTop = 100;
            wrapper.instance().onScroll();

            expect(wrapper.ref('handler').getNode().style.top).toBe("25px");

            wrapper.ref('overflow').getNode().scrollTop = 0;
            wrapper.instance().onScroll();

            expect(wrapper.ref('handler').getNode().style.top).toBe("0px");
        });

        it('has the right height based on the inner height', () => {
            const wrapper = mount(
                <ScrollArea
                    {...props}
                    testInnerHeight={100}
                    handlerMargin={0}
                />
            );

            expect(wrapper.ref('handler').getNode().style.height).toBe(props.height);
        });

        it('can not have more height than the track height', () => {
            const wrapper = mount(
                <ScrollArea
                    {...props}
                    testInnerHeight={1}
                    handlerMargin={0}
                />
            );

            expect(wrapper.ref('handler').getNode().style.height).toBe(props.height);
        });

        it('subtracts the height if the props.handlerMargin has value', () => {
            const margin = 10,
                wrapper = mount(
                    <ScrollArea
                        {...props}
                        testInnerHeight={100}
                        handlerMargin={margin}
                    />
                );

            expect(wrapper.ref('handler').getNode().style.height).toBe((100 - margin) + "px");
        });

        it('limits the minimum height to the value props.minHandlerHeight', () => {
            const minHandlerHeight = 90,
                wrapper = mount(
                    <ScrollArea
                        {...props}
                        testInnerHeight={1000}
                        handlerMargin={0}
                        minHandlerHeight={minHandlerHeight}
                    />
                );

            expect(wrapper.ref('handler').getNode().style.height).toBe(minHandlerHeight + "px");
        });

        it('not limits the minimum height to the value props.minHandlerHeight if its bigger than the outer height', () => {
            const minHandlerHeight = 101,
                wrapper = mount(
                    <ScrollArea
                        {...props}
                        testInnerHeight={1000}
                        handlerMargin={0}
                        minHandlerHeight={minHandlerHeight}
                    />
                );

            expect(wrapper.ref('handler').getNode().style.height).toBe("100px");
        });
    });
});
