import { Pizza } from "../../domain/food/Pizza";

let testInstance;

describe('Pizza.ts', () => {

	beforeEach(() => {

		testInstance = new Pizza({
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
		expect(testInstance.store.dispatch).toHaveBeenCalledWith({
			payload: undefined,
			type: "sideEffects/increaseSpeed"
		});
	});
});