<div align="center">
<img height="300px" src="https://github.com/jehaad1/CanvasFlow/blob/main/CanvasFlow.png?raw=true" />
  <h1>CanvasFlow</h1>
</div>

Welcome to the CanvasFlow documentation, a JavaScript library that allow you to create and move objects on an HTML canvas with ease.

## Online Demos:
- [Kashkol](https://kashkol.jehaad.com)

## Table of Contents
- [Installation](#installation)
- [Initialization](#initialization)
- [Canvas Properties](#canvas-properties)
- [Methods](#methods)
- [Events](#events)
- [Object Types](#object-types)
- [Important Tips](#important-tips)

## Installation

You can install CanvasFlow using either npm or by including it directly from a CDN.

### npm Installation

To install CanvasFlow using npm, run the following command:

```bash
npm install canvasflow
```

### CDN Installation

You can include CanvasFlow in your HTML file using the following CDN link:

```html
<script src="https://unpkg.com/canvasflow@1.0.0/cdn.js"></script>
```

## Initialization

To get started with CanvasFlow, follow these steps:

1. Import the `CanvasFlow` class:

```js
import CanvasFlow from "canvasflow";
```

2. Create a canvas element in your HTML:

```js
<canvas class="MyCanvas"></canvas>
```

3. Initialize CanvasFlow:

```js
const myCanvas = document.querySelector("canvas.MyCanvas");
const canvas = new CanvasFlow(myCanvas);
```

With these steps, you're ready to begin drawing on the canvas using CanvasFlow.

## Canvas Properties

When initializing the canvas, you can provide optional properties to customize its behavior. Here are the available properties:

```js
const canvas = new CanvasFlow(myCanvas, {
  defaultValues: {
    fill: "green",
    // Other default property values...
  },
});
```

The following table lists the available canvas properties and their descriptions:

| Property     | Type   | Default Value | Description                                      |
| ------------ | ------ | ------------- | ------------------------------------------------ |
| x            | Number | 0             | Default x position of objects on the canvas     |
| y            | Number | 0             | Default y position of objects on the canvas     |
| width        | Number | 0             | Default width of objects on the canvas          |
| height       | Number | 0             | Default height of objects on the canvas         |
| fill         | String | "black"       | Default background color of objects on the canvas |
| stroke       | Object | { fill: "black", width: 0 } | Default stroke properties of objects on the canvas |
| font         | Object | { family: "sans-serif", size: 10 } | Default font properties of text objects on the canvas |
| borderRadius | Number | 0             | Default border radius of objects on the canvas  |
| rotation     | Number | 0             | Default rotation of objects on the canvas       |
| opacity      | Number | 1             | Default opacity of objects on the canvas        |
| zIndex       | Number | 0             | Default z-index of objects on the canvas        |
| translate    | Object | { x: 0, y: 0 } | Default translate position of objects on the canvas |

## Methods

CanvasFlow provides various methods to interact with and manipulate objects on the canvas.

### setObject

Use the `setObject` method to create an object on the canvas:

```js
canvas.setObject(object);
```

Example:

```js
const rectangle = {
    id: 1,
    type: "rectangle",
    x: 15,
    y: 15,
    width: 50,
    height: 50,
    fill: "black"
};

canvas.setObject(rectangle);
```

### setObjects

The `setObjects` method allows you to create multiple objects on the canvas:

```js
canvas.setObjects([object, object, ...]);
```

Example:

```js
const objects = [
    {
        id: 1,
        type: "rectangle",
        x: 15,
        y: 15,
        width: 50,
        height: 50,
        fill: "black"
    },
    {
        id: 2,
        type: "circle",
        x: 30,
        y: 30,
        width: 50,
        height: 50,
        fill: "#ff0"
    }
];

canvas.setObjects(...objects);
```

### updateObject

You can update an object's properties using the `updateObject` method:

```js
canvas.updateObject(id, newProps);
```

Example:

```js
canvas.updateObject(1, {
    width: 150,
    height: 150,
    fill: "red"
});
```

### getObject

Retrieve an object's properties and position using the `getObject` method:

```js
const myObject = canvas.getObject(id);
```

### getObjects

To get all objects on the canvas, use the `getObjects` method:

```js
const allObjects = canvas.getObjects();
```

### deleteObject

The `deleteObject` method removes an object from the canvas:

```js
canvas.deleteObject(id);
```

### moveObject

Move an object using the `moveObject` method:

```js
canvas.moveObject(id, newX, newY, mode);
```

Modes:

- Absolute (Default): Move object to new x and y positions.
- Relative: Move object from current position to new x and y positions.

### clearCanvas

The `clearCanvas` method clears the canvas and removes all objects:

```js
canvas.clearCanvas();
```

## Events

CanvasFlow supports event handling using the `on` method:

```js
const stopEvent = canvas.on(eventName, callback);
```

Example:

```js
const stopClickEvent = canvas.on("click", (e) => {
    console.log(e);
    stopClickEvent();
});
```

## Object Types

CanvasFlow supports various object types:

### Rectangle Object

```js
const rectangle = {
    type: "rectangle",
    fill: "black",
    width: 50,
    height: 50
};

canvas.setObject(rectangle);
```

### Triangle Object

```js
const triangle = {
    type: "triangle",
    fill: "blue",
    width: 70,
    height: 70
};

canvas.setObject(triangle);
```

### Circle Object

```js
const circle = {
    type: "circle",
    fill: "green",
    width: 70,
    height: 70
};

canvas.setObject(circle);
```

### Text Object

```js
const text = {
    type: "text",
    text: "Hello World!",
    font: {
        family: "Arial",
        size: 24
    },
    fill: "black"
};

canvas.setObject(text);
```

### Image Object

```js
const image = {
    type: "image",
    url: "./MyImage.png",
    width: 200,
    height: 200
};

canvas.setObject(image);
```

### Path Object

```js
const path = {
    type: "path",
    path: "M150 0 L75 200 L225 200 Z",
    fill: "black"
};

canvas.setObject(path);
```

### Custom Object

```js
const custom = {
    type: "custom",
    draw: function(ctx, canvas, props) { /* drawing a custom object */ },
    fill: "black"
};

canvas.setObject(custom);
```

## Important Tips

Here are some tips to keep in mind while using CanvasFlow:

- When using the `setObject` method to create or update an object, any properties provided will override the default values. This allows you to easily customize individual objects on the canvas.

- When using the `setObjects` method to create multiple objects, ensure that each object's `id` property is unique. Objects with the same `id` may overlap or cause unexpected behavior.

- The `updateObject` method only replaces the exact properties provided with the new properties. If you use the `setObject` method to update an object, any properties not specified will be deleted from the object.

- The `objects` property within the event object (`e`) contains an array of objects that the cursor is over when an event is fired. This is useful for event handling and interaction with specific objects on the canvas.

- Event handling with CanvasFlow is done using the `on` method. Remember to call the returned function (e.g., `stopClickEvent()`) to stop listening to the event when it's no longer needed.

- The `objects` property within the event object is sorted by z-index in descending order. This means that the first object in the array has the highest z-index value, and subsequent objects have lower z-index values.

Keep these tips in mind to make the most of CanvasFlow's capabilities and enhance your canvas-based applications.
