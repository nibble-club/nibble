import './App.css';

import React from 'react';
import { createUseStyles } from 'react-jss';

import { globalTheme } from './common/theming';
import { AppTheme } from './common/theming.types';
import logo from './logo.svg';

const useStyles = createUseStyles((theme: AppTheme) => ({
  ...globalTheme(theme),
}));

function App() {
  const classes = useStyles();
  return (
    <div>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
