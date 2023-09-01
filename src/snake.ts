import Game from "./game";

type SnakeDirection = 0 | 1 | 2 | 3; // 左，下，右，上
type Coordinate = [number, number];

const SnakeDirections: SnakeDirection[] = [0, 1, 2, 3];
class Snake extends Game {
  snake: SnakeDirection[] = [];
  actions: SnakeDirection[] = [];
  head: Coordinate = [0, 0];
  snakeCoordinate: Coordinate[] = [];
  food: Coordinate | null = null;
  constructor(canvas: HTMLCanvasElement, options: any) {
    super(canvas, options);
  }

  public onSceneLoading(): void {
    //   init snake
    this.initSnake();
    // 起始点设在图中心
    const {
      grids: [gridX, gridY],
    } = this.scene;
    this.head = [Math.floor(gridX / 2), Math.floor(gridY / 2)];
  }
  public onSceneRender(): void {
    //   render snake
    this.renderSnake();
    // render apple position
  }
  public onGameStart(): void {
    //   onProcessing
    this.renderFood();
    requestAnimationFrame(this.processing.bind(this));
  }

  private initSnake() {
    const initDirection = SnakeDirections[Math.floor(Math.random() * 4)];
    this.snake = new Array(5).fill(0).map(() => initDirection);
  }

  private getNextNode(
    [x, y]: Coordinate,
    direction: SnakeDirection | null | undefined
  ): Coordinate {
    switch (direction) {
      case 0:
        return [x - 1, y];
      case 1:
        return [x, y - 1];

      case 2:
        return [x + 1, y];

      case 3:
        return [x, y + 1];
      default:
        return [x, y];
    }
  }
  private getAhead(
    [x, y]: Coordinate,
    direction: SnakeDirection | null | undefined
  ): Coordinate {
    switch (direction) {
      case 0:
        return [x + 1, y];
      case 1:
        return [x, y + 1];

      case 2:
        return [x - 1, y];

      case 3:
        return [x, y - 1];
      default:
        return [x, y];
    }
  }

  private processing(time: EpochTimeStamp) {
    if (this.status !== "start") return;
    if (time - this.frameFlashAt > 300) {
      this.frameFlashAt = time;

      this.onProcessing();
    }

    requestAnimationFrame(this.processing.bind(this));
  }

  renderSnake() {
    const {
      ctx,
      scene: { gridSize },
      head,
      snake,
      food,
    } = this;

    let colorValue = 255;
    const attenuator = Math.round(150 / snake.length);
    let node = head;
    node = this.getAhead(node, null);
    ctx.fillStyle = "#ffc218";
    // 渲染头部
    const [x, y] = node;
    ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
    this.snakeCoordinate = [node];

    snake.slice(0).forEach((ele, index) => {
      node = this.getNextNode(node, ele);
      const [x, y] = node;
      this.snakeCoordinate.push(node);
      ctx.fillStyle = `rgb(${colorValue - index * attenuator},${
        colorValue - index * attenuator
      },${colorValue - index * attenuator})`;
      ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
    });

    if (this.checkBiteSelf([x, y])) {
      this.gameOver();
      return;
    }
  }

  renderFood() {
    const {
      ctx,
      food,
      scene: { gridSize },
    } = this;

    if (!food) {
      this.food = this.getRandomFood();
    }
    const [foodX, foodY] = this.food!;
    ctx.fillStyle = "#ff0218";

    ctx.fillRect(foodX * gridSize, foodY * gridSize, gridSize, gridSize);
  }
  private getRandomFood(): Coordinate {
    const {
      scene: {
        grids: [gridX, gridY],
      },
    } = this;

    const randomFood: Coordinate = [
      Math.floor(Math.random() * gridX),
      Math.floor(Math.random() * gridY),
    ];
    if (this.checkBiteSelf(randomFood)) {
      return this.getRandomFood();
    }
    return randomFood;
  }

  private eatFood() {}
  private checkBiteSelf([x, y]: Coordinate) {
    let isBiteSelf = false;
    let snakeLength = this.snakeCoordinate.length;
    while (snakeLength--) {
      const [bodyX, bodyY] = this.snakeCoordinate[snakeLength];
      if (x === bodyX && y === bodyY && snakeLength !== 0) {
        isBiteSelf = true;
        break;
      }
    }

    return isBiteSelf;
  }
  private checkBoundary(direction: SnakeDirection) {
    const {
      head: [headX, headY],
      scene: {
        grids: [gridX, gridY],
      },
    } = this;

    switch (direction) {
      case 0:
        return headX + 1 >= gridX;
      case 1:
        return headY + 1 >= gridY;

      case 2:
        return headX - 1 < 0;

      case 3:
        return headY - 1 < 0;
      default:
        return false;
    }
  }

  private moveTo(to: SnakeDirection) {
    if (this.status !== "start") return;
    if ((to + 2) % 4 === this.snake[0]) return;

    if (this.checkBoundary(to)) {
      this.gameOver();
      return;
    }

    this.actions.push(to);
    this.onProcessing();
  }

  private onProcessing() {
    const { head, actions, food } = this;
    let direction = actions.shift();
    if (typeof direction !== "number") {
      direction = this.snake[0];
      if (this.checkBoundary(direction)) {
        this.gameOver();
        return;
      }
    }

    const ahead = this.getAhead(head, direction);
    this.head = ahead;

    this.snake.unshift(direction);
    if (food && ahead[0] === food[0] && ahead[1] === food[1]) {
      this.eatFood();
      this.food = null;
    } else {
      this.snake.pop();
    }

    this.resetStage();
    this.renderSnake();
    this.renderFood();
  }

  public handler = {
    up: () => {
      this.moveTo(3);
    },
    down: () => {
      this.moveTo(1);
    },
    toLeft: () => {
      this.moveTo(2);
    },
    toRight: () => {
      this.moveTo(0);
    },
    start: () => {
      this.gameStart();
    },
    home: () => {},
    oprY: () => {
      this.gameSuspend();
    },
    oprX: () => {
      // this.onHandleRotateLeft();
    },
    oprA: () => {},
    oprB: () => {
      // this.onHandleRotateRight();
    },
    speedUp: () => {
      // this.speedUp();
    },
  };
}

export default Snake;
