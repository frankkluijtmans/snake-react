import { GameState } from "../../enums/GameState";

export const store = {
    dispatch: jest.fn(),
    subscribe: jest.fn(callback => callback()),
    getState: jest.fn(() => {
        return {
            sideEffects: {
                speedMultiplier: 1
            },
            gameState: {
                state: GameState.INITIAL
            }
        }
    })
};