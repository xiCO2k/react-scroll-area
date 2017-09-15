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
            width: '100px',
            height: '100px',
            margin: 'auto'
        };

        return (
            <div style={style}>
                <ScrollArea width="100px" height="100px" trackVisible>
                    <div style={{ width: 10, height: 80, background: 'red', margin: '10px 0' }}></div>
                </ScrollArea>
            </div>
        );
    }
}
