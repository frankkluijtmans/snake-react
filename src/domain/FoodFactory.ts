import { Cherry } from "./food/Cherry"

export class FoodFactory {

    create() {
        return new Cherry();
    }
}