import React, { Component } from "react";
import fetch from "isomorphic-fetch";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deals: [],
            error:false
        }
    }
    
  componentDidMount() {
    fetch(`http://localhost:3001/api/deals?title=diopuerc`)
        .then(response => {
            return response.json()
        })
        .then(response => {
            console.log('response ', response)
            this.setState({ deals: response });
        })
        .catch(err=>{
            console.log('response',err )
            this.setState({
                error:true
            })
        })
  }
  render() {
      
    let deals=  this.state.deals.length> 0 ? this.state.deals.map((deal,index)=>{
                  return(
                      <div key={index}>
                          <p>{deal.title}</p>
                      </div>
                  )
                })
        : '...'
    return (
      <div className="App">
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
        </header>

        <main className="BodyContent">
            <h1>Deals</h1>
            <div>
            
                {deals}
                {this.state.error &&
                    <p>No result found</p>}
            </div>
        </main>
      </div>
    );
  }
}

export default App;
