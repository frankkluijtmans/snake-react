import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IGameState } from '../../interfaces/state.interface';
import { GameState } from '../../enums/GameState';

const initialState: IGameState = {
	score: 0,
	state: GameState.INITIAL,
	gameLoop: null
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
		},
		setGameLoop: (state, action: PayloadAction<any>) => {
			state.gameLoop = action.payload;
		},
		clearGameLoop: state => {
			clearInterval(state.gameLoop);
			state.gameLoop = null;
		}
	}
});

export const { incrementScore, changeGameState, resetScore, setGameLoop, clearGameLoop } = gameStateSlice.actions;
export default gameStateSlice.reducer;