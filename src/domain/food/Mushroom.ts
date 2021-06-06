import { FoodType } from "../../enums/FoodType";
import { ICoordinate } from "../../interfaces/coordinate.interface";
import { Food } from "./Food";
import { invertControls, revertControls } from "../../store/slices/SideEffectsSlice";
import MushroomImage from "../../assets/mushroom.svg";

export class Mushroom extends Food {

	public value: number = 350;
	public image: string = MushroomImage;
	public type: FoodType = FoodType.MUSHROOM;

	constructor(coordinate: ICoordinate) {
		super(coordinate);
	}

	public triggerSideEffect(): void {

		this.store.dispatch(invertControls(setTimeout(() => {
			this.store.dispatch(revertControls());
		}, 30000)));
	}
}