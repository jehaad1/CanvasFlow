const errorCodes = new Map([
  [100, "Missing props. Objects require an 'id' property."],
  [101, "Invalid argument. Argument must be an object."],
  [102, "Invalid argument. Argument must be an array of objects."],
  [103, "Invalid canvas. No canvas captured."],
  [104, "Invalid argument. Argument must be a string."],
  [105, "Invalid argument. Argument must be a function."],
  [106, "Invalid Id. No object found with that Id."],
  [107, "Missing props. Custom objects require a 'draw' property."],
  [108, "Invalid props. 'draw' must be a function."],
  [109, "Missing props. Objects require a 'type' property."],
  [110, "Missing props. Image objects require a 'url' property."],
  [111, "Updating props declined. 'id' cannot be updated."],
  [112, "Updating props declined. 'type' cannot be updated."],
  [113, "Invalid initialize props. 'defaultValues' must be an object."],
  [114, "Missing props. Text objects require a 'text' property."],
  [115, "Missing props. Path objects require a 'path' property."],
  [116, "Missing props. Line objects require 'from' and 'to' properties."],
  [117, "Invalid props. 'scale' must be 0 or a positive number."],
  [
    118,
    "Invalid props. 'isChunk' can only be used with circle, path, and rectangle.",
  ],
  [119, "Missing props. Polygon objects require a 'points' property."],
]);

export default class CanvasFlow {
  objects = new Map();
  images = new Map();
  defaultValues = new Map([
    ["x", 0],
    ["y", 0],
    ["width", 0],
    ["height", 0],
    ["fill", "black"],
    ["stroke", { fill: "black", width: 0 }],
    ["font", { family: "sans-serif", size: 10 }],
    ["borderRadius", 0],
    ["rotation", 0],
    ["opacity", 1],
    ["zIndex", 0],
    ["translate", { x: 0, y: 0 }],
    ["scale", 1],
    ["isChunk", false],
    ["points", []],
  ]);

  canvas;
  ctx;
  touch = null;

  constructor(element, options) {
    if (!(element instanceof HTMLElement) && typeof element !== "string")
      throw Error(errorCodes.get(103));

    if (options && options.defaultValues) {
      if (typeof options.defaultValues !== "object")
        throw Error(errorCodes.get(113));

      Object.entries(options.defaultValues).forEach(([key, value]) => {
        this.defaultValues.set(key, value);
      });
    }

    this.canvas =
      typeof element === "string" ? document.querySelector(element) : element;

    this.ctx = this.canvas.getContext("2d");
  }

  setObject(object) {
    return new Promise((resolve, reject) => {
      if (typeof object !== "object") return reject(Error(errorCodes.get(101)));

      const { id, ...props } = object;

      if (id == null) return reject(Error(errorCodes.get(100)));
      if (props.type === "path" && props.path) {
        const { x, y, width, height } = getPathProps(props.path);
        if (!props.x) props.x = x;
        if (!props.y) props.y = y;
        if (!props.width) props.width = width;
        if (!props.height) props.height = height;
      }

      this.objects.set(id, props);

      if (props.type === "image") {
        if (!props.url) return reject(Error(errorCodes.get(110)));

        const image = new Image();
        image.src = props.url;
        image.onload = () => {
          this.images.set(id, image);
          const paths = drawCanvas(
            this.canvas,
            this.objects,
            this.ctx,
            this.images,
            this.defaultValues
          );
          paths.forEach(({ id, x, y, width, height }) => {
            const object = this.objects.get(id);
            const newX = object.x ?? x;
            const newY = object.y ?? y;
            const newWidth = object.width ?? width;
            const newHeight = object.height ?? height;
            this.objects.set(id, {
              ...object,
              x: newX,
              y: newY,
              width: newWidth,
              height: newHeight,
            });
          });
          resolve(object);
        };
        image.onerror = reject;
      } else {
        const paths = drawCanvas(
          this.canvas,
          this.objects,
          this.ctx,
          this.images,
          this.defaultValues
        );
        paths.forEach(({ id, x, y, width, height }) => {
          const object = this.objects.get(id);
          const newX = object.x ?? x;
          const newY = object.y ?? y;
          const newWidth = object.width ?? width;
          const newHeight = object.height ?? height;
          this.objects.set(id, {
            ...object,
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight,
          });
        });
        resolve(object);
      }
    });
  }

