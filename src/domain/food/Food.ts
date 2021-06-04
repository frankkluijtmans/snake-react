import { FoodType } from "../../enums/FoodType";
import { ICoordinate } from "../../interfaces/coordinate.interface";
import { Plane } from "../Plane";
import { store } from "../../store/store";
import { incrementScore } from "../../store/slices/GameStateSlice";
import * as d3 from "d3";

export abstract class Food {

	public coordinate: ICoordinate;
	public abstract type: FoodType;
	protected identifier: string;
	protected abstract image: string;
	protected abstract value: number;
	protected abstract triggerSideEffect(): void;

	constructor(coordinate: ICoordinate) {
		this.coordinate = coordinate;
		this.identifier = this.generateRandomIdentifier(10);
	}

	public async draw(plane: Plane): Promise<void> {

		const image = await d3.xml(this.image);
		
		image.documentElement.setAttribute('width', plane.CELL_SIZE + "px");
		image.documentElement.setAttribute('height', plane.CELL_SIZE  + "px");
		image.documentElement.setAttribute('x', this.coordinate.x * plane.CELL_SIZE + "px");
		image.documentElement.setAttribute('y', this.coordinate.y * plane.CELL_SIZE + "px");
		image.documentElement.setAttribute('identifier', this.identifier);

		plane.grid.node()
			.append(image.documentElement);
	}

	public eat(plane: Plane): void {

		store.dispatch(incrementScore(this.value));
		this.remove(plane);
		this.triggerSideEffect();
	}

	public remove(plane: Plane): void {

		plane.grid
			.selectAll("[identifier='"+ this.identifier +"']")
			.remove();
	}

	private generateRandomIdentifier(length: number): string {

		return '_' + Math.random().toString(36).substr(2, length);
	}
}