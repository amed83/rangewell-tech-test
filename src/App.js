import React, { Component } from "react";
import fetch from "isomorphic-fetch";
import logo from "./logo.svg";
import "./App.css";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deals: [],
            error:false,
            startDate:new Date(),
            stats:'',
            dealDetails:{}
        }
        
    }
    
  componentDidMount() {
    fetch(`http://localhost:3001/api/deals`)
        .then(response => {
            return response.json()
        })
        .then(response => {
            this.setState({ deals: response });
        })
        .catch(err=>{
            console.log('response',err )
            this.setState({
                error:true
            })
        })
    fetch(`http://localhost:3001/api/deals/stats`)
        .then(response=>{
            return response.json()
        })
        .then(response=>{
            this.setState({
                stats:response
            })
        })
        .catch(err=>console.log('error ', err))
  }
  selectDate= (date)=>{
    let now = Date.parse(this.state.startDate)
     this.setState({
        startDate:date,
        showFiltered:true 
    })
    const dateSelected= Date.parse(date)
    const filteredDeals= this.state.deals.map(deal=>{
        // Date.parse(deal.createdAt)
        return {
            ...deal,
            createdAt:Date.parse(deal.createdAt),

        }
    }).filter(d=>d.createdAt>=dateSelected)
    
    this.setState({
        filteredDeals
    })
  }
  addDealDetails=(e)=>{
    const dealProps = {...this.state}
    dealProps.dealDetails[e.target.name]=e.target.value
    this.setState(dealProps)
  }
  
  addDeal(){
     const dealPayload= this.state.dealDetails
     console.log('dealPayload ', dealPayload)
     fetch('http://localhost:3001/api/deal/addDeal',
      { method: 'POST', body: JSON.stringify(dealPayload),headers: {
                "Content-Type": "application/json"
            } })
    .then(res => res.json()) 
    .then(json => console.log(json))
    .catch(err=>console.log('error ', err))
  }
  
  render() {

    let deals=  this.state.deals.length>0 &&!this.state.showFiltered ? this.state.deals.map((deal,index)=>{
                    return(
                      <div key={index}>
                          <p>{deal.title}</p>
                      </div>
                    )
                })
            : this.state.showFiltered ?  this.state.filteredDeals.map((deal,index)=>{
                            return(
                              <div key={index}>
                                  <p>{deal.title}</p>
                              </div>
                             )
                })           
            : '...'
    let stats = this.state.stats.length>0 ?this.state.stats.map((deal,index)=>{
                    return(
                        <div key={index}>
                            <p>Number of Deals: {deal.deals_count}</p>
                            <p>Total Amount: {deal.total_amount}</p>
                            <p>Average Amount: {deal.avg_amount}</p>
                        </div>
                    )
               })
               :''
    
    return (
      <div className="App">
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
        </header>

        <main className="BodyContent">
            <div className='MainContainer'>
                <div>
                    <h1>Deals</h1>
                    {deals}
                    {this.state.error &&
                        <p>No result found</p>}
                </div>
                <div>
                    <h1>Stats</h1>
                    {stats}
                </div>
            </div>
            
            <hr/>
            <div>
                <h3>Filter deals</h3>
                    <DatePicker
                       selected={this.state.startDate}
                       onChange={this.selectDate}
                     />
            </div>
            <div>
                <h3>Add new Deal</h3>
                <form action="">
                    <input type="text" className='Input' name='dealName' onChange={this.addDealDetails} placeholder='deal name'/>
                    <input type="text" className='Input' name='dealAmount' onChange={this.addDealDetails} placeholder='amount'/>
            
                </form>
                <button className="addBtn" onClick={()=>this.addDeal()}>Add Deal</button>
            </div>
        </main>
      </div>
    );
  }
}
// <input type="date" defaultValue={today} onChange={(vlue)=>this.selectDate(value)}/>
export default App;
