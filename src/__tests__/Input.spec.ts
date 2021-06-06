import { Input } from "../domain/Input";

let testInstance;
let mockSubscribers;

describe('Input.ts', () => {

	beforeEach(() => {

		mockSubscribers = [
			{
				keyCodes: ['ArrowUp'],
				callback: jest.fn()
			},
			{
				keyCodes: ['ArrowDown'],
				callback: jest.fn()
			}
		];
		testInstance = new Input();
	});

	it('subscribe(): Correctly registers the subscriber.', () => {

		//when
		testInstance.subscribe(mockSubscribers[0]);

		//then
		expect(testInstance.subscribers.indexOf(mockSubscribers[0])).toEqual(0);
	});

	it('setListener(): Correctly adds a listener that will fire subscriber callbacks.', () => {

		//given
		mockSubscribers.forEach((subscriber) => {
			testInstance.subscribe(subscriber);
		});

		//when
		document.dispatchEvent(
			new KeyboardEvent("keydown", { code: "ArrowUp" })
		);

		//then
		expect(testInstance.subscribers[0].callback).toHaveBeenCalledTimes(1);
	});

	it('getSubscribers(): Returns all subscribers with the correct keyCode.', () => {

		//given
		mockSubscribers.forEach((subscriber) => {
			testInstance.subscribe(subscriber);
		});

		//when
		const result = testInstance.getSubscribers('ArrowDown');

		//then
		expect(result).toEqual([
			mockSubscribers[1]
		]);
	});
});