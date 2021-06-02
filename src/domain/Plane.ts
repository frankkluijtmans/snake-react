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
	}
}