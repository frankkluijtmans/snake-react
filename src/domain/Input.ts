import { IInputSubscriber } from "../interfaces/inputsubscriber.interface";

export class Input {

	private subscribers: IInputSubscriber[] = [];

	constructor() {

		this.setListener();
	}

	public subscribe(subscriber: IInputSubscriber): void {

		this.subscribers.push(
			subscriber
		);
	}

	private setListener(): void {

		document.addEventListener('keydown', (event: any) => {

			const subscribers = this.getSubscribers(event.code);
			subscribers.forEach((subscriber: IInputSubscriber) => subscriber.callback());
		})
	}

	private getSubscribers(key: string): IInputSubscriber[] {

		return this.subscribers.filter((subscriber: IInputSubscriber) => {
			return subscriber.keyCodes.some((keyCode: string) => keyCode === key)
		});
	}
}