import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      inputCallback: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleValueChange(event) {
    this.setState({inputValue: event.target.value})
  }
  handleCallbackChange(event) {
    this.setState({inputCallback: event.target.value})
  }
  handleSubmit(event) {
    console.log('inputCallback: ' + this.state.inputCallback);
    console.log('inputValue: ' + this.state.inputValue);
    event.preventDefault();
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label>
              Value:
              <input type="text" name="inputValue" placeholder="value" value={this.state.inputValue} onChange={this.handleValueChange.bind(this)}/>
            </label>
          </div>
          <div>
            <label>
              Callback:
              <input type="text" name="inputCallback" placeholder="callback" value={this.state.inputCallback} onChange={this.handleCallbackChange.bind(this)}/>
            </label>
          </div>
          <div>
            <input type="submit" value="Submit" />
          </div>
        </form>
      </div>
    );
  }
}

export default App;
