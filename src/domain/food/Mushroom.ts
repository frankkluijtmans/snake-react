import { Food } from "./Food";

export class Mushroom extends Food {

	public value: number = 250;

	constructor() {
		super();
	}

	public triggerSideEffect(): void {

		return;
	}
}