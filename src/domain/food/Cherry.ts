import { Food } from "./Food";

export class Cherry extends Food {

	public value: number = 100;

	constructor() {
		super();
	}

	public triggerSideEffect(): void {

		return;
	}
}