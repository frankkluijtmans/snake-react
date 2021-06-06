import React, { Component } from "react";
import { store } from "../store/store";

export default class ScoreBoard extends Component<{}, { 
    score: number,
    speed: number,
    invertedControls: string 
}>  {

    constructor(props) {
        super(props);

        this.state = {
            score: store.getState().gameState.score,
            speed: store.getState().sideEffects.speedMultiplier,
            invertedControls: store.getState().sideEffects.invertedControls ? 'Inverted' : 'Normal'
        };

        this.subscribeToStoreChanges();
    }

    private subscribeToStoreChanges(): void {

        store.subscribe(() => {
            this.setState({
                score: store.getState().gameState.score,
                speed: store.getState().sideEffects.speedMultiplier,
                invertedControls: store.getState().sideEffects.invertedControls ? 'Inverted' : 'Normal'
            });
        })
    }

    render() {
        return (
            <div className="ScoreBoard">
                <span><strong>Score:</strong> { this.state.score }</span>
                <span><strong>Speed:</strong> { this.state.speed }</span>
                <span
                    className={ this.state.invertedControls }
                >
                    <strong>Controls</strong>: { this.state.invertedControls }
                </span>
            </div>
        );
    }
}