  setObjects(objects) {
    return new Promise((resolve, reject) => {
      if (
        !Array.isArray(objects) ||
        objects.some((o) => typeof o !== "object" || !o)
      )
        return reject(Error(errorCodes.get(102)));

      const imagePromises = [];

      objects.forEach((object) => {
        const { id, ...props } = object;

        if (id == null) return reject(Error(errorCodes.get(100)));

        if (props.type === "path" && props.path) {
          const { x, y, width, height } = getPathProps(props.path);
          if (!props.x) props.x = x;
          if (!props.y) props.y = y;
          if (!props.width) props.width = width;
          if (!props.height) props.height = height;
        }

        if (props.type === "image") {
          if (!props.url) return reject(Error(errorCodes.get(110)));

          const image = new Image();
          image.src = props.url;
          const imagePromise = new Promise((resolve) => {
            image.onload = () => {
              this.images.set(id, image);
              resolve();
            };
            image.onerror = reject;
          });

          imagePromises.push(imagePromise);
        }

        this.objects.set(id, props);
      });

      if (imagePromises.length === 0) {
        const paths = drawCanvas(
          this.canvas,
          this.objects,
          this.ctx,
          this.images,
          this.defaultValues
        );
        paths.forEach(({ id, x, y, width, height }) => {
          const object = this.objects.get(id);
          const newX = object.x ?? x;
          const newY = object.y ?? y;
          const newWidth = object.width ?? width;
          const newHeight = object.height ?? height;
          this.objects.set(id, {
            ...object,
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight,
          });
        });
        resolve(objects);
      } else {
        Promise.all(imagePromises)
          .then(() => {
            const paths = drawCanvas(
              this.canvas,
              this.objects,
              this.ctx,
              this.images,
              this.defaultValues
            );
            paths.forEach(({ id, x, y, width, height }) => {
              const object = this.objects.get(id);
              const newX = object.x ?? x;
              const newY = object.y ?? y;
              const newWidth = object.width ?? width;
              const newHeight = object.height ?? height;
              this.objects.set(id, {
                ...object,
                x: newX,
                y: newY,
                width: newWidth,
                height: newHeight,
              });
            });
            resolve(objects);
          })
          .catch(reject);
      }
    });
  }

  updateObject(id, updatedProps) {
    return new Promise((resolve, reject) => {
      if (id == null) return reject(Error(errorCodes.get(100)));
      if (typeof updatedProps !== "object")
        return reject(Error(errorCodes.get(101)));

      let object = this.objects.get(id);

      if (!object) return reject(Error(errorCodes.get(106)));

      let needsRedraw = false;

      Object.entries(updatedProps).forEach(([key, value]) => {
        if (key === "id") return reject(Error(errorCodes.get(111)));
        if (key === "type") return reject(Error(errorCodes.get(112)));

        if (key === "url") needsRedraw = true;

        if (key === "path" && object.type === "path") {
          const { x, y, width, height } = getPathProps(value);
          if (!object.x) object.x = x;
          if (!object.y) object.y = y;
          if (!object.width) object.width = width;
          if (!object.height) object.height = height;
        }

        object[key] = value;
      });

      if (object.type === "image" && needsRedraw) {
        if (!object.url) return reject(Error(errorCodes.get(110)));

        const image = new Image();
        image.src = object.url;
        image.onload = () => {
          this.images.set(id, image);
          const paths = drawCanvas(
            this.canvas,
            this.objects,
            this.ctx,
            this.images,
            this.defaultValues
          );
          paths.forEach(({ id, width, height }) => {
            this.objects.set(id, { ...this.objects.get(id), width, height });
          });
          resolve(object);
        };
        image.onerror = reject;
      } else {
        const paths = drawCanvas(
          this.canvas,
          this.objects,
          this.ctx,
          this.images,
          this.defaultValues
        );
        paths.forEach(({ id, x, y, width, height }) => {
          const object = this.objects.get(id);
          const newX = object.x ?? x;
          const newY = object.y ?? y;
          const newWidth = object.width ?? width;
          const newHeight = object.height ?? height;
          this.objects.set(id, {
            ...object,
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight,
          });
        });
        resolve(object);
      }
    });
  }

  getObject(id) {
    if (id == null) throw Error(errorCodes.get(100));

    let object = this.objects.get(id);

    return object;
  }

  getObjects() {
    return sortByZIndex(this.objects.entries(), this.defaultValues).map(
      ([id, object]) => ({ id, ...object })
    );
  }

  getObjectsByClassName(className) {
    return sortByZIndex(this.objects.entries(), this.defaultValues)
      .filter(([, object]) => object.classes.split(" ").includes(className))
      .map(([id, object]) => ({ id, ...object }));
  }

