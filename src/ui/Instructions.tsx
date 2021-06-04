import React, { Component } from "react";
import CherryImage from "../assets/cherry.svg";
import MushroomImage from "../assets/mushroom.svg";
import PizzaImage from "../assets/pizza.svg";

export default class Instructions extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="InstructionsWrapper">
				<ol className="List">
					<li><img className="FoodType" src={CherryImage}/> - 100 points</li>
					<li><img className="FoodType" src={MushroomImage}/> - 350 points <span>(inverts your controls for 30 seconds)</span></li>
					<li><img className="FoodType" src={PizzaImage}/> - 400 points <span>(increases your speed by 0.1)</span></li>
				</ol>
				<ol className="List">
					<li>Move up - <kbd>W</kbd> or <kbd>&uarr;</kbd></li>
					<li>Move down - <kbd>S</kbd> or <kbd>&darr;</kbd></li>
					<li>Move left - <kbd>A</kbd> or <kbd>&larr;</kbd></li>
					<li>Move right - <kbd>D</kbd> or <kbd>&rarr;</kbd></li>
					<li>Pause / Resume Game - <kbd>space</kbd></li>
				</ol>
			</div>
		);
	}
}