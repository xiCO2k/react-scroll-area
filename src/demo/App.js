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
                            <h2 className="title is-5">Without params</h2>
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
                            <h2 className="title is-5">Always visible</h2>
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
                            <h2 className="title is-5">Always hidden</h2>
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
                            <h2 className="title is-5">With hide time set to zero</h2>
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
                            <h2 className="title is-5">With margin set to 100px</h2>
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
    }
}
