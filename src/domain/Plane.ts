import * as d3 from "d3";

export class Plane {

	readonly CELL_SIZE: number = 32;
	public grid: any;
	public gridSize: { width: number, height: number } = {
		width: Math.floor(1024 / this.CELL_SIZE),
		height: Math.floor(768 / this.CELL_SIZE)
	};

	public init(): void {

		this.grid = d3.select('#plane')
            .append('svg')
            .attr('width', this.gridSize.width * this.CELL_SIZE)
            .attr('height', this.gridSize.height * this.CELL_SIZE);

		// Render grid lines along the x axis
		for(let i = 1; i < this.gridSize.width; i++) {
			this.grid
				.append('rect')
				.attr('width', 2)
				.attr('height', this.gridSize.height * this.CELL_SIZE)
				.attr('class', 'GridLine')
				.attr('x', i * this.CELL_SIZE - 1)
				.attr('y', 0);
		}

		// Render grid lines along the y axis
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