import { FoodType } from "../../enums/FoodType";
import { ICoordinate } from "../../interfaces/coordinate.interface";
import { Plane } from "../Plane";

export abstract class Food {

	public coordinate: ICoordinate;
	protected identifier: string;
	protected abstract value: number;
	protected abstract type: FoodType;
	protected abstract triggerSideEffect(): void;

	constructor(coordinate: ICoordinate) {
		this.coordinate = coordinate;
		this.identifier = this.generateRandomIdentifier(10);
	}

	public draw(plane: Plane): void {

        plane.grid
            .append('rect')
			.attr('class', 'Food' + this.type)
            .attr('width', plane.CELL_SIZE)
            .attr('height', plane.CELL_SIZE)
			.attr('identifier', this.identifier)
            .attr('x', this.coordinate.x * plane.CELL_SIZE)
            .attr('y', this.coordinate.y * plane.CELL_SIZE);
	}

	public eat(plane: Plane): void {

		// Dispatch action to increment score
		this.remove(plane);
		this.triggerSideEffect();
	}

	private remove(plane: Plane): void {

		plane.grid
			.selectAll("rect[identifier='"+ this.identifier +"']")
			.remove();
	}

	private generateRandomIdentifier(length: number): string {

		return '_' + Math.random().toString(36).substr(2, length);
	}
}