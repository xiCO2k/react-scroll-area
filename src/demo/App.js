import _ from 'lodash';
import React, { Component } from 'react';
import ScrollArea from '../components/ScrollArea.js';

export default class App extends Component {
    render() {
        let style = {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: '#FFF',
            width: '400px',
            height: '300px',
            margin: 'auto'
        };

        return (
            <div style={style}>
                <ScrollArea>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque modi neque explicabo dolore sint aliquid dolorum. Eum delectus autem, accusantium magnam laboriosam, possimus nihil inventore ab recusandae obcaecati, tempora ducimus.
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque modi neque explicabo dolore sint aliquid dolorum. Eum delectus autem, accusantium magnam laboriosam, possimus nihil inventore ab recusandae obcaecati, tempora ducimus.
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque modi neque explicabo dolore sint aliquid dolorum. Eum delectus autem, accusantium magnam laboriosam, possimus nihil inventore ab recusandae obcaecati, tempora ducimus.
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque modi neque explicabo dolore sint aliquid dolorum. Eum delectus autem, accusantium magnam laboriosam, possimus nihil inventore ab recusandae obcaecati, tempora ducimus.
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque modi neque explicabo dolore sint aliquid dolorum. Eum delectus autem, accusantium magnam laboriosam, possimus nihil inventore ab recusandae obcaecati, tempora ducimus.
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque modi neque explicabo dolore sint aliquid dolorum. Eum delectus autem, accusantium magnam laboriosam, possimus nihil inventore ab recusandae obcaecati, tempora ducimus.
                    </p>
                    <textarea name="" id="" cols="30" rows="10"></textarea>
                </ScrollArea>
            </div>
        );
    }
}
