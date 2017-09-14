import React from 'react';
import ScrollArea from '../ScrollArea';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
    const comp = shallow(<ScrollArea>Analytcs</ScrollArea>);

    expect(comp).toMatchSnapshot();
});

// it('should have the same width and height of the parent DOM', () => {
//     expect(true).toEqual(true);
// });

// it('shows the scroll track when mouse enter', () => {
//     expect(true).toEqual(true);
// });

// it('should not show the track when mouse enter when the props.trackHidden is true', () => {
//     expect(true).toEqual(true);
// });

// it('should change the class to handlerHover when the scroll handler is hovered', () => {
//     expect(true).toEqual(true);
// });

