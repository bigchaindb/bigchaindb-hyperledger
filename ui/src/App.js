import React, { Component } from 'react';
import './App.css';
import {callChaincode, wsListen}  from './service.js';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      inputCallback: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    // Start WS listener
    wsListen()

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
    callChaincode(this.state.inputValue,this.state.inputCallback)
    event.preventDefault();
  }
  render() {
    return(
      <section className="jumbotron text-center">
        <div className="container">
          <h1 className="jumbotron-heading">BigchainDB - Hyperledger - Oracle</h1>
          <div className="lead-body">
            <form className="inputForm" onSubmit={this.handleSubmit}>
              <div>
                <label htmlFor="inputValue" className="sr-only">Value:</label>
                <input type="text" name="inputValue" id="inputValue" className="form-control" placeholder="Value" value={this.state.inputValue} onChange={this.handleValueChange.bind(this)}/>
              </div>
              <div>
                <label htmlFor="inputCallback" className="sr-only">Callback:</label>
                <textarea type="text" name="inputCallback" id="inputCallback" className="form-control" placeholder="Code callback" value={this.state.inputCallback} onChange={this.handleCallbackChange.bind(this)}></textarea>
              </div>
              <div>
                <button className="btn btn-lg btn-primary btn-block" type="submit">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    )
  }
}

export default App;
