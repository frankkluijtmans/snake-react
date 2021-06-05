import { GameState } from "../enums/GameState";

interface ISideEffectsState {
	speedMultiplier: number,
	invertedControls: boolean,
	invertedControlsTimer: any
};

interface IGameState {
	score: number,
	state: GameState
};

export {
    ISideEffectsState,
    IGameState
}