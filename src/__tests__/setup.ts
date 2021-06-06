import { GameState } from "../enums/GameState";
import * as d3 from "d3";

require('jest-fetch-mock').enableMocks()

global["mockStore"] = {
	getState() {
		return {
			sideEffects: {
				speedMultiplier: 1
			},
			gameState: {
				state: GameState.INITIAL
			}
		}
	},
	dispatch: jest.fn(),
	subscribe: jest.fn((callback) => callback())
}

global["mockSvgElement"] = d3.select("body").
	append("svg")
	.attr("width", 64)
	.attr("height", 64);