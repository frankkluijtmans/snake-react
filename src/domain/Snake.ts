import { Direction } from "../enums/Direction";
import { ICoordinate } from "../interfaces/coordinate.interface";
import { Plane } from "./Plane";
import { Input } from "./Input";
import { store } from "../store/store";
import { Helpers } from "./Helpers";
import { changeGameState, clearGameLoop } from "../store/slices/GameStateSlice";
import { GameState } from "../enums/GameState";

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

	get invertedControls(): boolean {

		return store.getState().sideEffects.invertedControls;
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

	public checkCollision(): boolean {

		if(Helpers.checkCollision(
			this.coordinates[this.coordinates.length - 1],
			this.coordinates.slice(0, this.coordinates.length - 1)
		)) {
			this.onCollision();
			return true;
		}

		return false;
	}

	private onCollision(): void {

		store.dispatch(clearGameLoop());
		store.dispatch(changeGameState(GameState.GAME_OVER));
	}

	private bindInput(): void {

		this.input.subscribe({
			keyCodes: ['KeyW', 'ArrowUp'],
			callback: () => {
				this.changeDirection(Direction.UP, Direction.DOWN);
			}
		});

		this.input.subscribe({
			keyCodes: ['KeyS', 'ArrowDown'],
			callback: () => {
				this.changeDirection(Direction.DOWN, Direction.UP);
			}
		});

		this.input.subscribe({
			keyCodes: ['KeyA', 'ArrowLeft'],
			callback: () => {
				this.changeDirection(Direction.LEFT, Direction.RIGHT);
			}
		});

		this.input.subscribe({
			keyCodes: ['KeyD', 'ArrowRight'],
			callback: () => {
				this.changeDirection(Direction.RIGHT, Direction.LEFT);
			}
		});
	}

	private changeDirection(direction: Direction, oppositeDirection: Direction): void {

		if(this.direction === oppositeDirection
			|| this.invertedControls && this.direction === direction) {
			return
		};
		
		this.invertedControls ? this.direction = oppositeDirection : this.direction = direction;
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