  deleteObject(id) {
    this.objects.delete(id);
    this.images.delete(id);
    const paths = drawCanvas(
      this.canvas,
      this.objects,
      this.ctx,
      this.images,
      this.defaultValues
    );
    paths.forEach(({ id, x, y, width, height }) => {
      const object = this.objects.get(id);
      const newX = object.x ?? x;
      const newY = object.y ?? y;
      const newWidth = object.width ?? width;
      const newHeight = object.height ?? height;
      this.objects.set(id, {
        ...object,
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      });
    });
  }

  isObjectExists(id) {
    return this.objects.has(id);
  }

  moveObject(id, deltaX, deltaY, relative) {
    if (id == null) throw Error(errorCodes.get(100));

    let object = this.objects.get(id);

    if (!object) throw Error(errorCodes.get(106));

    if (["line", "path", "polygon"].includes(object.type)) {
      if (object.translate) {
        if (relative === "relative") {
          object.translate.x += deltaX;
          object.translate.y += deltaY;
        } else {
          object.translate.x = deltaX;
          object.translate.y = deltaY;
        }
      } else {
        object.translate = { x: deltaX, y: deltaY };
      }
    } else {
      if (relative === "relative") {
        object.x = (object.x ?? 0) + deltaX;
        object.y = (object.y ?? 0) + deltaY;
      } else {
        object.x = deltaX;
        object.y = deltaY;
      }
    }

    const paths = drawCanvas(
      this.canvas,
      this.objects,
      this.ctx,
      this.images,
      this.defaultValues
    );
    paths.forEach(({ id, x, y, width, height }) => {
      const object = this.objects.get(id);
      const newX = object.x ?? x;
      const newY = object.y ?? y;
      const newWidth = object.width ?? width;
      const newHeight = object.height ?? height;
      this.objects.set(id, {
        ...object,
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      });
    });
  }

