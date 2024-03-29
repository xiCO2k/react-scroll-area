[![Build Status](https://travis-ci.org/xiCO2k/react-scroll-area.svg?branch=master)](https://travis-ci.org/xiCO2k/react-scroll-area)
[![npm downloads](https://img.shields.io/npm/dt/@xico2k/react-scroll-area.svg)](https://npmcharts.com/compare/@xico2k/react-scroll-area?minimal=true)

# react-scroll-area [![Demo](https://img.shields.io/badge/demo-live-brightgreen.svg)](//xico2k.github.com/react-scroll-area/)

[![NPM](https://nodei.co/npm/@xico2k/react-scroll-area.png?downloads=true&downloadRank=true)](https://npmjs.org/package/@xico2k/react-scroll-area)

A scroll area wrapper to mimic Facebook Scroll Area

[Demo](//xico2k.github.io/react-scroll-area/)

## Installation
With [npm](https://www.npmjs.com):
```sh
$ npm i @xico2k/react-scroll-area
```
or with [yarn](https://yarnpkg.com):
```sh
$ yarn add @xico2k/react-scroll-area
```

## Usage

On your component add:

```javascript
import ScrollArea from '@xico2k/react-scroll-area';
```
To render:

```html
<ScrollArea>
    Some Content
</ScrollArea>
```

### Props

All props are optional.

| Name | Type | Default | Description |
|:----:|:----:|:-------:|:------------|
**`width`**             | `string / number` |       | Ex: 100% / 100px / 100 |
**`height`**            | `string / number` |       | Ex: 100% / 100px / 100 |
**`trackHidden`**       | `bool`            | false |                        |
**`trackHideTime`**     | `int`             | 1000  | Milliseconds           |
**`minHandlerHeight`**  | `int`             | 70    | Pixels                 |
**`trackMargin`**       | `int`             | 4     | Pixels                 |
**`onScroll`**          | `func`            |       | callback with *`{ scrollTop: 50, innerHeight: 100, outerHeight: 50, complete: 0.5 }`*|
**`className`**         | `string`          |       | class added to the outer container |
**`innerClassName`**    | `string`          |       | class added to the inner container |
**`overflowClassName`** | `string`          |       | class added to the overflow container |
**`trackClassName`**    | `string`          |       | class added to the track container |
**`handlerClassName`**  | `string`          |       | class added to the handler container |

### Methods

* goToBottom(duration = 400);
* goToTop(duration = 400);
* goToPos(pos = 50, duration = 400);
* triggerScroll();
