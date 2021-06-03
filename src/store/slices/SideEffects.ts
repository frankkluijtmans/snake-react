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
			state.invertedControls = true;
		},
		revertControls: state => {
			state.invertedControls = false;
		},
		increaseSpeed: state => {
			state.speedMultiplier = parseFloat((state.speedMultiplier + 0.1).toFixed(1));
		},
		resetSideEffects: state => {
			state.speedMultiplier = 1;
			state.invertedControls = false;
		}
	}
});

export const { invertControls, revertControls, increaseSpeed, resetSideEffects } = sideEffectSlice.actions;
export default sideEffectSlice.reducer;