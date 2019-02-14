import React, {Component} from "react";
import './player-name.scss'
import {store} from '../store/store';
import {get} from '../link'

export default function PlayerName({token}) {
    const state = store.getState();
    const player = state.players.find(p => p.token === token);

    const customProperties = {
        '--player-color': get(player,'color')
    };

    return (
        <player-name
            class="dramatic-text"
            style={customProperties}>{get(player,'name')}</player-name>
    )
}
