import {connect} from 'unistore/react';
import React, {Component} from "react";
import './player-name.scss'

export default connect('players')(
    function PlayerName({players,name}) {

        const player = players.find( p=> p.name === name);

        const customProperties = {
            '--player-color': player.color,
        };

        return (
            <player-name
                class="dramatic-text"
                style={customProperties}>{player.name}</player-name>
        )
    },
)
