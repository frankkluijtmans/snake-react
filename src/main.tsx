import { render } from "react-dom";
import React, { Component } from "react";
import { Game } from "./domain/Game";
import { store } from "./store/store";
import { GameState } from "./enums/GameState";
import ScoreBoard from "./ui/ScoreBoard";
import Plane from "./ui/Plane";

import "./styles/styles.scss";
import GameOverScreen from "./ui/GameOverScreen";
import PauseScreen from "./ui/PauseScreen";
import StartScreen from "./ui/StartScreen";

class Main extends Component<{}, { 
    gameState: GameState,
    score: number
}> {

    private controller: Game;

    constructor(props) {
        super(props);

        this.controller = new Game();
        this.state = {
            gameState: store.getState().gameState.state,
            score: store.getState().gameState.score
        };

        this.subscribeToStoreChanges();
    }

    private subscribeToStoreChanges(): void {

        store.subscribe(() => {
            this.setState({
                gameState: store.getState().gameState.state,
                score: store.getState().gameState.score
            });
        })
    }

    render() {
        return (
            <div className="GameWrapper">
                {this.state.gameState === GameState.INITIAL &&
                    <StartScreen/>
                }
                {this.state.gameState === GameState.PAUSED &&
                    <PauseScreen/>
                }
                {this.state.gameState === GameState.GAME_OVER &&
                    <GameOverScreen 
                        score={ this.state.score }
                    />
                }
                <ScoreBoard/>
                <Plane/>
            </div>
        );
    }
}

render(<Main />, document.getElementById("app"));