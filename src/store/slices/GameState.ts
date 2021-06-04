import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IGameState } from '../../interfaces/state.interface';
import { GameState } from '../../enums/GameState';

const initialState: IGameState = {
	score: 0,
	state: GameState.INITIAL
};

export const gameStateSlice = createSlice({
	name: 'gameState',
	initialState,
	reducers: {
		incrementScore: (state, action: PayloadAction<number>) => {
			state.score += action.payload;
		},
		changeGameState: (state, action: PayloadAction<GameState>) => {
			state.state = action.payload;
		},
		resetScore: state => {
			state.score = 0;
		}
	}
});

export const { incrementScore, changeGameState, resetScore } = gameStateSlice.actions;
export default gameStateSlice.reducer;