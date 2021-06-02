import { FoodType } from "../../enums/FoodType";
import { ICoordinate } from "../../interfaces/coordinate.interface";
import { Food } from "./Food";

export class Cherry extends Food {

	public value: number = 100;
	public type: FoodType = FoodType.CHERRY;

	constructor(coordinate: ICoordinate) {
		super(coordinate);
	}

	public triggerSideEffect(): void {

		return;
	}
}