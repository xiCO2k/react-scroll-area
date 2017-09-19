import _ from 'lodash';
import React, { Component } from 'react';
import ScrollArea from '../components/ScrollArea.js';

import style from './App.css';
import exampleImg from './example.png';

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
        return (
            <div className="container">
                <div className="columns is-multiline">
                    <div className="column">
                        <div className={style.example}>
                            <h2 className="title is-5">Without Params</h2>
                            <div className={style.preview}>
                                <div className={style.exampleContainer}>
                                    <ScrollArea>
                                        <div style={{ minHeight: "2798px" }}>
                                            <img src={exampleImg} height="2798" />
                                        </div>
                                    </ScrollArea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="column">
                        <div className={style.example}>
                            <h2 className="title is-5">With Track always visible</h2>
                            <div className={style.preview}>
                                <div className={style.exampleContainer}>
                                    <ScrollArea trackVisible>
                                        <div style={{ minHeight: "2798px" }}>
                                            <img src={exampleImg} height="2798" />
                                        </div>
                                    </ScrollArea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="column">
                        <div className={style.example}>
                            <h2 className="title is-5">With Track always hidden</h2>
                            <div className={style.preview}>
                                <div className={style.exampleContainer}>
                                    <ScrollArea trackHidden>
                                        <div style={{ minHeight: "2798px" }}>
                                            <img src={exampleImg} height="2798" />
                                        </div>
                                    </ScrollArea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="column">
                        <div className={style.example}>
                            <h2 className="title is-5">With min scroll handler height set to 300px</h2>
                            <div className={style.preview}>
                                <div className={style.exampleContainer}>
                                    <ScrollArea minHandlerHeight={300}>
                                        <div style={{ minHeight: "2798px" }}>
                                            <img src={exampleImg} height="2798" />
                                        </div>
                                    </ScrollArea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="column">
                        <div className={style.example}>
                            <h2 className="title is-5">With track hide time set to zero</h2>
                            <div className={style.preview}>
                                <div className={style.exampleContainer}>
                                    <ScrollArea trackHideTime={0}>
                                        <div style={{ minHeight: "2798px" }}>
                                            <img src={exampleImg} height="2798" />
                                        </div>
                                    </ScrollArea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="column">
                        <div className={style.example}>
                            <h2 className="title is-5">With track margin set to 100px</h2>
                            <div className={style.preview}>
                                <div className={style.exampleContainer}>
                                    <ScrollArea trackMargin={100} trackVisible>
                                        <div style={{ minHeight: "2798px" }}>
                                            <img src={exampleImg} height="2798" />
                                        </div>
                                    </ScrollArea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );


        // let style = {
        //     position: 'absolute',
        //     top: 0,
        //     left: 0,
        //     right: 0,
        //     bottom: 0,
        //     background: '#FFF',
        //     width: '100px',
        //     height: '100px',
        //     margin: 'auto'
        // };

        // return (
        //     <div style={style}>
        //         <ScrollArea ref="scroll" trackMargin={10} trackVisible>
        //             <div style={{ width: 10, height: 180, background: 'red', margin: '10px 0' }}></div>
        //         </ScrollArea>

        //         <button onClick={this.goToTop.bind(this)}>goToTop</button>
        //         <button onClick={this.goToBottom.bind(this)}>goToBottom</button>

        //         <input type="text" ref="pos" defaultValue="50" />
        //         <button onClick={this.goToPos.bind(this)}>goToPos</button>

        //         <label htmlFor="duration">Duration</label>
        //         <input type="text" ref="duration" id="duration" defaultValue="1000" />
        //     </div>
        // );
    }
}
