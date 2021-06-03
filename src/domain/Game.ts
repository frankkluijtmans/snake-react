import { ICoordinate } from "../interfaces/coordinate.interface";
import { Food } from "./food/Food";
import { FoodFactory } from "./FoodFactory";
import { Plane } from "./Plane";
import { Snake } from "./Snake";
import { Input } from "./Input";
import { Helpers } from "./Helpers";
import { store } from "../store/store";
import { FoodType } from "../enums/FoodType";
import { resetScore } from "../store/slices/GameState";
import { resetSideEffects } from "../store/slices/SideEffects";

export class Game {
    
    readonly FRAME_RATE: number = 6;
    private plane: Plane;
    private snake: Snake;
    private input: Input;
    private food: Food[] = [];
    private foodFactory: FoodFactory = new FoodFactory();
    private gameLoop: any;

    constructor() {
        this.plane = new Plane();
        this.input = new Input();
        this.snake = new Snake(this.plane, this.input);
    }

    get speedMultiplier(): number {

        return store.getState().sideEffects.speedMultiplier;
    }

    public setup(): void {

        this.resetObjects();
        this.resetState();
        this.tick();
    }

    public tick(): void {

        this.gameLoop = setInterval(() => {
            this.snake.update();

            // Check if any food is eaten
            this.checkFoodCollisions();

            // Check for collision on snake itself
            if(this.checkSnakeCollisions()) return;

            // Check for collision on bounds
            if(this.checkBoundCollisions()) return;

            this.snake.draw();
        }, 1000 / Math.round(this.FRAME_RATE * this.speedMultiplier));
    }

    private resetObjects(): void {
        
        // Initialize plane
        this.plane.init();

        // Initialize snake
        this.snake.init();

        // Generate n pieces of food
        this.food = new Array(5).fill(0).map(() => {
            return this.foodFactory.create(this.getAvailableCoordinate())
        });

        // Draw every piece of food on the plane
        this.food.forEach((food: Food) => {
            food.draw(this.plane);
        });
    }

    private resetState(): void {
        
        store.dispatch(resetScore());
        store.dispatch(resetSideEffects());
    }

    private resetLoop(): void {

        clearInterval(this.gameLoop);
        this.tick();
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

    private checkFoodCollisions(): void {

        this.food.forEach((food: Food, index) => {

            if(this.checkCollision(
                this.snake.coordinates[this.snake.coordinates.length - 1],
                [food.coordinate]
            )) {
                food.eat(this.plane);
                if(food.type === FoodType.PIZZA) this.resetLoop();
                this.food.splice(index, 1);
                this.food.push(this.foodFactory.create(this.getAvailableCoordinate()));
                this.food[this.food.length - 1].draw(this.plane);
                this.snake.grow();
            }
        })
    }

    private checkSnakeCollisions(): boolean {

        if(this.checkCollision(
            this.snake.coordinates[this.snake.coordinates.length - 1],
            this.snake.coordinates.slice(0, this.snake.coordinates.length - 1)
        )) {
            clearInterval(this.gameLoop);
            // Dispatch action to change gamestate
            return true;
        }

        return false;
    }

    private checkBoundCollisions(): boolean {

        if(this.checkBounds(
            this.snake.coordinates[this.snake.coordinates.length - 1]
        )) {
            clearInterval(this.gameLoop);
            // Dispatch action to change gamestate
            return true;
        }

        return false;
    }
}