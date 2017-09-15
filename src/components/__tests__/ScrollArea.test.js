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
    it('should not show the track if the "outer" is taller than the "inner"', () => {
        const wrapper = mount(<ScrollArea />);

        expect(wrapper.state('trackActive')).toBe(false);

        wrapper.instance().onMouseEnter();

        expect(wrapper.state('trackActive')).toBe(false);
    });

    it('shows the scroll track when mouse enter', () => {
        const wrapper = mount(<ScrollArea width="100px" height="100px" testInnerHeight={200} />);

        wrapper.instance().onResize();

        expect(wrapper.state('trackActive')).toBe(false);

        wrapper.instance().onMouseEnter();

        expect(wrapper.state('trackActive')).toBe(true);
    });

    it('checks if the track is hidden after props.trackHideTime', () => {
        const wrapper = mount(<ScrollArea trackHideTime={100} width="100px" height="100px" testInnerHeight={200} />);

        jest.useFakeTimers();

        expect(wrapper.state('trackActive')).toBe(false);

        wrapper.instance().onMouseEnter();
        expect(wrapper.state('trackActive')).toBe(true);

        wrapper.instance().onMouseLeave();
        jest.runTimersToTime(100);
        expect(wrapper.state('trackActive')).toBe(false);
    });

    it('not show the track when mouseEnter if the props.trackHidden is true', () => {
        const wrapper = mount(<ScrollArea width="100px" height="100px" testInnerHeight={200} trackHidden={true} />);

        expect(wrapper.state('trackActive')).toBe(false);

        wrapper.instance().onMouseEnter();

        expect(wrapper.state('trackActive')).toBe(false);
    });

    it('checks if the track is always visible', () => {
        const wrapper = mount(<ScrollArea trackVisible={true} trackHideTime={0} />);

        expect(wrapper.state('trackActive')).toBe(true);

        wrapper.instance().onMouseEnter();
        wrapper.instance().onMouseLeave();

        expect(wrapper.state('trackActive')).toBe(true);
    });

    it('calls the callback props.onScroll', () => {
        const props = { onScroll: jest.fn() },
            wrapper = mount(<ScrollArea {...props} />);

        wrapper.instance().triggerScroll();

        expect(props.onScroll).toHaveBeenCalledTimes(1);
    });

    it('sets "handlerHover: true" when handler area is hovered');
    it('sets "isDragging: true" when handler area is onMouseDown');

    it('should scroll to bottom when the goToBottom() is called');
    it('should scroll to top when the goToTop() is called');
    it('should scroll to "pos" when the  goToPos() is called');
});
