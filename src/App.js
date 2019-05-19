import React, { Component } from "react";
import fetch from "isomorphic-fetch";
import logo from "./logo.svg";
import "./App.css";
import DatePicker from "react-datepicker";
import {loadDeals,creatingNewDeal,
    saveNewDeal,loadStats,filterDetails,editDeal,updateTerminated} from './actions/index'
import {connect} from 'react-redux'
import Edit from './Edit'

import "react-datepicker/dist/react-datepicker.css";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deals: [],
            error:false,
            startDate:new Date(),
    
        }
        
    }
    
    componentDidMount() {
        this.loadDeals()
    }
    
    componentDidUpdate(prevProps){

        if( prevProps.reloadAfterUpdate!==this.props.reloadAfterUpdate){
            this.loadDeals()
            this.props.endUpdate()
        }
        
    }
    
    loadDeals(){
        fetch(`http://localhost:3001/api/deals`)
        .then(response => {
            return response.json()
        })
        .then(response => {
            this.props.addDeals(response)
            this.loadStats()
        })
        .catch(err=>{
            console.log('error',err )
            this.setState({
                error:true
            })
        })
    }
    
    loadStats(){
        fetch(`http://localhost:3001/api/deals/stats`)
        .then(response=>{
            return response.json()
        })
        .then(response=>{
            this.props.getStats(response)
        })
        .catch(err=>console.log('error ', err))  
    }
    
    selectDate= (date)=>{
        // let now = Date.parse(this.state.startDate)
        this.setState({
            startDate:date,
            showFiltered:true 
        })
        const dateSelected= Date.parse(date)
        const filteredDeals= this.props.deals.map(deal=>{
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
        const dealName=  e.target.name
        const dealValue= e.target.value

        const dealPayload = {
            dealName,
            dealValue
        }
        if(!this.props.isEditing){
            
            this.props.newDealDetails(dealPayload)
        }
    }
    
    saveDeal=()=>{
        const dealPayload= this.props.newDealInput.newDeal
        if(!dealPayload.dealName || !dealPayload.dealAmount ){
            return
        }
    
        fetch('http://localhost:3001/api/deal/addDeal',
            {method: 'POST', body: JSON.stringify(dealPayload),
                headers:{"Content-Type": "application/json"}
            })
            .then(res => res.json()) 
            .then((res)=>{ 
                this.loadDeals()
                this.props.saveNewD(res)
            })    
            .catch(err=>console.log('error ', err))
    }
    
    editDealMethod(index){
        if(this.props.isEditing){
            return
        }
        this.setState({editIndex:index})
        
        const dealToEdit = this.props.deals[index]
        this.props.editDeal(dealToEdit)
    }
    
    render() {
        const {dealName,dealAmount} = this.props.newDealInput.newDeal
        let deals=  this.props.deals.length>0 &&!this.state.showFiltered ? this.props.deals.map((deal,index)=>{
            return(
                <div key={index} onClick={()=>this.editDealMethod(index)}>
                    <div className='dealData-container'>
                        <p><b>Deal</b> : {deal.title}</p>
                        <p><b>Amount</b> : {deal.amountRequired}</p>
                    </div>
                    {
                        this.props.isEditing && 
                            this.state.editIndex === index
                            && <Edit/>
                    }
                </div>
            )
        })
        : this.state.showFiltered ?  this.state.filteredDeals.map((deal,index)=>{
            return(
                <div key={index} 
                    onClick={(index)=>this.editDealMethod(index)}>
                    <p className='DealParagraph' >{deal.title}</p>
                </div>
            )
        })           
        : '...'
        let stats = this.props.stats.length>0 ?this.props.stats.map((deal,index)=>{
            return(
                <div key={index} className='Stats'>
                    <p>Number of Deals: {deal.deals_count}</p>
                    <p>Total Amount: {deal.total_amount}</p>
                    <p>Average Amount:{deal.avg_amount.toFixed(0)}</p>
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
                            <p>(click deal to edit it)</p>
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
                                <h3>{!this.props.isEditing ? 'Add Deal': 'Edit Deal'}</h3>
                                <form action="">
                                    
                                    <input type="text" className='Input' name='dealName' value={dealName} 
                                            onChange={this.addDealDetails} placeholder='deal name'/>
                                    <input type="text" className='Input' name='dealAmount'  value={dealAmount}       
                                            onChange={this.addDealDetails} placeholder='amount'/>
                                </form>
                                <button className="addBtn" onClick={()=>this.saveDeal()}>Save New Deal</button>
                            </div>
                        </main>
                    </div>
                );
            }
        }
    
    
const mapStateToProps = state=>{
    return{
        deals:state.dealReducer.deals,
        newDealInput:state.dealReducer,
        stats:state.dealReducer.stats,
        isEditing:state.dealReducer.edit,
        dealToEdit:state.dealReducer.dealToEdit,
        reloadAfterUpdate:state.dealReducer.reloadAfterUpdate
    }
}  

const mapDispatchToProps = dispatch=>{
    return{
        addDeals:(deals)=>dispatch(loadDeals(deals)),
        newDealDetails:(details)=>dispatch(creatingNewDeal(details)),
        saveNewD:(newDeal)=>dispatch(saveNewDeal(newDeal)),
        getStats:(stats)=>dispatch(loadStats(stats)),
        editDeal:(deal)=>dispatch(editDeal(deal)),
        endUpdate:()=>dispatch(updateTerminated())
    }
}
  
        
export default connect(mapStateToProps,mapDispatchToProps)(App)
