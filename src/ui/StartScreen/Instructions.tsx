import React, { Component } from "react";

export default class Instructions extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="InstructionsWrapper">
				<ol className="List">
					<li>Cherry - 100 points</li>
					<li>Mushroom - 350 points <span>(inverts your controls for 30 seconds)</span></li>
					<li>Pizza - 400 points <span>(increases your speed by 0.1)</span></li>
				</ol>
				<ol className="List">
					<li>Move up - W or Arrow Up</li>
					<li>Move down - S or Arrow Down</li>
					<li>Move left - A or Arrow Left</li>
					<li>Move right - D or Arrow Right</li>
					<li>Pause / Resume Game - Space Bar</li>
				</ol>
			</div>
		);
	}
}