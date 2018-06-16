import React from 'react';
import {render} from 'react-dom';

import AppRouter from './router/router'
import { Provider } from "react-redux";
import store from "./store";

store.subscribe(() => {
    // console.log("Dispatch");
})

render(<Provider store={store}>
        <AppRouter ownStore={store} />
    </Provider>, document.getElementById('mount-point'))