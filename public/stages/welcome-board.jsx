import "./welcome-board.scss"
import React, {Component} from "react";

import {store,actions} from '../store/store'
import Icon from '../component/icon'

import {connect} from 'unistore/react';

export default connect('player')(
    function WelcomeBoard({player}) {
        return (
            <welcome-board class="board shiny-block">
                <Icon className={player.avatar}/>
                <h2>{player.name}</h2>
                <h3>{player.slogan}</h3>
                <button className="main-button start-game"
                        onClick={store.run.startGame}
                >start game</button>
            </welcome-board>
        )
    }
);

