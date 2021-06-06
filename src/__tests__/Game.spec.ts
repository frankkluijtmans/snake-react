import { GameState } from "../enums/GameState";
import { Game } from "../domain/Game";
import { FoodType } from "../enums/FoodType";

let testInstance;

describe('Game.ts', () => {

	beforeEach(() => {

		testInstance = new Game();
		testInstance.store = global["mockStore"];
		testInstance.snake.coordinates = [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 }
		];
		testInstance.plane.grid = global["mockSvgElement"];
		testInstance.store.dispatch.mock.calls = [];
		jest.useFakeTimers();
	});

	it('init(): Calls subscribeToGameState and bindInput.', () => {

		//given
		const spySubscribeToGameState = jest.spyOn(testInstance, "subscribeToGameState");
		const spyBindInput = jest.spyOn(testInstance, "bindInput");

		//when
		testInstance.init();

		//then
		expect(spySubscribeToGameState).toHaveBeenCalledTimes(1);
		expect(spyBindInput).toHaveBeenCalledTimes(1);
	});

	it('start(): Calls resetObjects, resetState and tick.', () => {

		//given
		const spyResetObjects = jest.spyOn(testInstance, "resetObjects");
		const spyResetState = jest.spyOn(testInstance, "resetState");
		const spyTick = jest.spyOn(testInstance, "tick");

		//when
		testInstance.start();

		//then
		expect(spyResetObjects).toHaveBeenCalledTimes(1);
		expect(spyResetState).toHaveBeenCalledTimes(1);
		expect(spyTick).toHaveBeenCalledTimes(1);
	});

	it('tick(): Sets and runs the game loop at the expected framerate.', () => {

		//given
		const spyUpdateFrame = jest.spyOn(testInstance, "updateFrame");

		//when
		testInstance.tick();
		jest.advanceTimersByTime(1000);

		//then
		expect(spyUpdateFrame).toHaveBeenCalledTimes(testInstance.frameRate);
		expect(testInstance.store.dispatch).toHaveBeenCalledWith({
			payload: expect.any(Number), 
			type: "gameState/setGameLoop"
		});
	});

	it('updateFrame(): returns when snake collided with itself.', () => {

		//given
		testInstance.snake.checkCollision = jest.fn(() => true);
		const spy = jest.spyOn(testInstance.plane, "checkCollision");

		//when
		testInstance.updateFrame();

		//then
		expect(spy).not.toHaveBeenCalled();
	});

	it('updateFrame(): returns when snake collided with bounds.', () => {

		//given
		testInstance.plane.checkCollision = jest.fn(() => true);
		const spy = jest.spyOn(testInstance.snake, "draw");

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
		expect(spySnakeUpdate).toHaveBeenCalledTimes(1);
		expect(spyFoodCollisions).toHaveBeenCalledTimes(1);
		expect(spySnakeCollision).toHaveBeenCalledTimes(1);
		expect(spyBoundCollision).toHaveBeenCalledTimes(1);
		expect(spySnakeDraw).toHaveBeenCalledTimes(1);
	});

	it('subscribeToGameState(): Doesn\'t call onGameStateChanged when state didn\'t change.', () => {

		//given
		testInstance.gameState = GameState.INITIAL;
		const spy = jest.spyOn(testInstance, "onGameStateChanged");

		//when
		testInstance.subscribeToGameState();

		//then
		expect(spy).not.toHaveBeenCalled();
	});

	it('subscribeToGameState(): Calls onGameStateChanged when state changed.', () => {

		//given
		testInstance.gameState = GameState.GAME_OVER;
		const spy = jest.spyOn(testInstance, "onGameStateChanged");

		//when
		testInstance.subscribeToGameState();

		//then
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('onGameStateChanged(): Runs all actions for paused gamestate.', () => {

		//given
		testInstance.gameState = GameState.PAUSED;

		//when
		testInstance.onGameStateChanged(GameState.ACTIVE);

		//then
		expect(testInstance.store.dispatch).toHaveBeenCalledWith({
			payload: undefined, 
			type: "gameState/clearGameLoop"
		});
	});

	it('onGameStateChanged(): Runs all actions for active gamestate.', () => {

		//given
		const spyResetLoop = jest.spyOn(testInstance, "resetLoop" as any);
		const spyStart = jest.spyOn(testInstance, "start" as any);

		//when
		testInstance.gameState = GameState.ACTIVE;
		testInstance.onGameStateChanged(GameState.PAUSED);

		//then
		expect(spyResetLoop).toHaveBeenCalledTimes(1);

		//when
		testInstance.gameState = GameState.ACTIVE;
		testInstance.onGameStateChanged(GameState.INITIAL);

		//then
		expect(spyStart).toHaveBeenCalledTimes(1);
	});

	it('onGameStateChanged(): Runs all actions for game over gamestate.', () => {

		//given
		testInstance.gameState = GameState.GAME_OVER;
		const removeMock = jest.fn();
		testInstance.food = [
			{ remove: removeMock },
			{ remove: removeMock },
			{ remove: removeMock },
			{ remove: removeMock },
			{ remove: removeMock }
		]

		//when
		testInstance.onGameStateChanged(GameState.ACTIVE);

		//then
		expect(removeMock).toHaveBeenCalledTimes(testInstance.food.length);
		expect(testInstance.store.dispatch).toHaveBeenCalledWith({
			payload: undefined, 
			type: "gameState/clearGameLoop"
		});
	});

	it('resetObjects(): Call plane.init of plane.grid is null or undefined.', () => {

		//given
		const spy = jest.spyOn(testInstance.plane, "init");
		
		//when
		testInstance.plane.grid = undefined;
		testInstance.resetObjects();
		testInstance.plane.grid = null;
		testInstance.resetObjects();

		//then
		expect(spy).toHaveBeenCalledTimes(2);
	});

	it('resetObjects(): Initializes the snake and food.', () => {

		//given
		const spySnakeInit = jest.spyOn(testInstance.snake, "init");
		const drawMock = jest.fn();
		testInstance.foodFactory.create = jest.fn(() => {
			return {
				draw: drawMock
			}
		});

		//when
		testInstance.resetObjects();

		//then
		expect(spySnakeInit).toHaveBeenCalledTimes(1);
		expect(testInstance.foodFactory.create).toHaveBeenCalledTimes(5);
		expect(drawMock).toHaveBeenCalledTimes(5);
	});

	it('resetState(): Dispatches resetScore and resetSideEffects on the store.', () => {

		//when
		testInstance.resetState();

		//then
		expect(testInstance.store.dispatch.mock.calls).toEqual([
			[{
				payload: undefined, 
				type: "gameState/resetScore"
			}],
			[{
				payload: undefined, 
				type: "sideEffects/resetSideEffects"
			}]
		])
	});

	it('getAvailableCoordinate(): Returns the only available coordinate.', () => {

		//given
		testInstance.food = [
			{ coordinate: { x: 0, y: 0 } },
			{ coordinate: { x: 0, y: 1 } }
		];
		testInstance.snake.coordinates = [
			{ x: 1, y: 0 }
		];
		testInstance.plane.gridSize = {
			width: 2,
			height: 2
		};

		//when
		const result = testInstance.getAvailableCoordinate();

		//then
		expect(result).toEqual({ x: 1, y: 1 });
	});

	it('checkFoodCollisions(): Calls onFoodCollision when there is a collision.', () => {

		//given
		const spy = jest.spyOn(testInstance, "onFoodCollision");
		testInstance.food = [
			{ coordinate: { x: 0, y: 0 }, eat: jest.fn() },
			{ coordinate: { x: 1, y: 0 }, eat: jest.fn() }
		];
		testInstance.snake.coordinates = [
			{ x: 1, y: 0 }
		];

		//when
		testInstance.checkFoodCollisions();

		//then
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('checkFoodCollisions(): Doesn\'t call onFoodCollision when there are no collisions.', () => {

		//given
		const spy = jest.spyOn(testInstance, "onFoodCollision");
		testInstance.food = [
			{ coordinate: { x: 0, y: 0 }, eat: jest.fn() },
			{ coordinate: { x: 1, y: 0 }, eat: jest.fn() }
		];
		testInstance.snake.coordinates = [
			{ x: 2, y: 0 }
		];

		//when
		testInstance.checkFoodCollisions();

		//then
		expect(spy).toHaveBeenCalledTimes(0);
	});

	it('onFoodCollision(): Correctly processes food collision.', () => {

		//given
		const mushroom = { type: FoodType.MUSHROOM, eat: jest.fn(), draw: jest.fn() };
		const pizza = { type: FoodType.PIZZA, eat: jest.fn(), draw: jest.fn() };
		const cherry = { type: FoodType.CHERRY, eat: jest.fn(), draw: jest.fn() };
		const spy = jest.spyOn(testInstance.snake, "grow");
		testInstance.food = [
			mushroom,
			pizza,
			cherry
		];
		testInstance.getAvailableCoordinate = jest.fn(() => {
			return { x: 0, y: 0 }
		});
		testInstance.foodFactory.create = jest.fn(() => {
			return cherry;
		});

		//when
		testInstance.onFoodCollision(mushroom, 0);

		//then
		expect(testInstance.food.length).toEqual(3);
		expect(spy).toHaveBeenCalledTimes(1);
		expect(mushroom.eat).toHaveBeenCalledTimes(1);
		expect(cherry.draw).toHaveBeenCalledTimes(1);
	});

	it('onFoodCollision(): Resets loop when the eaten food was of type pizza.', () => {

		//given
		const mockFood = [
			{ type: FoodType.PIZZA, eat: jest.fn(), draw: jest.fn() },
			{ type: FoodType.CHERRY, eat: jest.fn(), draw: jest.fn() }
		];
		const spy = jest.spyOn(testInstance, "resetLoop");
		testInstance.food = mockFood;
		testInstance.getAvailableCoordinate = jest.fn(() => {
			return { x: 0, y: 0 }
		});
		testInstance.foodFactory.create = jest.fn(() => {
			return mockFood[0];
		});

		//when
		testInstance.onFoodCollision(mockFood[0], 0);

		//then
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('bindInput(): Subscribes to the right input types.', () => {

		//given
		const spy = jest.spyOn(testInstance.input, "subscribe");

		//when
		testInstance.bindInput();

		//then
		expect(spy).toHaveBeenCalledWith({
			keyCodes: ['Space'],
			callback: expect.any(Function)
		});
	});

	it('togglePausedState(): Returns when gamestate is neither active or paused.', () => {

		//given
		testInstance.gameState = GameState.GAME_OVER;

		//when
		testInstance.togglePausedState();

		//then
		expect(testInstance.store.dispatch).not.toHaveBeenCalled();
	});

	it('togglePausedState(): Changes gameState to paused when it was active.', () => {

		//given
		testInstance.gameState = GameState.ACTIVE;

		//when
		testInstance.togglePausedState();

		//then
		expect(testInstance.store.dispatch).toHaveBeenCalledWith({
			payload: GameState.PAUSED,
			type: "gameState/changeGameState"
		});
	});

	it('togglePausedState(): Changes gameState to active when it was paused.', () => {

		//given
		testInstance.gameState = GameState.PAUSED;

		//when
		testInstance.togglePausedState();

		//then
		expect(testInstance.store.dispatch).toHaveBeenCalledWith({
			payload: GameState.ACTIVE,
			type: "gameState/changeGameState"
		});
	});
});