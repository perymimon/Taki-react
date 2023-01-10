import './index.scss'
import React from "react";
import {createRoot} from 'react-dom/client';

import {Provider} from 'unistore/src/combined/react'
import {store} from './store/store';
import Game from './game-layout';

const container = document.querySelector('game');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
    <Provider store={store}>
        <Game/>
    </Provider>
);

