import {connect} from 'unistore/react';
import React, {Component} from "react";
import './control-board.scss'
import CounterDown from '../directives/counter-down';
import {actions} from '../store/store';


export default function ControlBoard() {
    return (
        <control-board>
            <CounterDown/>
            <button onClick={actions.resetGame}>reset game</button>
            <button onClick={actions.logout}>exit</button>
        </control-board>
    )
}

