import { Plane } from "../domain/Plane";
import { GameState } from "../enums/GameState";

let testInstance;

describe('Plane.ts', () => {

	beforeEach(() => {

		testInstance = new Plane();
		testInstance.store = global["mockStore"];
		testInstance.store.dispatch.mock.calls = [];
		testInstance.d3 = global["mockD3"];
		jest.useFakeTimers();
	});

	it('init(): Renders the root svg element and calls renderGrid.', () => {

		//given
		testInstance.renderGrid = jest.fn();

		//when
		testInstance.init();

		//then
		expect(testInstance.renderGrid).toHaveBeenCalledTimes(1);
		expect(global["mockD3"].select).toHaveBeenCalledTimes(1);
	});

	it('checkCollision(): Returns true and calls onCollision when there is a collision.', () => {

		//given
		const spy = jest.spyOn(testInstance, "onCollision");
		const leftCollision = { x: -1, y: 0 };
		const rightCollision = { x: testInstance.gridSize.width, y: 0 };
		const topCollision = { x: 0, y: -1 };
		const bottomCollision = { x: 0, y: testInstance.gridSize.height };

		//when
		const results = [
			testInstance.checkCollision(leftCollision),
			testInstance.checkCollision(rightCollision),
			testInstance.checkCollision(topCollision),
			testInstance.checkCollision(bottomCollision)
		];

		//then
		results.forEach((result) => {
			expect(result).toBeTruthy();
		});
		expect(spy).toHaveBeenCalledTimes(4);
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

	it('renderGrid(): Renders the right amount of gridlines on each axis.', () => {
		
		//given
		testInstance.grid = global["mockSvgElement"];
		const spy = jest.spyOn(testInstance.grid, "append");

		//when
		testInstance.renderGrid();

		//then
		expect(spy).toHaveBeenCalledTimes(
			(testInstance.gridSize.width - 1) + (testInstance.gridSize.height - 1)
		);
	});
});