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


