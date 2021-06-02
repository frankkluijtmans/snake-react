import { ICoordinate } from "../interfaces/coordinate.interface";
import { Food } from "./food/Food";
import { FoodFactory } from "./FoodFactory";
import { Plane } from "./Plane";
import { Snake } from "./Snake";
import { Input } from "./Input";

export class Game {
    
    readonly FRAME_RATE: number = 10;
    private plane: Plane = new Plane();
    private snake: Snake = new Snake();
    private input: Input = new Input();
    private food: Food[] = [];
    private foodFactory: FoodFactory = new FoodFactory();
    private gameLoop: any;

    public setup(): void {

        this.reset();
        this.snake.bindInput(
            this.input
        );
        this.tick();
    }

    public tick(): void {

        this.gameLoop = setInterval(() => {
            this.snake.update();

            if(this.checkCollision(
                this.snake.coordinates[this.snake.coordinates.length - 1],
                this.snake.coordinates.slice(0, this.snake.coordinates.length - 1)
            )) {
                clearInterval(this.gameLoop);
                return;
            }

            if(this.checkBounds(
                this.snake.coordinates[this.snake.coordinates.length - 1]
            )) {
                clearInterval(this.gameLoop);
                return;
            }

            this.snake.draw(this.plane);
        }, 1000 / this.FRAME_RATE);
    }

    private reset(): void {

        this.plane.init();
        this.snake.init(
            this.plane
        );
        this.food = new Array(10).fill(
            this.foodFactory.create()
        );
    }

    private checkCollision(baseCoordinate: ICoordinate, coordinatesToCheck: ICoordinate[]): boolean {

        return coordinatesToCheck.some((coordinate: ICoordinate) => {
            return coordinate.x === baseCoordinate.x && coordinate.y === baseCoordinate.y;
        });
    }

    private checkBounds(coordinate: ICoordinate): boolean {
        
        if(coordinate.x < 0 
            || coordinate.x > (this.plane.gridSize.width - 1)
            || coordinate.y < 0
            || coordinate.y > (this.plane.gridSize.height - 1)) {
            return true;
        }

        return false;
    }
}