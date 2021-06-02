import React, { Component } from "react";

export default class ScoreBoard extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="ScoreBoard">
                <span>Score: 0</span>
            </div>
        );
    }
}