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
import { resetScore, changeGameState, clearGameLoop, setGameLoop } from "../store/slices/GameStateSlice";
import { resetSideEffects } from "../store/slices/SideEffectsSlice";

export class Game {
	
	readonly FRAME_RATE: number = 6;
	private plane: Plane;
	private snake: Snake;
	private input: Input;
	private food: Food[] = [];
	private foodFactory: FoodFactory = new FoodFactory();
	private gameState: GameState = GameState.INITIAL;

	constructor() {
		this.plane = new Plane();
		this.input = new Input();
		this.snake = new Snake(this.plane, this.input);
		this.init();
	}

	get frameRate(): number {

		return Math.round(store.getState().sideEffects.speedMultiplier * this.FRAME_RATE);
	}

	public init(): void {

		this.subscribeToGameState();
		this.bindInput();
	}

	public start(): void {

		this.resetObjects();
		this.resetState();
		this.tick();
	}

	public tick(): void {

		const gameLoop: any = setInterval(() => {
			this.updateFrame();
		}, 1000 / this.frameRate);

		store.dispatch(setGameLoop(gameLoop));
	}

	private updateFrame(): void {
		
		this.snake.update();

		this.checkFoodCollisions();
		if(this.snake.checkCollision()) return;
		if(this.plane.checkCollision(
			this.snake.coordinates[this.snake.coordinates.length - 1]
		)) {
			return;
		}

		this.snake.draw();
	}

	private subscribeToGameState(): void {

		store.subscribe(() => {

			const newState: GameState = store.getState().gameState.state;
			const oldState: GameState = this.gameState;

			if(newState !== oldState) {

				this.gameState = newState;
				this.onGameStateChanged(oldState);
			}
		})
	}

	private onGameStateChanged(oldState: GameState): void {

		switch(this.gameState) {
			case GameState.PAUSED:
				store.dispatch(clearGameLoop());
				return;
			case GameState.ACTIVE:
				oldState === GameState.PAUSED ? this.resetLoop() : this.start();
				return;
			case GameState.GAME_OVER:
				this.food.forEach((food: Food) => food.remove(this.plane));
				store.dispatch(clearGameLoop());
				return;
		}
	}

	private resetObjects(): void {
		
		if(!this.plane.grid) this.plane.init();

		this.snake.init();

		this.food = new Array(5).fill(0).map(() => {
			return this.foodFactory.create(this.getAvailableCoordinate())
		});

		this.food.forEach((food: Food) => {
			food.draw(this.plane);
		});
	}

	private resetState(): void {
		
		store.dispatch(resetScore());
		store.dispatch(resetSideEffects());
	}

	private resetLoop(): void {

		store.dispatch(clearGameLoop());
		this.tick();
	}

	private getAvailableCoordinate(): ICoordinate {

		const occupiedCoordinates: ICoordinate[] = this.food.map((food: Food) => food.coordinate)
			.concat(this.snake.coordinates);

		let generatedCoordinate: ICoordinate = {
			x: Helpers.generateRandomNumber(0, this.plane.gridSize.width - 1),
			y: Helpers.generateRandomNumber(0, this.plane.gridSize.height - 1)
		}

		while(Helpers.checkCollision(generatedCoordinate, occupiedCoordinates)) {
			generatedCoordinate = {
				x: Helpers.generateRandomNumber(0, this.plane.gridSize.width - 1),
				y: Helpers.generateRandomNumber(0, this.plane.gridSize.height - 1)
			}
		}

		return generatedCoordinate;
	}

	private checkFoodCollisions(): void {

		this.food.forEach((food: Food, index) => {

			if(Helpers.checkCollision(
				this.snake.coordinates[this.snake.coordinates.length - 1],
				[food.coordinate]
			)) {
				this.onFoodCollision(food, index);
			}
		})
	}

	private onFoodCollision(food: Food, index: number): void {

		food.eat(this.plane);
		if(food.type === FoodType.PIZZA) this.resetLoop();
		this.food.splice(index, 1);
		this.food.push(this.foodFactory.create(this.getAvailableCoordinate()));
		this.food[this.food.length - 1].draw(this.plane);
		this.snake.grow();
	}

	private bindInput(): void {

		this.input.subscribe({
			keyCodes: ['Space'],
			callback: () => {
				this.togglePausedState();
			}
		});
	}

	private togglePausedState(): void {

		if(this.gameState !== GameState.ACTIVE && this.gameState !== GameState.PAUSED) return;

		store.dispatch(
			this.gameState === GameState.ACTIVE ? changeGameState(GameState.PAUSED) : changeGameState(GameState.ACTIVE)
		)
	}
}