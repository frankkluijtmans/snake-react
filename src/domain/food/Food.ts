import { ICoordinate } from "../../interfaces/coordinate.interface";

export abstract class Food {

	protected coordinates: ICoordinate[];
	protected abstract value: number;
	protected abstract triggerSideEffect(): void;

	constructor() {
		this.coordinates = [
			{
				x: 0,
				y: 0
			}
		]
	}
}