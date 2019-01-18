import "./welcome-board.scss"
import React, {Component} from "react";

import {store, actions} from '../store/store'
import Icon from '../component/icon'
import get from 'lodash/get';

import {connect} from 'unistore/react';


export default connect('player, gameInProgress')(
    function WelcomeBoard({player, gameInProgress}) {
        return (
            <welcome-board class="board">
                <h1 className="four-color-background">welcome</h1>
                <h2>
                    <Icon className={get(player,'avatar')}/>
                    {get(player,'name')}
                </h2>
                <h3>{get(player,'slogan')}</h3>
                <button className="main-button start-game"
                        onClick={store.run.startGame}>

                    {gameInProgress?'join':'start a'} game

                </button>
            </welcome-board>
        )
    },
);

