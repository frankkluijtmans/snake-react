import { Snake } from "../domain/Snake";
import { Input } from "../domain/Input";
import { Plane } from "../domain/Plane";
import { GameState } from "../enums/GameState";
import { Direction } from "../enums/Direction";

let testInstance;

describe('Snake.ts', () => {

	beforeEach(() => {

		testInstance = new Snake(
			new Plane(),
			new Input()
		);
		testInstance.store = global["mockStore"];
		testInstance.store.dispatch.mock.calls = [];
		testInstance.plane.grid = global["mockSvgElement"];
		jest.useFakeTimers();
	});

	it('init(): Sets coordinates of the snake on the middle of the plane.', () => {

		//given
		testInstance.plane.gridSize = {
			width: 32,
			height: 32
		};

		//when
		testInstance.init();

		//then
		expect(testInstance.coordinates).toEqual([
			{
				x: 16,
				y: 16
			},
			{
				x: 17,
				y: 16
			}
		])
	});

	it('grow(): Adds another coordinate to the snakes tail with equal coordinates.', () => {

		//given
		testInstance.coordinates = [
			{
				x: 16,
				y: 16
			},
			{
				x: 17,
				y: 16
			}
		]

		//when
		testInstance.grow();

		//then
		expect(testInstance.coordinates).toEqual([
			{
				x: 16,
				y: 16
			},
			{
				x: 16,
				y: 16
			},
			{
				x: 17,
				y: 16
			}
		])
	});

	it('checkCollision(): Returns true and calls onCollision when the snake collides on itself.', () => {

		//given
		const spy = jest.spyOn(testInstance, "onCollision");
		testInstance.coordinates = [
			{
				x: 16,
				y: 16
			},
			{
				x: 17,
				y: 16
			},
			{
				x: 17,
				y: 17
			},
			{
				x: 16,
				y: 17
			},
			{
				x: 16,
				y: 16
			}
		];

		//when
		const result = testInstance.checkCollision();

		//then
		expect(result).toBeTruthy();
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('checkCollision(): Returns false and doesn\'t call onCollision when there is no collision.', () => {

		//given
		const spy = jest.spyOn(testInstance, "onCollision");
		testInstance.coordinates = [
			{
				x: 16,
				y: 16
			},
			{
				x: 17,
				y: 16
			},
			{
				x: 17,
				y: 17
			},
			{
				x: 16,
				y: 17
			}
		];

		//when
		const result = testInstance.checkCollision();

		//then
		expect(result).toBeFalsy();
		expect(spy).toHaveBeenCalledTimes(0);
	});

	it('onCollision(): Dispartches clearGameLoop and changeGameState on the store.', () => {

		//when
		testInstance.onCollision();

		//then
		expect(testInstance.store.dispatch.mock.calls).toEqual([
			[{
				payload: undefined,
				type: "gameState/clearGameLoop"
			}],
			[{
				payload: GameState.GAME_OVER,
				type: "gameState/changeGameState"
			}]
		])
	});

	it('bindInput(): Subscribes to the right input types.', () => {

		//given
		const spy = jest.spyOn(testInstance.input, "subscribe");

		//when
		testInstance.bindInput();

		//then
		expect(spy.mock.calls).toEqual([
			[{
				keyCodes: ['KeyW', 'ArrowUp'],
				callback: expect.any(Function)
			}],
			[{
				keyCodes: ['KeyS', 'ArrowDown'],
				callback: expect.any(Function)
			}],
			[{
				keyCodes: ['KeyA', 'ArrowLeft'],
				callback: expect.any(Function)
			}],
			[{
				keyCodes: ['KeyD', 'ArrowRight'],
				callback: expect.any(Function)
			}]
		]);
	});

	it('changeDirection(): Returns when the direction is the opposite to the current.', () => {

		//given
		const oldDirection = testInstance.direction;

		//when
		testInstance.changeDirection(Direction.LEFT, Direction.RIGHT);

		//then
		expect(oldDirection).toEqual(testInstance.direction);
	});

	it('changeDirection(): Returns when the direction is the opposite to the current with invertedControls enabled.', () => {

		//given
		testInstance.store = {
			getState() {
				return {
					sideEffects: {
						invertedControls: true
					}
				}
			}
		};
		const oldDirection = testInstance.direction;

		//when
		testInstance.changeDirection(Direction.LEFT, Direction.RIGHT);

		//then
		expect(oldDirection).toEqual(testInstance.direction);
	});

	it('changeDirection(): Changes the snakes direction correctly.', () => {

		//given
		const spy = jest.spyOn(testInstance.input, "subscribe");

		//when
		testInstance.changeDirection(Direction.UP, Direction.DOWN);

		//then
		expect(testInstance.direction).toEqual(Direction.UP);
	});

	it('changeDirection(): Changes the snakes direction correctly with invertedControls enabled.', () => {

		//given
		testInstance.store = {
			getState() {
				return {
					sideEffects: {
						invertedControls: true
					}
				}
			}
		};

		//when
		testInstance.changeDirection(Direction.UP, Direction.DOWN);

		//then
		expect(testInstance.direction).toEqual(Direction.DOWN);
	});

	it('changeDirection(): Returns the correct new position for all possible directions.', () => {

		//given
		const currentHead = {
			x: 16,
			y: 16
		};

		//when
		testInstance.direction = Direction.UP;
		const up = testInstance.getNewPosition(currentHead);

		testInstance.direction = Direction.DOWN;
		const down = testInstance.getNewPosition(currentHead);

		testInstance.direction = Direction.LEFT;
		const left = testInstance.getNewPosition(currentHead);

		testInstance.direction = Direction.RIGHT;
		const right = testInstance.getNewPosition(currentHead);

		//then
		expect(up).toEqual({ x: 16, y: 15 });
		expect(down).toEqual({ x: 16, y: 17 });
		expect(left).toEqual({ x: 15, y: 16 });
		expect(right).toEqual({ x: 17, y: 16 });
	});
});