import React from 'react';
import ScrollArea from './ScrollArea';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { style as trackStyle } from './Track/Track';
import { style as handlerStyle } from './Track/Handler/Handler';

Enzyme.configure({ adapter: new Adapter() });

global.requestAnimationFrame = (callback) => {
    setTimeout(callback, 0);
};

describe('Render', () => {
    it('renders correctly', () => {
        expect(mount(<ScrollArea />)).toHaveLength(1);
    });

    it('has no width and height on the style if there is no props', () => {
        const wrapper = mount(<ScrollArea />),
            style = wrapper.instance().references.outer.style;

        expect(style.width).toBe('');
        expect(style.height).toBe('');
    });

    it('has the width and height sent by the props', () => {
        const wrapper = mount(<ScrollArea width='100px' height='100px' />),
            style = wrapper.instance().references.outer.style;

        expect(style.width).toBe('100px');
        expect(style.height).toBe('100px');
    });

    it('can handle percentage on width / height', () => {
        const wrapper = mount(<ScrollArea width='25%' height='50%' testParentWidth={200} testParentHeight={200} />),
            style = wrapper.instance().references.outer.style;

        expect(style.width).toBe('25%');
        expect(style.height).toBe('50%');

        expect(wrapper.instance().getOuterHeight()).toBe(100);
        expect(wrapper.instance().getOuterWidth()).toBe(50);
    })

    it('contains the children content', () => {
        expect(mount(<ScrollArea>Lorem Ipsum</ScrollArea>).text()).toBe('Lorem Ipsum');
        expect(mount(<ScrollArea><div>123</div></ScrollArea>).contains(<div>123</div>)).toBe(true);
    });

    it('throws if you pass wrong width / height', () => {
        expect(() => shallow(<ScrollArea width='1234%%' height='1234%%' />)
            .instance().validateProps()).toThrow();

        expect(() => shallow(<ScrollArea width='100xp' height='100px' />)
            .instance().validateProps()).toThrow();

        expect(() => shallow(<ScrollArea width={100} height='dummy' />)
            .instance().validateProps()).toThrow();
    });

    describe('classNames', () => {
        let props = {
                className: 'outer-custom-class outer-custom-class-2',
                innerClassName: 'inner-custom-class',
                overflowClassName: 'overflow-custom-class',
                trackClassName: 'track-custom-class',
                handlerClassName: 'handler-custom-class'
            },
            wrapper = mount(<ScrollArea {...props} />);

        it('ScrollArea has classNames sent from the prop.className', () => {
            let classNames = props.className.split(' ');
            classNames.map(className => expect(wrapper.hasClass(className)).toBe(true));
        });

        it('Overflow has classNames sent from the prop.overflowClassName', () => {
            let classNames = props.overflowClassName.split(' ');
            classNames.map(className => expect(wrapper.find('Overflow').hasClass(className)).toBe(true));
        });

        it('Inner has classNames sent from the prop.innerClassName', () => {
            let classNames = props.innerClassName.split(' ');
            classNames.map(className => expect(wrapper.find('Inner').hasClass(className)).toBe(true));
        });

        it('Track has classNames sent from the prop.trackClassName', () => {
            let classNames = props.trackClassName.split(' ');
            classNames.map(className => expect(wrapper.find('Track').hasClass(className)).toBe(true));
        });

        it('Handler has className sent from the prop.handlerClassName', () => {
            let classNames = props.handlerClassName.split(' ');
            classNames.map(className => expect(wrapper.find('Handler').hasClass(className)).toBe(true));
        });
    });
});

