import { FoodType } from "../../enums/FoodType";
import { ICoordinate } from "../../interfaces/coordinate.interface";
import { Food } from "./Food";

export class Pizza extends Food {

	public value: number = 400;
	public type: FoodType = FoodType.PIZZA;

	constructor(coordinate: ICoordinate) {
		super(coordinate);
	}

	public triggerSideEffect(): void {

		return;
	}
}