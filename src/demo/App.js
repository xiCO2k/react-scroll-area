import _ from 'lodash';
import React, { Component } from 'react';
import ScrollArea from '../components/ScrollArea.js';

export default class App extends Component {

    goToTop() {
        this.refs.scroll.goToTop(parseInt(this.refs.duration.value, 10) || 0);
    }

    goToBottom() {
        this.refs.scroll.goToBottom(parseInt(this.refs.duration.value, 10) || 0);
    }

    goToPos() {
        this.refs.scroll.goToPos(this.refs.pos.value, parseInt(this.refs.duration.value, 10) || 0);
    }

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
                <ScrollArea ref="scroll" trackMargin={10} trackVisible>
                    <div style={{ width: 10, height: 180, background: 'red', margin: '10px 0' }}></div>
                </ScrollArea>

                <button onClick={this.goToTop.bind(this)}>goToTop</button>
                <button onClick={this.goToBottom.bind(this)}>goToBottom</button>

                <input type="text" ref="pos" defaultValue="50" />
                <button onClick={this.goToPos.bind(this)}>goToPos</button>

                <label htmlFor="duration">Duration</label>
                <input type="text" ref="duration" id="duration" defaultValue="1000" />
            </div>
        );
    }
}
