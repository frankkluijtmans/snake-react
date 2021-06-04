import React, { Component } from "react";
import { store } from "../store/store";
import { GameState } from "../enums/GameState";
import { changeGameState } from "../store/slices/GameState";

export default class GameOverScreen extends Component<{ score: number }, {}> {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="Screen">
                <h2>Game Over</h2>
                <p>Your score was <strong>{ this.props.score }</strong>.</p>
                <button onClick={() => store.dispatch(changeGameState(GameState.ACTIVE))}>Restart game</button>
            </div>
        );
    }
}