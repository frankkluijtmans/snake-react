import { FoodType } from "../../enums/FoodType";
import { ICoordinate } from "../../interfaces/coordinate.interface";
import { Food } from "./Food";

export class Mushroom extends Food {

	public value: number = 350;
	public type: FoodType = FoodType.MUSHROOM;

	constructor(coordinate: ICoordinate) {
		super(coordinate);
	}

	public triggerSideEffect(): void {

		return;
	}
}