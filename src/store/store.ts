import { configureStore } from '@reduxjs/toolkit'
import gameStateReducer from './slices/GameState';
import sideEffectReducer from './slices/SideEffects';

export const store = configureStore({
	reducer: {
		gameState: gameStateReducer,
		sideEffects: sideEffectReducer
	}
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch