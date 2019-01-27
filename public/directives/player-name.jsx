import React, {Component} from "react";
import './player-name.scss'
import {store} from '../store/store';


export default function PlayerName({name}) {
    const state = store.getState();
    const player = state.players.find(p => p.name === name);

    const customProperties = {
        '--player-color': player.color,
    };

    return (
        <player-name
            class="dramatic-text"
            style={customProperties}>{player.name}</player-name>
    )
}
