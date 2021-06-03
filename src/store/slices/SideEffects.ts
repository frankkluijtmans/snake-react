import { createSlice } from '@reduxjs/toolkit';

interface ISideEffectsState {
	speedMultiplier: number,
	invertedControls: boolean
};

const initialState: ISideEffectsState = {
	speedMultiplier: 1,
	invertedControls: false
};

export const sideEffectSlice = createSlice({
	name: 'sideEffects',
	initialState,
	reducers: {
		invertControls: state => {
			state.invertedControls = state.invertedControls ? false : true;
		},
		increaseSpeed: state => {
			state.speedMultiplier += 0.1;
		},
		resetSideEffects: state => {
			state.speedMultiplier = 1;
			state.invertedControls = false;
		}
	}
});

export const { invertControls, increaseSpeed, resetSideEffects } = sideEffectSlice.actions;
export default sideEffectSlice.reducer;