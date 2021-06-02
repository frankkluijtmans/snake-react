import { Direction } from "../enums/Direction";
import { ICoordinate } from "../interfaces/coordinate.interface";
import { Plane } from "./Plane";
import { Input } from "./Input";

export class Snake {

	public coordinates: ICoordinate[] = [];
	private direction: Direction = Direction.RIGHT;

	public init(plane: Plane): void {

		this.coordinates = [
			{
				x: 0,
				y: 0
			},
			{
				x: 1,
				y: 0
			}
		];
	}

	public update(): void {
		
		const currentHead: ICoordinate = this.coordinates[this.coordinates.length - 1];
		this.coordinates.shift();
		this.coordinates.push(this.getNewPosition(currentHead));
	}

	public draw(plane: Plane): void {

		plane.grid.selectAll('rect').remove();
            
        plane.grid.selectAll('rect')
            .data(this.coordinates)
            .enter()
            .append('rect')
            .attr('fill', '#EC1395')
            .attr('width', plane.CELL_SIZE)
            .attr('height', plane.CELL_SIZE)
            .attr('x', (point) => { return point.x * plane.CELL_SIZE })
            .attr('y', (point) => { return point.y * plane.CELL_SIZE })
            .exit();
	}

	public bindInput(input: Input): void {

		input.subscribe({
			keyCodes: ['KeyW', 'ArrowUp'],
			callback: () => {
				if(this.direction === Direction.DOWN) return;
				this.direction = Direction.UP
			}
		});

		input.subscribe({
			keyCodes: ['KeyS', 'ArrowDown'],
			callback: () => {
				if(this.direction === Direction.UP) return;
				this.direction = Direction.DOWN
			}
		});

		input.subscribe({
			keyCodes: ['KeyA', 'ArrowLeft'],
			callback: () => {
				if(this.direction === Direction.RIGHT) return;
				this.direction = Direction.LEFT
			}
		});

		input.subscribe({
			keyCodes: ['KeyD', 'ArrowRight'],
			callback: () => {
				if(this.direction === Direction.LEFT) return;
				this.direction = Direction.RIGHT
			}
		});
	}

	private getNewPosition(currentHead: ICoordinate): ICoordinate {

		switch(this.direction) {
			case Direction.UP:
				return {
					x: currentHead.x,
					y: currentHead.y - 1
				}
			case Direction.DOWN:
				return {
					x: currentHead.x,
					y: currentHead.y + 1
				}
			case Direction.LEFT:
				return {
					x: currentHead.x - 1,
					y: currentHead.y
				}
			case Direction.RIGHT:
				return {
					x: currentHead.x + 1,
					y: currentHead.y
				}
		}
	}
}