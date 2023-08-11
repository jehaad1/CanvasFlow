# CanvasFlow

## What's CanvasFlow?
CanvasFlow is a JavaScript library that provides high-level functions enabling you to draw, move, and delete objects on a canvas, along with many other functionalities.

## Installation

ES Module Installation:
```js
npm i canvasflow
```

CDN Installation:
```html
<script src="https://unpkg.com/canvasflow@1.0.0"></script>
```

## Initialization
First, import the "CanvasFlow" class from the library:
```js
import CanvasFlow from "canvasflow";
```
Second, create your canvas:
```js
const myCanvas = document.querySelector("canvas.MyCanvas");

const canvas = new CanvasFlow(myCanvas);
```
Finally, you're ready to start drawing over the canvas.

## Props
You can give your canvas props when initializing it, and these props are optional.
```js
const canvas = new CanvasFlow(myCanvas, { props });
```

### Default Values Property
