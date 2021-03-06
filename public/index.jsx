import './index.scss'
import React  from "react";
import {render} from 'react-dom';

import {Provider} from 'unistore/src/combined/react'
import {store} from './store/store';
import Game from './game-layout';

if (process.env.NODE_ENV !== 'production') {

}
render(
    <Provider store={store}>
        <Game/>
    </Provider>
    , document.querySelector('game'));
