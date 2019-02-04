import React, {Component} from "react";
import './player-name.scss'
import {store} from '../store/store';
import {get} from '../link'

export default function PlayerName({name}) {
    const state = store.getState();
    const player = state.players.find(p => p.name === name);

    const customProperties = {
        '--player-color': get(player,'color')
    };

    return (
        <player-name
            class="dramatic-text"
            style={customProperties}>{name}</player-name>
    )
}
