import "./welcome-board.scss"
import React, {Component, Fragment} from "react";
import WelcomeBoard from '../game-layout';

import {store, actions} from '../store/store'
import Icon from '../directives/icon'
import get from 'lodash/get';

import {connect} from '../link';
import {animeFloatingElements} from '../utils/measuremens';
import {Player} from './players-board';


export default connect('player, gameInProgress,players')(
    function WelcomeBoard({player, gameInProgress, players}) {

        const JoinButton = <button className="main-button start-game"
                                   onClick={store.run.joinGame}>join game</button>;
        const StartButton = <button className="main-button start-game"
                                    onClick={store.run.startGame}>start a game</button>;

        const Players = () => players.map(p => <Player player={p} key={p.token}/>);
        var stopFloating = () => {
        };

        setTimeout(function () {
            try {
                const container = document.querySelector('.connected-player');
                const elements = container.querySelectorAll('tk-player-board');
                stopFloating();
                stopFloating = animeFloatingElements(elements);
            } catch (e) {
                stopFloating();
            }
        }, 0);


        return (
            <Fragment>
                <welcome-board class="board">
                    <h1 className="four-color-background">welcome</h1>
                    <h2>
                        <Icon iconName={get(player, 'avatar')}/>
                        {get(player, 'name')}
                    </h2>
                    <h3>{get(player, 'slogan')}</h3>
                    {
                        gameInProgress ? JoinButton : StartButton
                    }


                </welcome-board>
                <div className="connected-player">
                    <Players/>
                </div>
            </Fragment>
        )
    },
);

