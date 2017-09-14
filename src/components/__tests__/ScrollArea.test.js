import React from 'react';
import ScrollArea from '../ScrollArea';
import { shallow, render, mount } from 'enzyme';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
    const wrapper = shallow(<ScrollArea>Lorem Ipsum</ScrollArea>);

    expect(wrapper).toMatchSnapshot();
});

it('shows the scroll track when mouse enter', () => {
    const wrapper = mount(<ScrollArea></ScrollArea>);

    expect(wrapper.state('trackVisible')).toEqual(false);

    wrapper.instance().onMouseEnter();

    expect(wrapper.state('trackVisible')).toEqual(true);
});

it('should not show the track when mouse enter when the props.trackHidden is true', () => {
    const wrapper = mount(<ScrollArea trackHidden={true}></ScrollArea>);

    expect(wrapper.state('trackVisible')).toEqual(false);

    wrapper.instance().onMouseEnter();

    expect(wrapper.state('trackVisible')).toEqual(false);
});

it('should call the callback props.onScroll when scrolling if its a prop', done => {
    const wrapper = mount(<ScrollArea onScroll={() => done()}></ScrollArea>);
    wrapper.instance().triggerScroll();
});
