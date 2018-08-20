import React, { Component } from 'react';
import './App.css';
import { callChaincode, wsListen }  from './service.js';
import appInsights from 'applicationinsights';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      inputCallback: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    // Start WS listener
    wsListen();
    appInsights.setup(process.env.REACT_APP_APPLICATION_INSIGHTS_KEY).start(); // initialize application insights
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
    callChaincode(this.state.inputValue,this.state.inputCallback);
    event.preventDefault();
  }
  render() {
    return(
      <section className="jumbotron text-center">
        <div className="container">
          <h1 className="jumbotron-heading">BigchainDB - Hyperledger Fabric <br /> Oracle</h1>
          <div className="lead-body">
            <div className="explainer">
            This UI is for demo usage of the BigchainDB-Hyperledger Fabric oracle.
            The following form, takes two inputs - a BigchainDB asset ID and a JavaScript function. These inputs are passed to a HyperLedger chain-code which internally passes them to the oracle. The oracle then queries BigchainDB with the asset ID and executes the callback with asset.data of the queried asset.<br />
            The oracle then sends back the results to this UI using a websocket.
            <br /><br />
            In a real scenario, the chain-code can do pre-processing and create a dynamic callback before sending the request to the oracle.
            </div>
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
            <div className="footer">
              Developed By: <a href="https://www.bigchaindb.com">BigchainDB</a> and <a href="https://theledger.be">TheLedger</a>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default App;
