import { ICoordinate } from "../interfaces/coordinate.interface";

export class Helpers {

    public static generateRandomNumber(min: number, max: number) {

        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public static checkCollision(baseCoordinate: ICoordinate, coordinatesToCheck: ICoordinate[]): boolean {

		return coordinatesToCheck.some((coordinate: ICoordinate) => {
			return coordinate.x === baseCoordinate.x && coordinate.y === baseCoordinate.y;
		});
	}
}