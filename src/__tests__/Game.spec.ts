import { GameState } from "../enums/GameState";
import { Game } from "../domain/Game";
import { store } from "../store/store";
jest.mock("../store/store");

let testInstance;

describe('Game.ts', () => {

	beforeAll(() => {

		testInstance = new Game();
		jest.useFakeTimers();
	});

	it('init(): Calls subscribeToGameState and bindInput.', () => {

		//given
		const spySubscribeToGameState = jest.spyOn(testInstance, "subscribeToGameState" as any);
		const spyBindInput = jest.spyOn(testInstance, "bindInput" as any);

		//when
		testInstance.init();

		//then
		expect(spySubscribeToGameState).toHaveBeenCalledTimes(1);
		expect(spyBindInput).toHaveBeenCalledTimes(1);
	});

	it('start(): Calls resetObjects, resetState and tick.', () => {

		//given
		const spyResetObjects = jest.spyOn(testInstance, "resetObjects" as any);
		const spyResetState = jest.spyOn(testInstance, "resetState" as any);
		const spyTick = jest.spyOn(testInstance, "tick" as any);

		//when
		testInstance.start();

		//then
		expect(spyResetObjects).toHaveBeenCalledTimes(1);
		expect(spyResetState).toHaveBeenCalledTimes(1);
		expect(spyTick).toHaveBeenCalledTimes(1);
	});

	it('tick(): Sets and runs the game loop at the expected framerate.', () => {

		//given
		const spyUpdateFrame = jest.spyOn(testInstance, "updateFrame" as any);

		//when
		testInstance.tick();
		jest.advanceTimersByTime(1000);

		//then
		expect(spyUpdateFrame).toHaveBeenCalledTimes(testInstance.frameRate);
		expect(store.dispatch).toHaveBeenCalledTimes(1);
	});

	it('updateFrame(): returns when snake collided with itself.', () => {

		//given
		testInstance.snake.checkCollision = jest.fn(() => true);
		const spy = jest.spyOn(testInstance.plane, "checkCollision" as any);

		//when
		testInstance.updateFrame();

		//then
		expect(spy).not.toHaveBeenCalled();
	});

	it('updateFrame(): returns when snake collided with bounds.', () => {

		//given
		testInstance.plane.checkCollision = jest.fn(() => true);
		const spy = jest.spyOn(testInstance.snake, "draw" as any);

		//when
		testInstance.updateFrame();

		//then
		expect(spy).not.toHaveBeenCalled();
	});

	it('updateFrame(): Checks all collisions and calls update and draw on the snake.', () => {

		//given
		const spyFoodCollisions = jest.spyOn(testInstance, "checkFoodCollisions");
		const spySnakeCollision = jest.spyOn(testInstance.snake, "checkCollision");
		const spyBoundCollision = jest.spyOn(testInstance.plane, "checkCollision");
		const spySnakeUpdate = jest.spyOn(testInstance.snake, "update");
		const spySnakeDraw = jest.spyOn(testInstance.snake, "draw");

		//when
		testInstance.updateFrame();

		//then
		expect(spyFoodCollisions).toHaveBeenCalledTimes(1);
		expect(spySnakeCollision).toHaveBeenCalledTimes(1);
		expect(spyBoundCollision).toHaveBeenCalledTimes(1);
		expect(spySnakeUpdate).toHaveBeenCalledTimes(1);
		expect(spySnakeDraw).toHaveBeenCalledTimes(1);
	});

	it('onGameStateChanged(): Runs all action for active gamestate.', () => {

		//given
		const spyResetLoop = jest.spyOn(testInstance, "resetLoop" as any);
		const spyStart = jest.spyOn(testInstance, "start" as any);

		//when
		testInstance.onGameStateChanged(GameState.PAUSED);

		//then
		expect(spyResetLoop).toHaveBeenCalledTimes(1);

		//when
		testInstance.onGameStateChanged(GameState.INITIAL);

		//then
		expect(spyStart).toHaveBeenCalledTimes(1);
	});
});