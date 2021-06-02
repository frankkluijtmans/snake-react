import { render } from "react-dom";
import React, { Component } from "react";
import { Game } from "./domain/Game";
import ScoreBoard from "./ui/ScoreBoard";
import Plane from "./ui/Plane";

import "./styles/styles.scss";

class Main extends Component {

    private controller: Game;

    constructor(props) {
        super(props);
        this.controller = new Game();
    }

    componentDidMount() {
        this.controller.setup();
    }

    render() {
        return (
            <div className="GameWrapper">
                <ScoreBoard/>
                <Plane/>
            </div>
        );
    }
}

render(<Main />, document.getElementById("app"));