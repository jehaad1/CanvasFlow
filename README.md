# CanvasFlow

## What's CanvasFlow?
CanvasFlow is a JavaScript library that provides high-level functions enabling you to draw, move, and delete objects on a canvas, along with many other functionalities.

## Refrences
- <a href="#Installation">Installation</a>
- <a href="#Canvas-Props">Canvas Props</a>
- <a href="#Methods">Methods</a>
- <a href="#Events">Events</a>

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
You can set up default values for you canvas:
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

## Methods
### setObject
To create an object in the canvas you can use the `setObject` method:
```js
canvas.setObject(object);
```
Example:
```js
const canvas = new CanvasFlow(myCanvas, { defaultValues: { fill: "green" } });
canvas.setObject({
    id: 1,
    type: "rectangle",
    x: 15,
    y: 15,
    width: 50,
    height: 50,
    fill: "black"
});
```
#### Tips:
- The `fill` property that been provided in the method will replace the default value (the rectangle will be black).

### setObjects
To create multiple objects in the canvas you can use the `setObjects` method:
```js
canvas.setObjects([object, object, ...]);
```
Example:
```js
canvas.setObjects({
    id: 1,
    type: "rectangle",
    x: 15,
    y: 15,
    width: 50,
    height: 50,
    fill: "black"
}, {
    id: 2,
    type: "circle",
    x: 30,
    y: 30,
    width: 50,
    height: 50,
    fill: "#ff0"
});
```
#### Tips:
- The `id` property is must be unique or you'll overlap the old object that has the same id.

### updateObject
To update an object properties in the canvas, you can use the `updateObject` method:
```js
canvas.updateObject(id, newProps);
```
Example:
```js
canvas.setObject({
    id: 1,
    type: "rectangle",
    x: 15,
    y: 15,
    width: 50,
    height: 50,
    fill: "black"
});

canvas.updateObject(1, {
    width: 150,
    height: 150,
    fill: "red"
});
```
#### Tips:
- The object with the id `1` will be rendered firstly as a black square with length of 50/50 then rendered as a red square with length of 150/150.
- The `updateObject` method just replaces the exact properties of the object with the new properties that been provided. When using the `setObject` method to update the object, the object properties that not been provided with the new properties, will be deleted.

### getObject
To get and read an object properties and its position in the canvas, you can use the `getObject` method:
```js
canvas.getObject(id);
```
#### Returns `Object`
Example:
```js
const myFirstObject = canvas.getObject(1);
```

### getObjects
To get all the objects in the canvas, you can use the `getObjects` method:
```js
canvas.getObjects();
```
#### Returns `[Object, Object, ...]`
Example:
```js
const myObjects = canvas.getObjects();
```

### deleteObject
To delete an object from the canvas, you can use the `deleteObject` method:
```js
canvas.deleteObject(id);
```
Example:
```js
canvas.deleteObject(1);
```
This will delete the object from the canvas and never been re-rendered.

### moveObject
To move an object in the canvas, you can use the `moveObject` method:
```js
canvas.moveObject(id, newX, newY, mode);
```
Example:
```js
canvas.moveObject(1, 30, 30, "relative");
```
| Mode | Description |
| ---- | ----------- |
| Absolute (Default) | Moving the object to the new x and new y position |
| Relative | Moving the object to the new x and new y position from the current position |
### clearCanvas
To clear the canvas and deleting all the objects, you can use the `clearCanvas` method:
```
canvas.clearCanvas();
```
## Events
To listen to any event, you can use the `on` method:
```js
canvas.on(eventName, callback);
```
#### Returns `stopEvent()`
Example:
```js
const stopClickEvent = canvas.on("click", (e) => {
    console.log(e);
    stopClickEvent()
});
```
