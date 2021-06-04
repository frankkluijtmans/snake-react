import { FoodType } from "../../enums/FoodType";
import { ICoordinate } from "../../interfaces/coordinate.interface";
import { Food } from "./Food";
import { store } from "../../store/store";
import { invertControls, revertControls } from "../../store/slices/SideEffectsSlice";
import MushroomImage from "../../assets/mushroom.svg";

export class Mushroom extends Food {

	public value: number = 350;
	public image: string = MushroomImage;
	public type: FoodType = FoodType.MUSHROOM;
	private timeOut;

	constructor(coordinate: ICoordinate) {
		super(coordinate);
	}

	public triggerSideEffect(): void {

		clearInterval(this.timeOut);
		store.dispatch(invertControls());

		this.timeOut = setInterval(() => {
			store.dispatch(revertControls());
		}, 30000);

		return;
	}
}