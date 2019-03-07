import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { createMuiTheme } from '@material-ui/core/styles';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

const theme = createMuiTheme({
    palette: {
        primary: {
            // main: '#ff4400',//#0277BD
            // main: '#0277BD'
            main: '#263238'
        },
        secondary: {
            // light: '#0066ff',
            main: '#a0a0ff'
        }
    }
})

ReactDOM.render(
    <MuiThemeProvider theme={theme} >
        <App />
    </MuiThemeProvider>
    
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
