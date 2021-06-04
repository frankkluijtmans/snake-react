import { ICoordinate } from "../interfaces/coordinate.interface";
import { Cherry } from "./food/Cherry"
import { Mushroom } from "./food/Mushroom";
import { Pizza } from "./food/Pizza";
import { Helpers } from "./Helpers";

export class FoodFactory {

    create(coordinate: ICoordinate) {

        const itemPool: number[] = [1, 1, 1, 1, 1, 1, 2, 2, 3, 3];
        const randomizedNumber: number = Helpers.generateRandomNumber(0, itemPool.length - 1);

        switch(itemPool[randomizedNumber]) {
            case 1:
                return new Cherry(coordinate);
            case 2:
                return new Mushroom(coordinate);
            case 3:
                return new Pizza(coordinate);
            default:
                return new Cherry(coordinate);
        }
    }
}