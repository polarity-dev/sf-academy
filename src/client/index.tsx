import * as React from 'react';
import { render } from 'react-dom';
import App from './App';
import './scss/app.scss';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

render((
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<App />}> </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>

), document.getElementById('root')
);