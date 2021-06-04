import { ICoordinate } from "../interfaces/coordinate.interface";
import { Food } from "./food/Food";
import { FoodFactory } from "./FoodFactory";
import { Plane } from "./Plane";
import { Snake } from "./Snake";
import { Input } from "./Input";
import { Helpers } from "./Helpers";
import { store } from "../store/store";
import { FoodType } from "../enums/FoodType";
import { GameState } from "../enums/GameState";
import { resetScore, changeGameState } from "../store/slices/GameState";
import { resetSideEffects } from "../store/slices/SideEffects";

export class Game {
	
	readonly FRAME_RATE: number = 6;
	private plane: Plane;
	private snake: Snake;
	private input: Input;
	private food: Food[] = [];
	private foodFactory: FoodFactory = new FoodFactory();
	private gameLoop: any;
	private gameState: GameState = GameState.INITIAL;

	constructor() {
		this.plane = new Plane();
		this.input = new Input();
		this.snake = new Snake(this.plane, this.input);
		this.subScribeToGameState();
		this.bindInput();
	}

	get speedMultiplier(): number {

		return store.getState().sideEffects.speedMultiplier;
	}

	public start(): void {

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

	private subScribeToGameState(): void {

		store.subscribe(() => {

			const newState: GameState = store.getState().gameState.state;
			const oldState: GameState = this.gameState;

			if(newState !== oldState) {

				this.gameState = newState;
				this.triggerStateChanges(oldState);
			}
		})
	}

	private triggerStateChanges(oldState: GameState): void {

		switch(this.gameState) {
			case GameState.PAUSED:
				clearInterval(this.gameLoop);
				return;
			case GameState.ACTIVE:
				oldState === GameState.PAUSED ? this.resetLoop() : this.start();
				return;
			case GameState.GAME_OVER:
				this.food.forEach((food: Food) => food.remove(this.plane));
				clearInterval(this.gameLoop);
				return;
		}
	}

	private resetObjects(): void {
		
		// Initialize plane
		if(!this.plane.grid) this.plane.init();

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
			store.dispatch(changeGameState(GameState.GAME_OVER));
			return true;
		}

		return false;
	}

	private checkBoundCollisions(): boolean {

		if(this.checkBounds(
			this.snake.coordinates[this.snake.coordinates.length - 1]
		)) {
			clearInterval(this.gameLoop);
			store.dispatch(changeGameState(GameState.GAME_OVER));
			return true;
		}

		return false;
	}

	private bindInput(): void {

		this.input.subscribe({
			keyCodes: ['Space'],
			callback: () => {

				if(this.gameState !== GameState.ACTIVE && this.gameState !== GameState.PAUSED) return;

				store.dispatch(
					this.gameState === GameState.ACTIVE ? changeGameState(GameState.PAUSED) : changeGameState(GameState.ACTIVE)
				)
			}
		});
	}
}