import React from "react";
import Icon from '../directives/icon';
import {Card, connect, get} from '../link'
import './hand.scss';
import './select-color.scss';

import {store, actions} from '../store/store';

import {GAME_MODE} from '../../common/game-consts';
import {animeSortHandCard} from '../utils/measuremens';
import {classnames} from '../utils/utils';


const sortOrder = new Set();
var lastSort = '';

function addToSort(key) {
    sortOrder.delete(key);
    sortOrder.add(key);

}

function sort(objects) {
    sortOrder.forEach(function (sortKey) {
        const [key, inv] = sortKey.split(' ');
        if (inv)
            objects.sort((a, b) => b[key] > a[key] ? 1 : -1);
        else
            objects.sort((a, b) => a[key] > b[key] ? 1 : -1);
    });
    return objects;
}

// let sortFn = (a, b) => a;

function handleCardClick(card) {
    return function (event) {
        actions.playCard(card, event.target);
    }
}

export default connect('turn, players, player, mode')(
    function Hand({turn, players, player, mode, forceUpdate}) {
        const playerHand = get(player, 'hand', []);
        const playerCardHandSorted = sort(playerHand.slice());

        function handleSort(event) {
            const sortKey = event.currentTarget.value;
            lastSort = event.currentTarget.id;

            addToSort(sortKey);
            forceUpdate();
            animeSortHandCard(playerCardHandSorted);
        }

        const classes = classnames({
            sorting: true,

        });

        return (
            <hand-game>

                <div className="title dramatic-text clearfix">
                    {
                        (mode === GAME_MODE.TAKI) ?
                            <button className={'btn-end-turn'}
                                    onClick={actions.endTurn}>end turn</button> : null
                    }
                    {playerHand.length} cards

                    <div className={`sorting ${lastSort}`}>

                        {/*<label className="content" id="sortSymbolAsc">*/}
                            {/*<input name="sort" type="radio" value="symbol" tabIndex="true"/>*/}
                            {/*<div class="checkmark">*/}
                                {/*<Icon iconName="cardNumber3"/>*/}
                                {/*<Icon iconName="cardNumber2"/>*/}
                                {/*<Icon iconName="cardNumber1"/>*/}
                            {/*</div>*/}
                        {/*</label>*/}

                        {/*<label className="content" id="sortSymbolDesc">*/}
                            {/*<input name="sort" type="radio" value="symbol inv" tabIndex="true"/>div*/}
                            {/*<div className="checkmark"> */}
                                {/*<Icon iconName="cardNumber3"/>*/}
                                {/*<Icon iconName="cardNumber2"/>*/}
                                {/*<Icon iconName="cardNumber1"/>*/}
                            {/*</div>*/}
                        {/*</label>*/}

                        {/*<label className="content" id="sortColor">*/}
                            {/*<input name="sort" type="radio" value="color" tabIndex="true"/>*/}
                            {/*<div className="checkmark">*/}
                                {/*<Icon iconName="cardNumber3"/>*/}
                                {/*<Icon iconName="cardNumber2"/>*/}
                                {/*<Icon iconName="cardNumber1"/>*/}
                            {/*</div>*/}
                        {/*</label>*/}

                        {/*button*/}
                        <button id="sortSymbolAsc" value="symbol" onClick={handleSort} title="by symbol"
                                className="content">
                            <Icon iconName="cardNumber3"/>
                            <Icon iconName="cardNumber2"/>
                            <Icon iconName="cardNumber1"/>
                        </button>

                        <button id="sortSymbolDesc" value="symbol inv" onClick={handleSort} title="by symbol descending"
                                className="content">
                            <Icon iconName="cardNumber1"/>
                            <Icon iconName="cardNumber2"/>
                            <Icon iconName="cardNumber3"/>
                        </button>

                        <button id="sortColor" value="color" onClick={handleSort} title="by color"  className="content">
                            <Icon iconName="cardNumber3"/>
                            <Icon iconName="cardNumber2"/>
                            <Icon iconName="cardNumber1"/>
                        </button>

                    </div>
                </div>
                {
                    playerCardHandSorted.map((card) => {
                        return <Card card={card}
                                     key={card.id}
                                     onClick={handleCardClick(card)}/>

                    })
                }
            </hand-game>
        )
    },
)

function ColorSelect({onSelectColor}) {
    return <color-select>
        <div class="cube" data-color="red" data-value="R" onClick={onSelectColor}/>
        <div class="cube" data-color="blue" data-value="B" onClick={onSelectColor}/>
        <div class="cube" data-color="yellow" data-value="Y" onClick={onSelectColor}/>
        <div class="cube" data-color="green" data-value="G" onClick={onSelectColor}/>
    </color-select>
}
