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

## Canvas Props
You can give your canvas props when initializing it, and these props are optional.
```js
const canvas = new CanvasFlow(myCanvas, { props });
```

### Default Values
You can set up a default values for you canvas:
```js
const canvas = new CanvasFlow(myCanvas, { defaultValues: { fill: "green" } });
```
| Property | Type | Default Value | Description |
| -------- | ---- | ------------- | ----------- |
| x | Number | 0 | Sets the default x position of the objects on the canvas |
| y | Number | 0 | Sets the default y position of the objects on the canvas |
| width | Number | 0 | Sets the default width of the objects on the canvas |
| height | Number | 0 | Sets the default height of the objects on the canvas |
| fill | String | "black" | Sets the default background color of the objects on the canvas |
| stroke | Object | { fill: "black", width: 0 } | Sets the default stroke of the objects on the canvas |
| font | Object | { family: "sans-serif", size: 10 } | Sets the default font of the text objects on the canvas |
| borderRadius | Number | 0 | Sets the default border radius of the objects on the canvas |
| rotation | Number | 0 | Sets the default rotation of the objects on the canvas |
| opacity | Number | 1 | Sets the default opacity of the objects on the canvas |
| zIndex | Number | 0 | Sets the default z-index of the objects on the canvas |
| translate | Object | { x: 0, y: 0 } | Sets the default translate position of the objects on the canvas |