describe('Interaction', () => {
    it('calls the callback props.onScroll', () => {
        const props = { onScroll: jest.fn(), testInnerHeight: 200 },
            wrapper = mount(<ScrollArea {...props} />);

        wrapper.instance().triggerScroll();

        expect(props.onScroll).toHaveBeenCalledTimes(1);
    });

    it('scrolls to bottom when the goToBottom() is called', () => {
        const props = {
                width: '100px',
                height: '100px',
                testInnerHeight: 200
            },
            bottomPos = props.testInnerHeight - parseInt(props.height, 10),
            wrapper = mount(<ScrollArea {...props} />);

        jest.useFakeTimers();

        wrapper.instance().goToBottom();

        expect(wrapper.find("Overflow").getDOMNode().scrollTop).toBe(bottomPos);

        wrapper.find("Overflow").getDOMNode().scrollTop = 0;
        wrapper.instance().goToBottom(400);

        jest.runTimersToTime(400);

        expect(wrapper.find("Overflow").getDOMNode().scrollTop).toBe(bottomPos);

    });

    it('scrolls to top when the goToTop() is called', () => {
        const props = {
                width: '100px',
                height: '100px',
                testInnerHeight: 200,
                minHandlerHeight: 1,
                trackMargin: 0
            },
            wrapper = mount(<ScrollArea {...props} />);

        jest.useFakeTimers();

        wrapper.find("Overflow").getDOMNode().scrollTop = 100;
        wrapper.instance()
            .triggerScroll()
            .goToTop();

        expect(wrapper.find("Overflow").getDOMNode().scrollTop).toBe(0);

        wrapper.find("Overflow").getDOMNode().scrollTop = 100;
        wrapper.instance()
            .triggerScroll()
            .goToTop(400);

        jest.runTimersToTime(400);

        expect(wrapper.find("Overflow").getDOMNode().scrollTop).toBe(0);
    });

    it('scrolls to "pos" when the goToPos() is called', () => {
        const props = {
                width: '100px',
                height: '100px',
                testInnerHeight: 200
            },
            wrapper = mount(<ScrollArea {...props} />);

        jest.useFakeTimers();

        wrapper.instance().goToPos(100);
        expect(wrapper.find("Overflow").getDOMNode().scrollTop).toBe(100);

        wrapper.instance().goToPos(50, 400);

        jest.runTimersToTime(400);

        expect(wrapper.find("Overflow").getDOMNode().scrollTop).toBe(50);
    });

    describe('onResize()', () => {
        it('calls on window resize if the height or width are %', () => {
            const props = {
                testInnerHeight: 200,
                onResize: jest.fn()
            };

            mount(<ScrollArea {...props} />);

            //its called on compoment mount
            expect(props.onResize).toHaveBeenCalledTimes(1);

            props.onResize.mockClear();

            global.innerWidth = 500;
            global.dispatchEvent(new Event('resize'));

            expect(props.onResize).toHaveBeenCalledTimes(1);
        });

        it('does not call on window resize if the height and width are not percentage', () => {
            const props = {
                width: '100px',
                height: '100px',
                testInnerHeight: 200,
                onResize: jest.fn()
            };

            mount(<ScrollArea {...props} />);

            //its called on compoment mount
            expect(props.onResize).toHaveBeenCalledTimes(1);

            props.onResize.mockClear();

            global.innerWidth = 500;
            global.dispatchEvent(new Event('resize'));

            expect(props.onResize).toHaveBeenCalledTimes(0);
        });
    });

    describe('Track', () => {
        it('shows when mouse enter', () => {
            const wrapper = mount(<ScrollArea
                width='100px'
                height='100px'
                testInnerHeight={200}
            />);

            expect(wrapper.state('trackActive')).toBe(false);

            wrapper.instance().onMouseEnter();

            expect(wrapper.state('trackActive')).toBe(true);
        });

        it('has className hidden if is not active', () => {
            const wrapper = mount(<ScrollArea
                width='100px'
                height='100px'
                testInnerHeight={200}
            />);

            expect(wrapper.find('Track').getDOMNode().classList.contains(trackStyle.hidden)).toBe(true);
            wrapper.instance().onMouseEnter();
            expect(wrapper.find('Track').getDOMNode().classList.contains(trackStyle.hidden)).toBe(false);
        });

        it('subtracts the height if the props.trackMargin has value', () => {
            const margin = 10,
                wrapper = mount(
                    <ScrollArea
                        width='100px'
                        height='100px'
                        testInnerHeight={100}
                        trackMargin={margin}
                    />
                );

            expect(wrapper.find('Track').getDOMNode().style.height).toBe((100 - margin) + 'px');
            expect(wrapper.find('Track').getDOMNode().style.top).toBe((margin / 2) + 'px');
        });

        it('subtracts the height if the props.trackMarginTop has value', () => {
            const marginTop = 10,
                wrapper = mount(
                    <ScrollArea
                        width='100px'
                        height='100px'
                        testInnerHeight={100}
                        trackMarginTop={marginTop}
                        trackMarginBottom={0}
                    />
                );

            expect(wrapper.find('Track').getDOMNode().style.height).toBe((100 - marginTop) + 'px');
            expect(wrapper.find('Track').getDOMNode().style.top).toBe(marginTop + 'px');
        });

        it('subtracts the height if the props.trackMarginBottom has value', () => {
            const marginBottom = 10,
                wrapper = mount(
                    <ScrollArea
                        width='100px'
                        height='100px'
                        testInnerHeight={100}
                        trackMarginTop={marginBottom}
                        trackMarginBottom={0}
                    />
                );

            expect(wrapper.find('Track').getDOMNode().style.height).toBe((100 - marginBottom) + 'px');
            expect(wrapper.find('Track').getDOMNode().style.top).toBe(marginBottom + 'px');
        });

        it('not show if the "outer" is >= than the "inner"', () => {
            const wrapper = mount(<ScrollArea />);

            expect(wrapper.state('trackActive')).toBe(false);

            wrapper.instance().onMouseEnter();

            expect(wrapper.state('trackActive')).toBe(false);
        });

        it('checks if is hidden after props.trackHideTime', () => {
            const wrapper = mount(
                <ScrollArea
                    width='100px'
                    height='100px'
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

        it('not hide if isDragging is true', () => {
            const wrapper = mount(
                <ScrollArea
                    width='100px'
                    height='100px'
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
                    width='100px'
                    height='100px'
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

        it('checks if the handle works when scrolling if props.trackVisible is true', () => {
            const wrapper = mount(
                <ScrollArea
                    width='100px'
                    height='100px'
                    testInnerHeight={200}
                    trackVisible={true}
                    trackHideTime={0}
                    minHandlerHeight={1}
                    trackMargin={0}
                />
            );

            wrapper.instance().goToBottom();
            wrapper.instance().triggerScroll();
            expect(wrapper.find('Handler').getDOMNode().style.top).toBe('50px');

        });

        it('sets "trackHover: true" when the area is hovered', () => {
            const wrapper = mount(<ScrollArea width='100px' height='100px' testInnerHeight={200} />);

            wrapper.instance().onMouseEnter();
            wrapper.instance().onMouseMoveHover({ pageX: 96 });
            expect(wrapper.state('trackHover')).toBe(true);
        });
    });

    describe('Handler', () => {
        const props = {
            width: '100px',
            height: '100px',
            testInnerHeight: 200
        };

        it('sets "isDragging: true" when the area is onMouseDown()', () => {
            const wrapper = mount(<ScrollArea {...props} />);

            wrapper.instance().onMouseEnter();
            wrapper.instance().onMouseMoveHover({ pageX: 96 });
            wrapper.instance().onMouseDown({ pageX: 96 });
            expect(wrapper.state('isDragging')).toBe(true);
        });

        it('not sets "isDragging: true" when the area is onMouseDown() if track is not visible', () => {
            const wrapper = mount(<ScrollArea {...props} />);

            wrapper.instance().onMouseDown({ pageX: 96 });
            expect(wrapper.state('isDragging')).toBe(false);
        });

        it('has className isDragging if state.isDragging = true', () => {
            const wrapper = mount(<ScrollArea {...props} />);
            wrapper.instance().onMouseEnter();
            wrapper.instance().onMouseMoveHover({ pageX: 96 });
            wrapper.instance().onMouseDown({ pageX: 96 });
            expect(wrapper.find('Handler').getDOMNode().classList.contains(handlerStyle.dragging)).toBe(true);
        });

        it('has className isHover if state.trackHover = true', () => {
            const wrapper = mount(<ScrollArea {...props} />);

            wrapper.instance().onMouseEnter();
            wrapper.instance().onMouseMoveHover({ pageX: 96 });
            expect(wrapper.find('Handler').getDOMNode().classList.contains(handlerStyle.hover)).toBe(true);
        });

        it('changes the scrollTop when isDragging', () => {
            const wrapper = mount(<ScrollArea {...props} trackMargin={0} />);

            wrapper.instance().onMouseEnter();
            wrapper.instance().onMouseMoveHover({ pageX: 96 });
            wrapper.instance().onMouseDown({ pageX: 96, pageY: 0 });
            wrapper.instance().onMouseMoveFn({ pageY: 10 });
            expect(wrapper.find("Overflow").getDOMNode().scrollTop).toBe(20);

            wrapper.instance().onMouseMoveFn({ pageY: 5 });
            expect(wrapper.find("Overflow").getDOMNode().scrollTop).toBe(10);

            //Test the minimum
            wrapper.instance().onMouseMoveFn({ pageY: -2 });
            expect(wrapper.find("Overflow").getDOMNode().scrollTop).toBe(0);

            //Test the maximum
            wrapper.instance().onMouseMoveFn({ pageY: 10000 });
            expect(wrapper.find("Overflow").getDOMNode().scrollTop).toBe(props.testInnerHeight - parseInt(props.height, 10));
        });

        it('changes the scrollTop when isDragging correctly if it has the trackMargin', () => {
            const wrapper = mount(<ScrollArea {...props} trackMargin={10} />);

            wrapper.instance().onMouseEnter();
            wrapper.instance().onMouseMoveHover({ pageX: 96 });
            wrapper.instance().onMouseDown({ pageX: 96, pageY: 0 });
            wrapper.instance().onMouseMoveFn({ pageY: 9 });
            expect(wrapper.find("Overflow").getDOMNode().scrollTop).toBe(20);
        });

        it('hides track when onMouseUp on window if isDragging is true', () => {
            const wrapper = mount(<ScrollArea {...props} trackHideTime={0} />);

            wrapper.instance().onMouseEnter();
            wrapper.instance().onMouseMoveHover({ pageX: 96 });
            wrapper.instance().onMouseDown({ pageX: 96 });
            wrapper.instance().onMouseLeave();
            wrapper.instance().onMouseUpFn({ target: window });

            expect(wrapper.state('trackActive')).toBe(false);
        });

        it('not hide track when onMouseUp on window with "isDragging: true" if trackVisible is true', () => {
            const wrapper = mount(<ScrollArea {...props} trackVisible={true} trackHideTime={0} />);

            wrapper.instance().onMouseEnter();
            wrapper.instance().onMouseMoveHover({ pageX: 96 });
            wrapper.instance().onMouseDown({ pageX: 96 });
            wrapper.instance().onMouseLeave();
            wrapper.instance().onMouseUpFn({ target: window });

            expect(wrapper.state('trackActive')).toBe(true);
        });

        it('changes the top after scrolling', () => {
            const wrapper = mount(<ScrollArea {...props} trackMargin={0} />);

            wrapper.find("Overflow").getDOMNode().scrollTop = 100;
            wrapper.instance().onScroll();

            expect(wrapper.find('Handler').getDOMNode().style.top).toBe('30px');

            wrapper.find("Overflow").getDOMNode().scrollTop = 0;
            wrapper.instance().onScroll();

            expect(wrapper.find('Handler').getDOMNode().style.top).toBe('0px');
        });

        it('has the right height based on the inner height', () => {
            const wrapper = mount(
                <ScrollArea
                    {...props}
                    testInnerHeight={100}
                    trackMargin={0}
                />
            );

            expect(wrapper.find('Handler').getDOMNode().style.height).toBe(props.height);
        });

        it('can not have more height than the track height', () => {
            const wrapper = mount(
                <ScrollArea
                    {...props}
                    testInnerHeight={1}
                    trackMargin={50}
                />
            );

            expect(wrapper.find('Handler').getDOMNode().style.height).toBe((parseInt(props.height, 10) - 50) + 'px');
        });

        it('limits the minimum height to the value props.minHandlerHeight', () => {
            const minHandlerHeight = 90,
                wrapper = mount(
                    <ScrollArea
                        {...props}
                        testInnerHeight={1000}
                        trackMargin={0}
                        minHandlerHeight={minHandlerHeight}
                    />
                );

            expect(wrapper.find('Handler').getDOMNode().style.height).toBe(minHandlerHeight + 'px');
        });

        it('not limits the minimum height to the value props.minHandlerHeight if its bigger than the track height', () => {
            const trackMargin = 100,
                height = 500,
                wrapper = mount(
                    <ScrollArea
                        {...props}
                        height={height}
                        testInnerHeight={10000}
                        trackMargin={trackMargin}
                        minHandlerHeight={height}
                    />
                );

            expect(wrapper.find('Handler').getDOMNode().style.height).toBe((height - trackMargin) + 'px');

            wrapper.find("Overflow").getDOMNode().scrollTop = 250;
            wrapper.instance().triggerScroll();

            expect(wrapper.find('Handler').getDOMNode().style.top).toBe('0px');
        });
    });
});
