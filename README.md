[![Build Status](https://travis-ci.org/xiCO2k/react-scroll-area.svg?branch=master)](https://travis-ci.org/xiCO2k/react-scroll-area)
[![npm downloads](https://img.shields.io/npm/dm/xico2k-react-scroll-area.svg?style=flat-square)](https://www.npmjs.com/package/xico2k-react-scroll-area)
[![bitHound Code](https://www.bithound.io/github/xiCO2k/react-scroll-area/badges/code.svg)](https://www.bithound.io/github/xiCO2k/react-scroll-area)
[![bitHound Dependencies](https://www.bithound.io/github/xiCO2k/react-scroll-area/badges/dependencies.svg)](https://www.bithound.io/github/xiCO2k/react-scroll-area/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/xiCO2k/react-scroll-area/badges/devDependencies.svg)](https://www.bithound.io/github/xiCO2k/react-scroll-area/master/dependencies/npm)

# react-scroll-area

[![NPM](https://nodei.co/npm/xico2k-react-scroll-area.png?downloads=true&downloadRank=true)](https://npmjs.org/package/xico2k-react-scroll-area)

A scroll area wrapper to mimic Facebook Scroll Area


## Installation
With [npm](https://www.npmjs.com):
```
$ npm i xico2k-react-scroll-area
```
or with [yarn](https://yarnpkg.com):
```
$ yarn add xico2k-react-scroll-area
```

## Usage

On your component add:

```javascript
import ScrollArea from 'xico2k-react-scroll-area';
```
To render:

```html
<ScrollArea>
    Some Content
</ScrollArea>
```

### Props and Examples

| Property | Type | Default Value | Description |
|----------|--------------------|----------|----------------------|
width                | string / number |  | Ex: 100% / 100px / 100 |
height               | string / number |  | Ex: 100% / 100px / 100 |
trackHidden          | bool | false |
trackHideTime        | int | 1000 | Milliseconds |
minHandlerHeight     | int | 70 | Pixels |
trackMargin          | int | 4 | Pixels |
onScroll             | func |  | callback with { <br>scrollTop: 50, <br>    innerHeight: 100, <br>  outerHeight: 50, <br>   complete: 0.5 } |

### Methods

* goToBottom(animate = false);
* goToTop(animate = false);
* goToPos(pos = 50, animate = false);
