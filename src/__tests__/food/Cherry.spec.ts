import { Cherry } from "../../domain/food/Cherry";
import { Plane } from "../../domain/Plane";

let testInstance;

describe('Cherry.ts', () => {

	beforeEach(() => {

		testInstance = new Cherry({
			x: 0,
			y: 0
		});
		testInstance.store = global["mockStore"];
		testInstance.store.dispatch.mock.calls = [];
		jest.useFakeTimers();
	});

	it('eat(): Increments the score by the items value, removes it from the plane and triggers side effects.', () => {

		//given
		testInstance.remove = jest.fn();
		const spySideEffect = jest.spyOn(testInstance, "triggerSideEffect");

		//when
		testInstance.eat(
			new Plane()
		);

		//then
		expect(testInstance.store.dispatch).toHaveBeenCalledWith({
			payload: testInstance.value,
			type: "gameState/incrementScore"
		});
		expect(testInstance.remove).toHaveBeenCalledTimes(1);
		expect(spySideEffect).toHaveBeenCalledTimes(1);
	});

	it('generateRandomIdentifier(): Generates a random identifier of the correct length.', () => {

		//when
		const identifiers = [
			testInstance.generateRandomIdentifier(8),
			testInstance.generateRandomIdentifier(9),
			testInstance.generateRandomIdentifier(10)
		];

		//then
		expect(identifiers[0].length).toEqual(9);
		expect(identifiers[1].length).toEqual(10);
		expect(identifiers[2].length).toEqual(11);
	});
});