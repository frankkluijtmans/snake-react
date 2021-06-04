import React, { Component } from "react";
import { store } from "../store/store";
import { changeGameState } from "../store/slices/GameStateSlice";
import { GameState } from "../enums/GameState";
import Instructions from "./Instructions";

export default class StartScreen extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="Screen">
				<h1>Snake</h1>
				<p>Eat as much food as you can to reach a high score!</p>
				<Instructions/>
				<button onClick={() => store.dispatch(changeGameState(GameState.ACTIVE))}>Start game</button>
			</div>
		);
	}
}