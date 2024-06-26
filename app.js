class PixiApp {
    constructor(app) {
        this.app = app;
        this.shapes = [];
        this.shapesNumber = 1;
        this.gravityValue = 1;

        this.changeGravityValueHandler();
        this.changeShapesNumberHandler();
    }

    appendChildToCanvas(canvas) {
        canvas.appendChild(this.app.view);
    }

    startAnimation() {
        setInterval(() => {
            let generatedShapes = 1;
            while (this.shapesNumber >= generatedShapes) {
                this.generateShape();
                generatedShapes++;
            }
        }, 1000);

        this.app.ticker.add((delta) => {
            this.shapes.forEach((shape) => {
                shape.update(delta, this.gravityValue);
            });
        });
    }

    generateShape(x, y) {
        const allShapes = [Triangle, Circle, Rectangle];
        const randomIndex = Math.floor(Math.random() * allShapes.length);
        const randomShape = allShapes[randomIndex];

        const newShape = new randomShape(this.app);
        newShape.draw(this.getRandomColor());
        newShape.add();
        newShape.setCoordinates(x, y);
    }

    isClickOnShape(x, y, shape) {
        const bounds = shape.shape.getBounds();
        return (
            x >= bounds.x &&
            x <= bounds.x + bounds.width &&
            y >= bounds.y &&
            y <= bounds.y + bounds.height
        );
    }

    onClickCanvas(canvas) {
        canvas.addEventListener("pointerdown", (event) => {
            const clickX = event.clientX - canvas.getBoundingClientRect().left;
            const clickY = event.clientY - canvas.getBoundingClientRect().top;

            let clickedShape, x, y;
            const clickOnAnyShape = this.shapes.find((shape) => {
                if (this.isClickOnShape(clickX, clickY, shape)) {
                    clickedShape = shape;
                    return true;
                } else {
                    x = clickX;
                    y = clickY;
                    return false;
                }
            });
            if (clickOnAnyShape) {
                clickedShape.remove();
            } else {
                this.generateShape(x, y);
            }
        });
    }

    getRandomColor() {
        const letters = "0123456789ABCDEF";
        let color = "0x";

        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }

        return color;
    }

    countShapes() {
        const domElShapesNumber = document.getElementById("nr-shapes");
        domElShapesNumber.innerText =
            this.shapes.length > 0 ? this.shapes.length : 0;
    }

    countAreaValue() {
        const domElAreaValue = document.getElementById("area-shapes");
        domElAreaValue.innerText = this.shapes.reduce((total, shape) => {
            return total + shape.getArea();
        }, 0);
    }

    changeGravityValueHandler() {
        const gravityIncreaseButton =
            document.getElementById("gravity-increase");
        const gravityDecreaseButton =
            document.getElementById("gravity-decrease");

        gravityIncreaseButton.addEventListener("click", () => {
            if (this.gravityValue <= 10) {
                this.gravityValue += 1;
            }
        });
        gravityDecreaseButton.addEventListener("click", () => {
            if (this.gravityValue > 1) {
                this.gravityValue -= 1;
            }
        });
    }

    changeShapesNumberHandler() {
        const shapesIncreaseButton = document.getElementById("shapes-increase");
        const shapesDecreaseButton = document.getElementById("shapes-decrease");

        shapesIncreaseButton.addEventListener("click", () => {
            if (this.shapesNumber <= 100) {
                this.shapesNumber += 1;
            }
        });
        shapesDecreaseButton.addEventListener("click", () => {
            if (this.shapesNumber > 1) {
                this.shapesNumber -= 1;
            }
        });
    }
}
class Shape {
    constructor() {
        this.shape = new PIXI.Graphics();
    }

    setCoordinates(x, y) {
        if (x && y) {
            this.shape.x = x;
            this.shape.y = y;
        } else {
            this.shape.x =
                Math.random() * (this.app.screen.width - this.shape.width);
            this.shape.y = -this.shape.height;
        }
    }

    add() {
        this.app.stage.addChild(this.shape);
        app.shapes.push(this); //app
        app.countShapes();
        app.countAreaValue();
    }

    remove() {
        this.app.stage.removeChild(this.shape);
        const index = app.shapes.indexOf(this);
        if (index !== -1) {
            app.shapes.splice(index, 1);
        } //app
        this.shape.removeAllListeners("pointerdown");
    }
    update(delta, speed) {
        this.shape.y += speed * delta;

        if (this.shape.y > this.app.screen.height) {
            this.remove();
            app.countShapes();
            app.countAreaValue();
        }
    }
}

class Rectangle extends Shape {
    constructor(app) {
        super();
        this.app = app;
    }
    draw(color) {
        this.shape
            .beginFill(color)
            .lineStyle(1, 0x000000, 1)
            .drawRect(0, 0, 70, 30);
    }
    getArea() {
        return this.shape.height != 0 && this.shape.width != 0
            ? this.shape.height * this.shape.width
            : 0;
    }
}

class Triangle extends Shape {
    constructor(app) {
        super();
        this.app = app;
    }
    draw(color) {
        this.shape
            .beginFill(color)
            .lineStyle(1, 0x000000, 1)
            .moveTo(0, 0)
            .lineTo(70, 20)
            .lineTo(20, 70)
            .closePath();
    }
    getArea() {
        const vertices = this.shape.geometry.points;

        if (vertices.length > 0) {
            const x1 = vertices[0];
            const y1 = vertices[1];
            const x2 = vertices[2];
            const y3 = vertices[5];
            const base = Math.abs(x2 - x1);
            const height = Math.abs(y3 - y1);
            return 0.5 * base * height;
        }
        return 0;
    }
}

class Circle extends Shape {
    constructor(app) {
        super();
        this.app = app;
    }
    draw(color) {
        this.shape
            .beginFill(color)
            .lineStyle(1, 0x000000, 1)
            .drawCircle(0, 0, 25);
    }
    getArea() {
        return this.shape.radius != 0
            ? Math.floor(Math.PI * Math.pow(this.shape.width / 2, 2))
            : 0;
    }
}

const canvas = document.querySelector(".canvas");
const app = new PixiApp(
    new PIXI.Application({
        backgroundColor: 0xd0ba98,
        resizeTo: window,
    })
);

app.appendChildToCanvas(canvas);
app.startAnimation();
app.onClickCanvas(canvas);