  clearCanvas() {
    if (!this.canvas) throw Error(errorCodes.get(103));

    this.objects.clear();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  on(eventName, callback) {
    if (typeof eventName !== "string") throw Error(errorCodes.get(104));
    if (typeof callback !== "function") throw Error(errorCodes.get(105));
    if (!this.canvas) throw Error(errorCodes.get(103));

    let eventHandler = (event) => {
      event.objects = sortByZIndex(this.objects.entries(), this.defaultValues)
        .filter(
          ([
            ,
            {
              x,
              y,
              from,
              to,
              translate,
              width,
              height,
              type,
              path,
              points,
              text,
              scale,
              rotation,
              stroke,
            },
          ]) => {
            let clientX, clientY;

            if (eventName.startsWith("touch")) {
              if (eventName === "touchstart" && this.touch == null) {
                this.touch = event.touches[0].identifier;
              }

              if (eventName === "touchend") {
                if (this.touch !== event.changedTouches[0].identifier) {
                  return false;
                }

                clientX = event.changedTouches[0].clientX;
                clientY = event.changedTouches[0].clientY;
                this.touch = null;
              }
              if (this.touch !== event.changedTouches[0].identifier) {
                return false;
              }

              clientX = event.touches[0].clientX;
              clientY = event.touches[0].clientY;
            } else {
              clientX = event.offsetX;
              clientY = event.offsetY;
            }

            x = (x ?? 0) * (scale ?? 1);
            y = (y ?? 0) * (scale ?? 1);
            width = (width ?? 0) * (scale ?? 1);
            height = (height ?? 0) * (scale ?? 1);

            if (translate) {
              x = (translate.x ?? 0) + (x ?? 0);
              y = (translate.y ?? 0) + (y ?? 0);
            }

            if (!rotation || rotation === 0) {
              const object = new Path2D();
              if (type === "circle") {
                object.arc(x, y, width / 2, 0, 2 * Math.PI);
              } else if (type === "path") {
                if (!(path ?? this.defaultValues.get("path")))
                  throw Error(errorCodes.get(115));
                let { x, y, width, height } = getPathProps(
                  path ?? this.defaultValues.get("path")
                );
                if (translate) {
                  x = (translate.x ?? 0) + (x ?? 0);
                  y = (translate.y ?? 0) + (y ?? 0);
                }
                object.rect(x, y, width, height);
              } else if (type === "polygon") {
                let Points = points ?? this.defaultValues.get("points");
                if (!Points) throw Error(errorCodes.get(119));
                if (translate) {

                  Points = Points.map((point) => ({
                    x: point.x + (translate.x ?? 0),
                    y: point.y + (translate.y ?? 0),
                  }));
                }
                object.moveTo(Points[0].x, Points[0].y);
                for (let i = 1; i < Points.length; i++) {
                  object.lineTo(Points[i].x, Points[i].y);
                }
                object.lineTo(Points[0].x, Points[0].y);
              } else if (type === "line") {
                if (!from?.x || !from?.y || !to?.x || !to?.y)
                  throw Error(errorCodes.get(116));
                const smallestX = Math.min(from.x, to.x) + x;
                const largestX = Math.max(from.x, to.x) + x;
                const smallestY = Math.min(from.y, to.y) + y;
                const largestY = Math.max(from.y, to.y) + y;
                object.rect(
                  smallestX,
                  smallestY,
                  largestX - smallestX,
                  largestY - smallestY
                );
              } else if (type === "text") {
                if (text == null) throw Error(errorCodes.get(114));
                const fontSize =
                  object.font?.size ?? this.defaultValues.get("font").size;
                const fontFamily =
                  object.font?.family || this.defaultValues.get("font").family;
                this.ctx.textBaseline = "top";
                this.ctx.font = `${fontSize}px ${fontFamily}`;
                const measure = this.ctx.measureText(text);
                object.rect(
                  x,
                  y,
                  measure.width,
                  measure.actualBoundingBoxAscent +
                    measure.actualBoundingBoxDescent
                );
              } else {
                object.rect(x, y, width, height);
              }

              return (
                this.ctx.isPointInPath(object, clientX, clientY) ||
                this.ctx.isPointInStroke(object, clientX, clientY)
              );
            } else {

            }
          }
        )
        .map(([id, props]) => ({ id, ...props }));

      callback(event);
    };

    this.canvas.addEventListener(eventName, eventHandler);

    return () => {
      this.canvas.removeEventListener(eventName, eventHandler);
    };
  }
}

function drawCanvas(canvas, objects, ctx, images, defaultValues) {
  if (!canvas) throw Error(errorCodes.get(103));

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const pathProps = [];
  sortByZIndex(objects.entries(), defaultValues).forEach(([id, object]) => {
    const type = object.type || defaultValues.get("type");
    if (!type) throw Error(errorCodes.get(109));

    const scale = object.scale ?? defaultValues.get("scale");
    if (scale <= 0) throw Error(errorCodes.get(117));
    const x = object.x ?? defaultValues.get("x");
    const y = object.y ?? defaultValues.get("y");
    const text = object.text ?? defaultValues.get("text");
    const isChunk = object.isChunk ?? defaultValues.get("isChunk");

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (isChunk) {
      if (!["circle", "path", "rectangle"].includes(type))
        throw Error(errorCodes.get(118));
      const width = object.width ?? defaultValues.get("width");
      const height = object.height ?? defaultValues.get("height");
      ctx.scale(scale, scale);
      if (type === "circle") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.ellipse(x, y, width / 2, height / 2, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
      } else if (type === "path") {
        ctx.save();
        const path = object.path;
        if (!path) throw Error(errorCodes.get(115));
        ctx.clip(new Path2D(path));
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
        const { x, y, width, height } = getPathProps(path);
        pathProps.push({ id, width, height, x, y });
      } else if (type === "rectangle") {
        ctx.clearRect(x, y, width, height);
      }
      return;
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(scale, scale);
    ctx.fillStyle = object.fill || defaultValues.get("fill");
    ctx.strokeStyle = object.stroke?.fill || defaultValues.get("stroke").fill;
    ctx.lineWidth = object.stroke?.width ?? defaultValues.get("stroke").width;
    ctx.globalAlpha = object.opacity ?? defaultValues.get("opacity");

    if (type === "text") {
      if (text == null) throw Error(errorCodes.get(114));

      const fontSize = object.font?.size ?? defaultValues.get("font").size;
      const fontFamily =
        object.font?.family || defaultValues.get("font").family;
      ctx.textBaseline = "top";
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.fillText(text, x, y);

      if (object.stroke && object.stroke.width && object.stroke.fill) {
        ctx.strokeText(text, x, y);
      }
    } else {
      const width = object.width ?? defaultValues.get("width");
      const height = object.height ?? defaultValues.get("height");
      const borderRadius =
        object.borderRadius ?? defaultValues.get("borderRadius");
      const translate = object.translate ?? defaultValues.get("translate");
      const rotation = object.rotation ?? defaultValues.get("rotation");

      if (rotation) {
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.translate(-x, -y);
      }

      if (translate && (translate.x || translate.y)) {
        ctx.translate(translate.x, translate.y);
      }

      if (type === "custom") {
        const { draw, ...props } = object;

        if (!draw) throw Error(errorCodes.get(107));
        if (typeof draw !== "function") throw Error(errorCodes.get(108));

        draw(ctx, canvas, props);
      } else if (type === "image") {
        const image = images.get(id);
        if (image) ctx.drawImage(image, x, y, width, height);
      } else if (type === "path") {
        ctx.beginPath();
        const path = object.path;
        if (!path) throw Error(errorCodes.get(115));
        const path2D = new Path2D(path);
        ctx.fill(path2D);
        if (object.stroke && object.stroke.width && object.stroke.fill)
          ctx.stroke(path2D);
        ctx.closePath();
        const { x, y, width, height } = getPathProps(path);
        pathProps.push({ id, width, height, x, y });
      } else if (type === "polygon") {
        ctx.beginPath();

        const points = object.points ?? defaultValues.get("points");
        if (!points) throw Error(errorCodes.get(119));
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.lineTo(points[0].x, points[0].y);

        ctx.fill();
        if (object.stroke && object.stroke.width && object.stroke.fill)
          ctx.stroke();
        ctx.closePath();
      } else if (type === "rectangle") {
        ctx.beginPath();
        ctx.moveTo(x + borderRadius, y);
        ctx.lineTo(x + width - borderRadius, y);
        ctx.arcTo(x + width, y, x + width, y + borderRadius, borderRadius);
        ctx.lineTo(x + width, y + height - borderRadius);
        ctx.arcTo(
          x + width,
          y + height,
          x + width - borderRadius,
          y + height,
          borderRadius
        );
        ctx.lineTo(x + borderRadius, y + height);
        ctx.arcTo(x, y + height, x, y + height - borderRadius, borderRadius);
        ctx.lineTo(x, y + borderRadius);
        ctx.arcTo(x, y, x + borderRadius, y, borderRadius);
        ctx.fill();

        if (object.stroke && object.stroke.width && object.stroke.fill)
          ctx.stroke();

        ctx.closePath();
      } else if (type === "triangle") {
        ctx.beginPath();
        ctx.moveTo(x + borderRadius, y);
        ctx.arcTo(x + width, y, x + width, y + height, borderRadius);
        ctx.arcTo(x + width, y + height, x, y + height, borderRadius);
        ctx.lineTo(x, y + borderRadius);
        ctx.arcTo(x, y, x + borderRadius, y, borderRadius);
        ctx.fill();

        if (object.stroke && object.stroke.width && object.stroke.fill)
          ctx.stroke();

        ctx.closePath();
      } else if (type === "line") {
        ctx.beginPath();

        const from = object.from ?? defaultValues.get("from");
        const to = object.to ?? defaultValues.get("to");

        if (!from?.x || !from?.y || !to?.x || !to?.y)
          throw Error(errorCodes.get(116));

        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);

        if (object.stroke && object.stroke.width && object.stroke.fill)
          ctx.stroke();

        ctx.closePath();
      } else if (type === "circle") {
        ctx.beginPath();
        ctx.ellipse(x, y, width / 2, height / 2, 0, 0, 2 * Math.PI);
        ctx.fill();

        if (object.stroke && object.stroke.width && object.stroke.fill)
          ctx.stroke();

        ctx.closePath();
      }
    }
  });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  return pathProps;
}

function sortByZIndex(objects, defaultValues) {
  return [...objects].sort(([, object1], [, object2]) => {
    let zIndex1 = object1.zIndex ?? defaultValues.get("zIndex");
    let zIndex2 = object2.zIndex ?? defaultValues.get("zIndex");

    if (zIndex1 === undefined && zIndex2 === undefined) {
      return 0;
    }

    if (zIndex1 === undefined && zIndex2 > 0) {
      return -1;
    }

    if (zIndex2 === undefined && zIndex1 > 0) {
      return 1;
    }

    if (isNaN(zIndex1)) {
      zIndex1 = Infinity;
    }

    if (isNaN(zIndex2)) {
      zIndex2 = Infinity;
    }

    return zIndex1 - zIndex2;
  });
}

function getPathProps(path) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const svgPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  svgPath.setAttribute("d", path);
  svg.appendChild(svgPath);
  document.body.appendChild(svg);

  const bbox = svgPath.getBBox();

  document.body.removeChild(svg);

  return { width: bbox.width, height: bbox.height, x: bbox.x, y: bbox.y };
}
