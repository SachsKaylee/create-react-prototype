import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React &amp; create-react-protoype</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
          <br/>
          Since this example uses the <code>/dist</code> output of your app, make sure to have <code>npm run watch</code> running alongside.
        </p>
      </div>
    );
  }
}

export default App;
