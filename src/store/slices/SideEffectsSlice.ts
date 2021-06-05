import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISideEffectsState } from '../../interfaces/state.interface';

const initialState: ISideEffectsState = {
	speedMultiplier: 1,
	invertedControls: false,
	invertedControlsTimer: null
};

export const sideEffectSlice = createSlice({
	name: 'sideEffects',
	initialState,
	reducers: {
		invertControls: (state, action: PayloadAction<any>) => {
			clearTimeout(state.invertedControlsTimer);
			state.invertedControls = true;
			state.invertedControlsTimer = action.payload;
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