import { ICoordinate } from "../interfaces/coordinate.interface";
import { Cherry } from "./food/Cherry"
import { Mushroom } from "./food/Mushroom";
import { Pizza } from "./food/Pizza";
import { Helpers } from "./Helpers";

export class FoodFactory {

    create(coordinate: ICoordinate) {

        const randomizedNumber: number = Helpers.generateRandomNumber(1, 3)
        console.log(randomizedNumber);
        switch(randomizedNumber) {
            case 1:
                return new Cherry(coordinate);
            case 2:
                return new Mushroom(coordinate);
            case 3:
                return new Pizza(coordinate);
        }

        return new Cherry(coordinate);
    }
}