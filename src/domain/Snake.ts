import { Direction } from "../enums/Direction";
import { ICoordinate } from "../interfaces/coordinate.interface";
import { Plane } from "./Plane";
import { Input } from "./Input";

export class Snake {

	public coordinates: ICoordinate[] = [];
	private direction: Direction = Direction.RIGHT;
	private plane: Plane;
	private input: Input;

	constructor(plane: Plane, input: Input) {
		this.plane = plane;
		this.input = input;
		this.bindInput();
	}

	public init(): void {

		this.coordinates = [
			{
				x: Math.floor(this.plane.gridSize.width / 2),
				y: Math.floor(this.plane.gridSize.height / 2)
			},
			{
				x: Math.floor(this.plane.gridSize.width / 2) + 1,
				y: Math.floor(this.plane.gridSize.height / 2)
			}
		];
	}

	public update(): void {
		
		const currentHead: ICoordinate = this.coordinates[this.coordinates.length - 1];
		this.coordinates.shift();
		this.coordinates.push(this.getNewPosition(currentHead));
	}

	public draw(): void {

		this.plane.grid.selectAll('rect.SnakePart').remove();
            
        this.plane.grid.selectAll('rect.SnakePart')
            .data(this.coordinates)
            .enter()
            .append('rect')
			.attr('class', 'SnakePart')
            .attr('width', this.plane.CELL_SIZE)
            .attr('height', this.plane.CELL_SIZE)
            .attr('x', (point) => { return point.x * this.plane.CELL_SIZE })
            .attr('y', (point) => { return point.y * this.plane.CELL_SIZE })
            .exit();
	}

	public grow(): void {

		this.coordinates.unshift(this.coordinates[0]);
	}

	private bindInput(): void {

		this.input.subscribe({
			keyCodes: ['KeyW', 'ArrowUp'],
			callback: () => {
				if(this.direction === Direction.DOWN) return;
				this.direction = Direction.UP
			}
		});

		this.input.subscribe({
			keyCodes: ['KeyS', 'ArrowDown'],
			callback: () => {
				if(this.direction === Direction.UP) return;
				this.direction = Direction.DOWN
			}
		});

		this.input.subscribe({
			keyCodes: ['KeyA', 'ArrowLeft'],
			callback: () => {
				if(this.direction === Direction.RIGHT) return;
				this.direction = Direction.LEFT
			}
		});

		this.input.subscribe({
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