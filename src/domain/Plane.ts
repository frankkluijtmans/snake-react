import * as d3 from "d3";
import { GameState } from "../enums/GameState";
import { ICoordinate } from "../interfaces/coordinate.interface";
import { changeGameState, clearGameLoop } from "../store/slices/GameStateSlice";
import { store } from "../store/store";

export class Plane {

	readonly CELL_SIZE: number = 32;
	public grid: any;
	public gridSize: { width: number, height: number } = {
		width: Math.floor(window.innerWidth / this.CELL_SIZE),
		height: Math.floor((window.innerHeight - 60) / this.CELL_SIZE)
	};
	private store = store;
	private d3 = d3;

	public init(): void {

		this.grid = this.d3.select('#plane')
            .append('svg')
            .attr('width', this.gridSize.width * this.CELL_SIZE)
            .attr('height', this.gridSize.height * this.CELL_SIZE);

		this.renderGrid();
	}

	public checkCollision(coordinate: ICoordinate): boolean {

		if(coordinate.x < 0 
			|| coordinate.x > (this.gridSize.width - 1)
			|| coordinate.y < 0
			|| coordinate.y > (this.gridSize.height - 1)) {
			
			this.onCollision();
			return true;
		}

		return false;
	}

	private onCollision(): void {

		this.store.dispatch(clearGameLoop());
		this.store.dispatch(changeGameState(GameState.GAME_OVER));
	}

	private renderGrid(): void {

		for(let i = 1; i < this.gridSize.width; i++) {
			this.grid
				.append('rect')
				.attr('width', 2)
				.attr('height', this.gridSize.height * this.CELL_SIZE)
				.attr('class', 'GridLine')
				.attr('x', i * this.CELL_SIZE - 1)
				.attr('y', 0);
		}

		for(let i = 1; i < this.gridSize.height; i++) {
			this.grid
				.append('rect')
				.attr('width', this.gridSize.width * this.CELL_SIZE)
				.attr('height', 2)
				.attr('class', 'GridLine')
				.attr('x', 0)
				.attr('y', i * this.CELL_SIZE - 1);
		}
	}
}