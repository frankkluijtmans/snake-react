import { Mushroom } from "../../domain/food/Mushroom";

let testInstance;

describe('Mushroom.ts', () => {

	beforeEach(() => {

		testInstance = new Mushroom({
			x: 0,
			y: 0
		});
		testInstance.store = global["mockStore"];
		testInstance.store.dispatch.mock.calls = [];
		jest.useFakeTimers();
	});

	it('triggerSideEffect(): Inverts controls for 30 seconds.', () => {

		//when
		testInstance.triggerSideEffect();
		jest.runAllTimers();

		//then
		expect(testInstance.store.dispatch.mock.calls).toEqual([
			[{
				payload: expect.any(Number), 
				type: "sideEffects/invertControls"
			}],
			[{
				payload: undefined, 
				type: "sideEffects/revertControls"
			}]
		])
	});
});