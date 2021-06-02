import { FoodType } from "../../enums/FoodType";
import { ICoordinate } from "../../interfaces/coordinate.interface";
import { Plane } from "../Plane";

export abstract class Food {

	public coordinate: ICoordinate;
	protected abstract value: number;
	protected abstract type: FoodType;
	protected abstract triggerSideEffect(): void;

	constructor(coordinate: ICoordinate) {
		this.coordinate = coordinate;
	}

	public draw(plane: Plane): void {

        plane.grid
            .append('rect')
			.attr('class', 'Food' + this.type)
            .attr('width', plane.CELL_SIZE)
            .attr('height', plane.CELL_SIZE)
            .attr('x', this.coordinate.x * plane.CELL_SIZE)
            .attr('y', this.coordinate.y * plane.CELL_SIZE);
	}
}