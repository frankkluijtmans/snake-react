import { ICoordinate } from "../interfaces/coordinate.interface";
import { Food } from "./food/Food";
import { FoodFactory } from "./FoodFactory";
import { Plane } from "./Plane";
import { Snake } from "./Snake";
import { Input } from "./Input";
import { Helpers } from "./Helpers";

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

            // Check if any food is eaten
            this.food.forEach((food: Food, index) => {

                if(this.checkCollision(
                    this.snake.coordinates[this.snake.coordinates.length - 1],
                    [food.coordinate]
                )) {
                    food.eat(this.plane);
                    this.food.splice(index, 1);
                    this.food.push(this.foodFactory.create(this.getAvailableCoordinate()));
                    this.food[this.food.length - 1].draw(this.plane);
                    this.snake.incrementSize();
                }
            })

            // Check for collision on snake itself
            if(this.checkCollision(
                this.snake.coordinates[this.snake.coordinates.length - 1],
                this.snake.coordinates.slice(0, this.snake.coordinates.length - 1)
            )) {
                clearInterval(this.gameLoop);
                // Dispatch action to change gamestate
                return;
            }

            // Check for collision on bounds
            if(this.checkBounds(
                this.snake.coordinates[this.snake.coordinates.length - 1]
            )) {
                clearInterval(this.gameLoop);
                // Dispatch action to change gamestate
                return;
            }

            this.snake.draw(this.plane);
        }, 1000 / this.FRAME_RATE);
    }

    private reset(): void {
        
        // Initialize plane
        this.plane.init();

        // Initialize snake
        this.snake.init(
            this.plane
        );

        // Generate n pieces of food
        this.food = new Array(5).fill(0).map(() => {
            return this.foodFactory.create(this.getAvailableCoordinate())
        });

        // Draw every piece of food on the plane
        this.food.forEach((food: Food) => {
            food.draw(this.plane);
        });
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

    private getAvailableCoordinate(): ICoordinate {

        const occupiedCoordinates: ICoordinate[] = this.food.map((food: Food) => food.coordinate).concat(this.snake.coordinates);
        let generatedCoordinate: ICoordinate = {
            x: Helpers.generateRandomNumber(0, this.plane.gridSize.width - 1),
            y: Helpers.generateRandomNumber(0, this.plane.gridSize.height - 1)
        }

        while(this.checkCollision(generatedCoordinate, occupiedCoordinates)) {
            generatedCoordinate = {
                x: Helpers.generateRandomNumber(0, this.plane.gridSize.width - 1),
                y: Helpers.generateRandomNumber(0, this.plane.gridSize.height - 1)
            }
        }

        return generatedCoordinate;
    }
}