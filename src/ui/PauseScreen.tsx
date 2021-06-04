import React, { Component } from "react";
import Instructions from "./StartScreen/Instructions";

export default class PauseScreen extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="Screen">
				<h2>Game Paused</h2>
				<p>Press <kbd>space</kbd> to continue.</p>
				<Instructions/>
			</div>
		);
	}
}