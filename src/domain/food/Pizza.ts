import { FoodType } from "../../enums/FoodType";
import { ICoordinate } from "../../interfaces/coordinate.interface";
import { Food } from "./Food";
import { store } from "../../store/store";
import { increaseSpeed } from "../../store/slices/SideEffectsSlice";

export class Pizza extends Food {

	public value: number = 400;
	public type: FoodType = FoodType.PIZZA;

	constructor(coordinate: ICoordinate) {
		super(coordinate);
	}

	public triggerSideEffect(): void {

		store.dispatch(increaseSpeed());

		return;
	}
}