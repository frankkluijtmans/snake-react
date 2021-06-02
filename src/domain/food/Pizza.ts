import { Food } from "./Food";

export class Pizza extends Food {

	public value: number = 1000;

	constructor() {
		super();
	}

	public triggerSideEffect(): void {

		return;
	}
}